import base64
import re
import os

files = ['BlinkedIt AI Home.svg', 'Subscription Review.svg', 'Friends Circle.svg']

for filename in files:
    print(f"=== {filename} ===")
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    matches = re.findall(r'data:image/(png|jpeg|jpg);base64,([^"\'\s>]+)', content)
    print(f"Found {len(matches)} images")
    
    prefix = filename.replace('.svg', '').replace(' ', '_')
    for idx, (img_type, b64_data) in enumerate(matches):
        out_filename = f"{prefix}_{idx}.{img_type}"
        out_path = os.path.join("c:\\Users\\Admin\\Desktop\\NXTGP_MVP", out_filename)
        with open(out_path, 'wb') as out_f:
            out_f.write(base64.b64decode(b64_data))
        print(f"  Saved {out_filename} ({os.path.getsize(out_path)} bytes)")
