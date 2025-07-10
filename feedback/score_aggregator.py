def aggregate_element_scores(scene_scores):
    """
    Input: List of scene score dicts, each with a 'scene_title' and 'element_scores'
    Output: Dict of average scores for each element across the chapter
    """
    core_elements = ["desire", "stakes", "conflict", "decision", "change"]
    total_scores = {element: 0 for element in core_elements}
    counts = {element: 0 for element in core_elements}

    for scene in scene_scores:
        for element in core_elements:
            score = scene["element_scores"].get(element)
            if score is not None:
                total_scores[element] += score
                counts[element] += 1

    averaged_scores = {}
    for element in core_elements:
        if counts[element] > 0:
            averaged_scores[element] = round(total_scores[element] / counts[element], 2)
        else:
            averaged_scores[element] = 0

    return averaged_scores

def aggregate_element_scores(scene_score_list):
    """
    Input: List of parsed scene score dicts (from `parse_scene_scores`)
    Output: Dict of average potency scores across all scenes
    """
    if not scene_score_list:
        return {}

    core_elements = ["desire", "stakes", "conflict", "decision", "change"]
    element_totals = {e: 0 for e in core_elements}
    count = len(scene_score_list)

    for scene in scene_score_list:
        for element in core_elements:
            element_totals[element] += scene["element_scores"].get(element, 0)

    # Flat average
    element_averages = {
        element: round(total / count, 2)
        for element, total in element_totals.items()
    }

    return element_averages

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


