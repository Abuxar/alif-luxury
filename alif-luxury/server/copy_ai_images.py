import os
import glob
import shutil
import json

src_dir = r"C:\Users\Abuxar\.gemini\antigravity\brain\044bf4a1-72b6-496f-a7d7-bdcbe39f4cca"
dest_dir = r"c:\Users\Abuxar\Desktop\vibe coding\alif-luxury\public\images\ai_generated"

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

images = glob.glob(os.path.join(src_dir, "ai_pak_*.png"))

copied_filenames = []
for i, img_path in enumerate(images):
    new_name = f"ai_pak_{i+1}.png"
    dest_path = os.path.join(dest_dir, new_name)
    shutil.copy(img_path, dest_path)
    copied_filenames.append(f"/images/ai_generated/{new_name}")

print(f"Copied {len(images)} AI images to public directory.")

with open('server/ai_images.json', 'w') as f:
    json.dump(copied_filenames, f)
