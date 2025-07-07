import os
from pathlib import Path
from PyPDF2 import PdfReader

folder = Path('thestories')
valid_files = []
skipped_files = []

for pdf_file in folder.glob('*.pdf'):
    try:
        reader = PdfReader(str(pdf_file))
        # Try reading number of pages to trigger errors
        _ = len(reader.pages)
        valid_files.append(str(pdf_file))
    except Exception as e:
        skipped_files.append((str(pdf_file), str(e)))

print("VALID_PDFS_START")
for f in valid_files:
    print(f)
print("VALID_PDFS_END")

print("\nSKIPPED_PDFS_START")
for f, err in skipped_files:
    print(f"{f} -- {err}")
print("SKIPPED_PDFS_END")
