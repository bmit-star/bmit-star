import sys
import json
from PIL import Image

def convert_to_webp(input_path, output_path, max_width=2048, quality=85):
    """
    Resizes image to max width 2048px and converts to WebP.
    """
    try:
        with Image.open(input_path) as img:
            w, h = img.size
            if w > max_width:
                new_h = int(h * (max_width / float(w)))
                img = img.resize((max_width, new_h), Image.Resampling.LANCZOS)
            
            img.save(output_path, "WEBP", quality=quality)
            return {
                "success": True,
                "outputPath": output_path,
                "dimensions": img.size,
                "format": "WEBP"
            }
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) > 2:
        in_p = sys.argv[1]
        out_p = sys.argv[2]
        res = convert_to_webp(in_p, out_p)
        print(json.dumps(res))
    else:
        print(json.dumps({"info": "WebP Image Converter V2.1 (Max 2048px)"}))
