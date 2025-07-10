def render_heatmap_stub(heatmap_data):
    """
    Renders a text-based heatmap view using simple symbols.
    Each score is translated to a 🔥 level.

    Args:
        heatmap_data (dict): Structured heatmap object.
    """
    def flame_bar(score):
        # Map 0–10 to flame count
        flames = int(round(score))
        return "🔥" * flames + "·" * (10 - flames)

    print("\n--- HEATMAP UI STUB ---\n")

    for idx, scene in enumerate(heatmap_data["scene_scores"]):
        print(f"Scene {idx + 1}:")
        for element, score in scene.items():
            print(f"  {element.ljust(10)}: {flame_bar(score)} ({score})")
        print()

    print("Chapter Averages:")
    for element, avg in heatmap_data["chapter_averages"].items():
        print(f"  {element.ljust(10)}: {flame_bar(avg)} ({avg})")
    
    print("\n-----------------------\n")
