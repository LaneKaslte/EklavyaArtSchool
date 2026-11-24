from fastapi import APIRouter
from app.blob import get_random_images, get_all_images, ensure_containers

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
