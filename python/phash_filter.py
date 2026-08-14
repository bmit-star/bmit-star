#!/usr/bin/env python3
"""
Python script for Perceptual Hash (pHash) Image Duplicate Detection
Uses Pillow / ImageHash / OpenCV logic to detect near-duplicate guest photos uploaded to Photo Wall.
"""

import sys
import json
import argparse
from PIL import Image

def compute_phash(image_path, hash_size=8):
    """
    Computes a simplified perceptual hash for an image file.
    1. Convert to grayscale
    2. Resize to hash_size x hash_size (default 8x8)
    3. Calculate average pixel value
    4. Construct 64-bit binary hash string based on pixels > average
    """
    try:
        with Image.open(image_path) as img:
            img = img.convert('L').resize((hash_size, hash_size), Image.Resampling.LANCZOS)
            pixels = list(img.getdata())
            avg = sum(pixels) / len(pixels)
            bits = "".join(["1" if p > avg else "0" for p in pixels])
            hex_hash = f"{int(bits, 2):016x}"
            return hex_hash
    except Exception as e:
        return None

def hamming_distance(hash1, hash2):
    """Calculates Hamming Distance between two hex hash strings."""
    if not hash1 or not hash2 or len(hash1) != len(hash2):
        return 999
    try:
        val1 = int(hash1, 16)
        val2 = int(hash2, 16)
        return bin(val1 ^ val2).count("1")
    except ValueError:
        return 999

def calculate_similarity_percent(dist, hash_bits=64):
    """Converts hamming distance to similarity percentage (0-100%)."""
    similarity = max(0, (hash_bits - dist) / hash_bits * 100)
    return round(similarity, 2)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="P-Hash Duplicate Image Detector")
    parser.add_argument("--img1", help="Path to first image")
    parser.add_argument("--img2", help="Path to second image")
    parser.add_argument("--threshold", type=int, default=10, help="Max Hamming Distance threshold for duplicate")

    args = parser.parse_args()

    if args.img1 and args.img2:
        h1 = compute_phash(args.img1)
        h2 = compute_phash(args.img2)
        dist = hamming_distance(h1, h2)
        sim = calculate_similarity_percent(dist)
        is_duplicate = dist <= args.threshold

        result = {
            "hash1": h1,
            "hash2": h2,
            "hammingDistance": dist,
            "similarityPercent": sim,
            "isDuplicate": is_duplicate
        }
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(json.dumps({"error": "Please provide --img1 and --img2 arguments"}))
