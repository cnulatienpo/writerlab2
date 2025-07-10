from feedback.batch_prompt import split_chapter_into_scenes
from feedback.call_deepseek_api_json import call_deepseek_api_json
from feedback.extract_element_scores_v2 import extract_element_scores
from feedback.build_heatmap import build_heatmap
from feedback.export_heatmap_json import export_heatmap_to_json
from feedback.ui_stub_heatmap_view import render_heatmap_stub

# 📝 Step 1: Insert your chapter text here
chapter_text = """
Your full chapter goes here. It can be long.
This will be split into individual scenes based on paragraph breaks or logic.
"""

# ⚙️ Step 2: Choose which elements to analyze
elements_to_check = ["desire", "stakes", "conflict", "decision", "change"]

# 🚦 Step 3: Run the pipeline
print("Splitting chapter into scenes...")
scenes = split_chapter_into_scenes(chapter_text)

print(f"Detected {len(scenes)} scenes. Sending to DeepSeek...")
scene_results = [call_deepseek_api_json(scene, elements_to_check) for scene in scenes]

print("Extracting scores...")
scene_scores = [extract_element_scores(result) for result in scene_results]

print("Building heatmap...")
heatmap = build_heatmap(scene_scores)

print("Saving heatmap to JSON...")
export_heatmap_to_json(heatmap, filename="chapter_heatmap.json")

print("Rendering heatmap to console...\n")
render_heatmap_stub(heatmap)
