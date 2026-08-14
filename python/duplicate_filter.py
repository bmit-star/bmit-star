import sys
import json
import cv2
from PIL import Image
import imagehash

def compute_perceptual_hash(image_path):
    """
    Computes average hash and perceptual hash using imagehash library and OpenCV.
    Returns hex string representing image signature.
    """
    try:
        pil_img = Image.open(image_path)
        phash = str(imagehash.phash(pil_img))
        ahash = str(imagehash.average_hash(pil_img))
        dhash = str(imagehash.dhash(pil_img))
        return {
            "phash": phash,
            "ahash": ahash,
            "dhash": dhash
        }
    except Exception as e:
        return {"error": str(e)}

def is_duplicate(hash1, hash2, threshold=5):
    """
    Compares two perceptual hashes.
    Difference <= threshold means near-duplicate or burst photo.
    """
    try:
        h1 = imagehash.hex_to_hash(hash1)
        h2 = imagehash.hex_to_hash(hash2)
        diff = h1 - h2
        return diff <= threshold, diff
    except Exception:
        return False, 999

if __name__ == "__main__":
    if len(sys.argv) > 1:
        img_path = sys.argv[1]
        result = compute_perceptual_hash(img_path)
        print(json.dumps(result))
    else:
        print(json.dumps({"info": "Photo Wall Perceptual Hash & Duplicate Filter Engine V2.1"}))
