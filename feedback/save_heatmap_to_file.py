import json
import os

def save_heatmap_to_file(heatmap_data, output_dir="heatmaps", filename="heatmap.json"):
    """
    Saves the heatmap dictionary as a formatted JSON file.

    Args:
        heatmap_data (dict): The full heatmap output from `build_heatmap`.
        output_dir (str): Where to save the file.
        filename (str): Output filename (default: 'heatmap.json').
    """
    os.makedirs(output_dir, exist_ok=True)
    path = os.path.join(output_dir, filename)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(heatmap_data, f, indent=2)

    print(f"✅ Heatmap saved to {path}")
