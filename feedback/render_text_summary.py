def render_text_summary(heatmap):
    """
    Generate a short, clear textual summary of chapter performance.

    Args:
        heatmap (dict): Output from build_heatmap().

    Returns:
        str: Text summary highlighting overall strengths and standout scenes.
    """
    summary_lines = []
    chapter_avg = heatmap["chapter_summary"]
    summary_lines.append("🟡 Chapter Summary:\n")

    for element, avg in chapter_avg.items():
        summary_lines.append(f"– {element.capitalize()}: avg potency {avg}/5")

    summary_lines.append("\n📘 Scene Highlights:\n")

    for scene in heatmap["scene_breakdown"]:
        standout = []
        for element, rel in scene["relative"].items():
            if abs(rel) >= 1:
                trend = "↑" if rel > 0 else "↓"
                standout.append(f"{element} {trend}{abs(rel)}")
        if standout:
            summary_lines.append(f"– {scene['scene_title']}: " + ", ".join(standout))

    if not any(len(scene["relative"]) > 0 for scene in heatmap["scene_breakdown"]):
        summary_lines.append("No major scene variations detected.")

    return "\n".join(summary_lines)
