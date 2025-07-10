import os
import time
import pandas as pd
from tqdm import tqdm
import openai

# === CONFIGURATION ===
INPUT_CSV = "deepseek_dataset.csv"  # Your dataset
OUTPUT_CSV = "labeled_dialogue_types.csv"

openai.api_key = "sk-926f63eec9df4db9ac732295b2571613"
openai.api_base = "https://api.deepseek.com/v1"
MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")

df = pd.read_csv(INPUT_CSV)

DIALOGUE_TYPES = [
    "expository",
    "transactional",
    "tactile",
    "emotional",
    "thematic",
    "subtextual",
    "rhythmic",
    "reflective",
    "intimate",
    "confrontational",
    "comedic",
    "symbolic"
]

def build_prompt(dialogue_type, text):
    return (
        f"You are an expert literary analyst.\n\n"
        f"Does the following dialogue show the '{dialogue_type}' type? "
        f"Answer exactly 'yes' or 'no'.\n\n"
        f"Dialogue:\n{text}"
    )

print(f"Labeling dialogue types for {len(df)} texts...")

for dialogue_type in DIALOGUE_TYPES:
    print(f"\nLabeling dialogue type: {dialogue_type}")
    labels = []
    for text in tqdm(df["text"], desc=f"Labeling {dialogue_type}"):
        prompt = build_prompt(dialogue_type, text)
        try:
            response = openai.ChatCompletion.create(
                model=MODEL,
                messages=[
                    {"role": "system", "content": "You are an expert literary analyst."},
                    {"role": "user", "content": prompt}
                ]
            )
            label = response.choices[0].message.content.strip().lower()
            if label not in {"yes", "no"}:
                label = "no"
        except Exception as e:
            print(f"Error labeling '{dialogue_type}': {e}")
            label = "no"
        labels.append(label)
        time.sleep(1)  # Adjust per API limits
    df[dialogue_type] = labels

df.to_csv(OUTPUT_CSV, index=False)
print(f"\nDone! Dialogue types labels saved to {OUTPUT_CSV}")