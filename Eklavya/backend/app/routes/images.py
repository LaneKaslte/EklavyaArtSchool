import logging

from fastapi import APIRouter, HTTPException, Response
from app.blob import (
    GALLERY_CONTAINER,
    KIDS_CONTAINER,
    ensure_containers,
    get_all_images,
    get_heic_as_jpeg,
    get_random_images,
    is_heic,
)

router = APIRouter()

@router.on_event("startup")
def startup():
    ensure_containers()

@router.get("/images/gallery")
def get_gallery_images(count: int = 12):
    return {"images": get_random_images("gallery", count)}

@router.get("/images/gallery/all")
def get_all_gallery_images():
    return {"images": get_all_images("gallery")}

@router.get("/images/kids")
def get_kids_images(count: int = 12):
    return {"images": get_random_images("kids", count)}


@router.get("/images/file/{container}/{name:path}")
def get_converted_image(container: str, name: str):
    """Serve a HEIC/HEIF blob as JPEG so every browser can display it."""
    if container not in (GALLERY_CONTAINER, KIDS_CONTAINER) or not is_heic(name):
        raise HTTPException(status_code=404, detail="Image not found")
    try:
        data = get_heic_as_jpeg(container, name)
    except Exception as e:
        logging.warning(f"Could not convert {container}/{name}: {e}")
        raise HTTPException(status_code=404, detail="Image not found")
    return Response(
        content=data,
        media_type="image/jpeg",
        headers={"Cache-Control": "public, max-age=86400"},
    )
