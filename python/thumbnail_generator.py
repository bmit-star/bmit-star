#!/usr/bin/env python3
"""
Python script for WebP image optimization and Thumbnail generation
Converts input images into optimized WebP format with soft thumbnail resizing.
"""

import sys
import os
import argparse
from PIL import Image

def generate_webp_and_thumbnail(input_path, output_dir=None, max_dim=1920, thumb_dim=300, quality=85):
    if not os.path.exists(input_path):
        print(f"Error: Input file {input_path} does not exist.")
        return False

    if not output_dir:
        output_dir = os.path.dirname(input_path)

    base_name = os.path.splitext(os.path.basename(input_path))[0]
    webp_path = os.path.join(output_dir, f"{base_name}_opt.webp")
    thumb_path = os.path.join(output_dir, f"{base_name}_thumb.webp")

    try:
        with Image.open(input_path) as img:
            # Convert RGBA to RGB if saving to WebP
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                bg = Image.new('RGB', img.size, (255, 255, 255))
                bg.paste(img, mask=img.split()[-1])
                img = bg
            elif img.mode != 'RGB':
                img = img.convert('RGB')

            # Optimized Main Image
            img_opt = img.copy()
            img_opt.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
            img_opt.save(webp_path, 'WEBP', quality=quality, optimize=True)

            # Thumbnail Image
            img_thumb = img.copy()
            img_thumb.thumbnail((thumb_dim, thumb_dim), Image.Resampling.LANCZOS)
            img_thumb.save(thumb_path, 'WEBP', quality=75, optimize=True)

            print(f"Success: Generated {webp_path} and {thumb_path}")
            return True
    except Exception as e:
        print(f"Error processing image: {e}")
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="WebP & Thumbnail Image Generator")
    parser.add_argument("input", help="Path to input image file")
    parser.add_argument("--outdir", help="Output directory path")
    args = parser.parse_args()

    generate_webp_and_thumbnail(args.input, args.outdir)
