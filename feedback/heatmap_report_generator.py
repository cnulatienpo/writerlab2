def generate_heatmap_report(chapter_title, scene_scores, averaged_scores):
    report = {
        "chapter_title": chapter_title,
        "summary": {},
        "scene_breakdown": [],
        "warnings": [],
    }

    # List of elements we're tracking
    core_elements = ["desire", "stakes", "conflict", "decision", "change"]

    # --- Summary Section ---
    report["summary"]["average_element_scores"] = averaged_scores

    # --- Uncertainty Flags & Machine Limits ---
    warnings = []
    for element in core_elements:
        if averaged_scores[element] < 2:
            warnings.append(f"⚠️ Low potency detected for '{element}' across scenes.")

    # Example machine honesty line
    warnings.append("⚠️ Note: Machines cannot reliably detect humor, irony, cliché, or originality. These are human judgments.")

    report["warnings"] = warnings

    # --- Scene-by-Scene Breakdown ---
    for scene in scene_scores:
        scene_data = {
            "scene_title": scene["scene_title"],
            "element_scores": scene["element_scores"],
            "notes": []
        }

        # Example inline uncertainty blurbs
        for element, score in scene["element_scores"].items():
            if score <= 1:
                scene_data["notes"].append(f"'{element}' may be missing or unclear.")
            elif score == 3:
                scene_data["notes"].append(f"'{element}' is present but might lack emotional force.")

        report["scene_breakdown"].append(scene_data)

    return report
