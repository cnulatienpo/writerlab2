import os
import shutil

# Define moves as (source, destination) tuples
moves = [
    # Move Python scripts to scripts/
    ("add_style_columns.py", "scripts/add_style_columns.py"),
    ("check_pdfs.py", "scripts/check_pdfs.py"),
    ("main.py", "scripts/main.py"),
    ("writing_ui.py", "scripts/writing_ui.py"),
    # Move CSVs to data/
    ("labeled_desire.csv", "data/labeled_desire.csv"),
    ("labeled_desire_visual.csv", "data/labeled_desire_visual.csv"),
    ("labeled_multi_elements.csv", "data/labeled_multi_elements.csv"),
    ("labeled_sensory_detail.csv", "data/labeled_sensory_detail.csv"),
    ("deepseek_dataset.csv", "data/deepseek_dataset.csv"),
    # Move docs to docs/
    ("README.md", "docs/README.md"),
    ("writing_game_website_checklist.md", "docs/writing_game_website_checklist.md"),
    ("prompts.json", "docs/prompts.json"),
]

# Create target directories if they don't exist
for _, dest in moves:
    folder = os.path.dirname(dest)
    if not os.path.exists(folder):
        os.makedirs(folder)

# Move files
for src, dest in moves:
    if os.path.exists(src):
        shutil.move(src, dest)
        print(f"Moved {src} -> {dest}")
    else:
        print(f"File not found: {src}")
