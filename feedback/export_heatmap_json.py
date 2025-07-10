import json
import os

def export_heatmap_to_json(heatmap_data, output_dir="outputs", filename="heatmap.json"):
    """
    Writes the heatmap object to a JSON file.

    Args:
        heatmap_data (dict): Output from build_heatmap().
        output_dir (str): Folder to write to.
        filename (str): Name of the JSON file.
    """
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, filename)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(heatmap_data, f, indent=4)

    print(f"✅ Heatmap exported to {output_path}")
