import re

file_path = r"c:\Users\saura\Downloads\breakable_works_007788.framer.app\breakable-works-007788.framer.app\index.html"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "joseph" in line.lower() or "alexander" in line.lower():
        print(f"Line {i+1}: {line.strip()[:150]}...")
