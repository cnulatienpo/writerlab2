from call_deepseek_api_json import call_deepseek_api_json
from extract_element_scores_v2 import extract_element_scores
from score_aggregator import aggregate_element_scores
from build_heatmap import build_heatmap
from save_heatmap_to_file import save_heatmap_to_file

def run_full_feedback_pipeline(scene_list, prompt_template):
    """
    Full pipeline to generate heatmap from a list of scenes.

    Args:
        scene_list (list of dicts): Each dict contains 'title' and 'text' for a scene.
        prompt_template (str): The prompt template to send to the machine.

    Returns:
        dict: Final heatmap dictionary.
    """
    parsed_scene_outputs = []

    for scene in scene_list:
        scene_title = scene["title"]
        scene_text = scene["text"]

        machine_output = call_deepseek_api_json(prompt_template, scene_text)
        parsed_scene = extract_element_scores(machine_output)
        parsed_scene["scene_title"] = scene_title

        parsed_scene_outputs.append(parsed_scene)

    chapter_avg = aggregate_element_scores(parsed_scene_outputs)
    heatmap = build_heatmap(parsed_scene_outputs, chapter_avg)

    save_heatmap_to_file(heatmap)
    return heatmap
