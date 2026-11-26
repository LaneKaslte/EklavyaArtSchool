#!/usr/bin/env python3
"""
Script to upload images to Azure Blob Storage (Azurite for local development)
Usage: python upload_images.py <folder_path> <container_name>
Example: python upload_images.py ./gallery_images gallery
"""

import io
import sys
import os
from azure.storage.blob import BlobServiceClient, ContentSettings

CONNECTION_STRING = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;"

def heic_to_jpeg(file_path):
    """Convert a HEIC/HEIF file to JPEG bytes (needs: pip install pillow pillow-heif)."""
    try:
        from PIL import Image, ImageOps
        from pillow_heif import register_heif_opener
    except ImportError:
        sys.exit("❌ HEIC support needs extra packages: pip install pillow pillow-heif")
    register_heif_opener()
    with Image.open(file_path) as img:
        img = ImageOps.exif_transpose(img).convert("RGB")
        out = io.BytesIO()
        img.save(out, format="JPEG", quality=90, optimize=True)
    return out.getvalue()


def upload_images(folder_path, container_name):
    if not os.path.exists(folder_path):
        print(f"❌ Error: Folder '{folder_path}' does not exist")
        return
    
    blob_service_client = BlobServiceClient.from_connection_string(CONNECTION_STRING)
    
    # Create container if it doesn't exist
    try:
        container_client = blob_service_client.create_container(container_name)
        print(f"✅ Container '{container_name}' created")
    except:
        container_client = blob_service_client.get_container_client(container_name)
        print(f"📦 Using existing container '{container_name}'")
    
    # Upload all images
    supported_formats = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif']
    uploaded = 0
    
    for filename in os.listdir(folder_path):
        if any(filename.lower().endswith(fmt) for fmt in supported_formats):
            file_path = os.path.join(folder_path, filename)

            if filename.lower().endswith(('.heic', '.heif')):
                # Browsers can't display HEIC, so store it as JPEG instead
                blob_name = os.path.splitext(filename)[0] + '.jpg'
                data = heic_to_jpeg(file_path)
                content_settings = ContentSettings(content_type='image/jpeg')
            else:
                blob_name = filename
                with open(file_path, "rb") as f:
                    data = f.read()
                content_settings = None

            blob_client = blob_service_client.get_blob_client(
                container=container_name, 
                blob=blob_name
            )
            blob_client.upload_blob(data, overwrite=True, content_settings=content_settings)
            note = f" (converted from {filename})" if blob_name != filename else ""
            print(f"✅ Uploaded: {blob_name}{note}")
            uploaded += 1
    
    print(f"\n🎉 Successfully uploaded {uploaded} images to '{container_name}' container")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python upload_images.py <folder_path> <container_name>")
        print("Example: python upload_images.py ./my_images gallery")
        sys.exit(1)
    
    folder = sys.argv[1]
    container = sys.argv[2]
    
    print(f"🎨 Uploading images from '{folder}' to '{container}' container...\n")
    upload_images(folder, container)
