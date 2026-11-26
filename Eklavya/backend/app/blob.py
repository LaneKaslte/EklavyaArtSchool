import io
import os
import random
from collections import OrderedDict
from urllib.parse import quote

from azure.storage.blob import BlobServiceClient

CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
GALLERY_CONTAINER = os.getenv("AZURE_CONTAINER_GALLERY", "gallery")
KIDS_CONTAINER = os.getenv("AZURE_CONTAINER_KIDS", "kids")

_blob_service_client = None

# Most browsers (everything except recent Safari) can't display HEIC/HEIF,
# so blobs with these extensions are served through the API as JPEG instead.
HEIC_EXTENSIONS = ('.heic', '.heif')
_JPEG_CACHE_MAX = 64
_jpeg_cache: "OrderedDict[tuple[str, str], bytes]" = OrderedDict()


def is_heic(name: str) -> bool:
    return name.lower().endswith(HEIC_EXTENSIONS)

def _get_blob_service_client():
    global _blob_service_client
    if _blob_service_client is None:
        if not CONNECTION_STRING:
            raise ValueError("AZURE_STORAGE_CONNECTION_STRING is not set")
        _blob_service_client = BlobServiceClient.from_connection_string(CONNECTION_STRING)
    return _blob_service_client

def ensure_containers():
    try:
        client = _get_blob_service_client()
        try:
            client.create_container(GALLERY_CONTAINER)
        except:
            pass
        try:
            client.create_container(KIDS_CONTAINER)
        except:
            pass
    except Exception as e:
        print(f"Warning: Could not ensure containers: {e}")

def _list_blobs(container_name: str):
    try:
        client = _get_blob_service_client()
        container_client = client.get_container_client(container_name)
    except Exception as e:
        print(f"Error getting blob service client: {e}")
        return None, []

    try:
        return container_client, list(container_client.list_blobs())
    except Exception as e:
        print(f"Error listing blobs from {container_name}: {e}")
        return container_client, []

def _to_image_dicts(container_client, blobs):
    # Generate proper blob URLs
    # For local Azurite: use localhost for browser access
    # For production Azure: use blob client URL
    urls = []
    for blob in blobs:
        if is_heic(blob.name):
            # Relative URL; the frontend resolves it against the API base URL.
            url = f"/api/images/file/{container_client.container_name}/{quote(blob.name)}"
        else:
            blob_client = container_client.get_blob_client(blob.name)
            url = blob_client.url

            # If using Azurite (contains 'devstoreaccount1'), replace internal Docker hostname with localhost
            if 'devstoreaccount1' in url and 'azurite' in url:
                url = url.replace('azurite', 'localhost')

        urls.append({
            "name": blob.name,
            "url": url
        })

    return urls

def get_random_images(container_name: str, count: int = 12):
    container_client, blobs = _list_blobs(container_name)
    if not blobs:
        return []
    selected = random.sample(blobs, min(count, len(blobs)))
    return _to_image_dicts(container_client, selected)

def get_all_images(container_name: str):
    """Return every image in the container in a stable (name-sorted) order."""
    container_client, blobs = _list_blobs(container_name)
    if not blobs:
        return []
    blobs.sort(key=lambda b: b.name.lower())
    return _to_image_dicts(container_client, blobs)


def get_heic_as_jpeg(container_name: str, blob_name: str) -> bytes:
    """Download a HEIC/HEIF blob and return it converted to JPEG (cached in memory)."""
    key = (container_name, blob_name)
    if key in _jpeg_cache:
        _jpeg_cache.move_to_end(key)
        return _jpeg_cache[key]

    from PIL import Image, ImageOps
    from pillow_heif import register_heif_opener
    register_heif_opener()

    blob_client = _get_blob_service_client().get_blob_client(container=container_name, blob=blob_name)
    raw = blob_client.download_blob().readall()

    with Image.open(io.BytesIO(raw)) as img:
        img = ImageOps.exif_transpose(img).convert("RGB")
        out = io.BytesIO()
        img.save(out, format="JPEG", quality=88, optimize=True)
    data = out.getvalue()

    _jpeg_cache[key] = data
    if len(_jpeg_cache) > _JPEG_CACHE_MAX:
        _jpeg_cache.popitem(last=False)
    return data
