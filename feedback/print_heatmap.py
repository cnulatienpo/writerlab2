def print_heatmap(heatmap_data):
    """
    Prints a clean visual summary of the heatmap in the terminal.

    Args:
        heatmap_data (dict): Heatmap structure from `build_heatmap()`.
    """
    print("\n=== HEATMAP REPORT ===\n")

    # Print scene scores
    print("Scene Scores:")
    for idx, scene in enumerate(heatmap_data["scene_scores"]):
        print(f"  Scene {idx + 1}:")
        for element, score in scene.items():
            print(f"    {element.title()}: {score}")
        print()

    # Print chapter averages
    print("Chapter Averages:")
    for element, avg in heatmap_data["chapter_averages"].items():
        print(f"  {element.title()}: {avg}")
    print()

    # Print feedback notices
    if heatmap_data.get("uncertainties"):
        print("⚠️ Machine Limitations:")
        for note in heatmap_data["uncertainties"]:
            print(f"  - {note}")
    else:
        print("✅ No uncertainty notices.")

    print("\n======================\n")
