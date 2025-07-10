from feedback.batch_prompt import split_chapter_into_scenes
from feedback.call_deepseek_api_json import call_deepseek_api_json
from feedback.extract_element_scores_v2 import extract_element_scores
from feedback.build_heatmap import build_heatmap
from feedback.export_heatmap_json import export_heatmap_to_json
from feedback.ui_stub_heatmap_view import render_heatmap_stub

# ---------------- User Inputs ----------------
CHAPTER_TEXT = """Replace this text with your full chapter.\nEach scene should be separated by blank lines or ### markers."""

ELEMENTS_TO_CHECK = ["desire", "stakes", "conflict"]
# --------------------------------------------


def main():
    print("Splitting chapter into scenes...")
    scenes = split_chapter_into_scenes(CHAPTER_TEXT)
    print(f"Detected {len(scenes)} scenes. Sending to DeepSeek...")

    scene_scores = []
    for idx, scene in enumerate(scenes, 1):
        print(f"\nProcessing scene {idx}/{len(scenes)}...")
        raw = call_deepseek_api_json(scene, ELEMENTS_TO_CHECK)
        scores = extract_element_scores(raw)
        scene_scores.append(scores)

    print("\nBuilding heatmap...")
    heatmap = build_heatmap(scene_scores)

    print("Exporting heatmap JSON...")
    export_heatmap_to_json(heatmap, filename="chapter_heatmap.json")

    print("Rendering heatmap to console...")
    render_heatmap_stub(heatmap)


if __name__ == "__main__":
    main()
