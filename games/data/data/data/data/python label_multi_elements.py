import os
import time
import pandas as pd
from tqdm import tqdm
import openai

# === CONFIGURATION ===
ELEMENTS = ["conflict", "stakes", "change", "decision"]
INPUT_CSV = "deepseek_dataset.csv"
OUTPUT_CSV = "labeled_multi_elements.csv"

# Set up Deepseek API (OpenAI-compatible)
openai.api_key = "sk-0c5deb25d184480db47c2b9ad42eaac3"
openai.api_base = "https://api.deepseek.com/v1"
MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")

# Load your dataset
df = pd.read_csv(INPUT_CSV)

print(f"Starting multi-element labeling for elements: {', '.join(ELEMENTS)}")

for element in ELEMENTS:
    print(f"\nLabeling element: {element}")
    labels = []
    for text in tqdm(df["text"], desc=f"Labeling {element}"):
        prompt = (
            f"Rate the presence of the narrative element '{element}' in the following text snippet. "
            "Respond with exactly one word: low, medium, or high.\n\n"
            f"Text:\n{text}"
        )
        try:
            response = openai.ChatCompletion.create(
                model=MODEL,
                messages=[
                    {"role": "system", "content": "You are an expert literary analyst."},
                    {"role": "user", "content": prompt}
                ]
            )
            label = response.choices[0].message.content.strip().lower()
        except Exception as e:
            print(f"Error labeling element '{element}': {e}")
            label = "error"
        labels.append(label)
        time.sleep(1)  # Pause to respect API rate limits
    df[element] = labels

df.to_csv(OUTPUT_CSV, index=False)
print(f"\nAll elements labeled and saved to {OUTPUT_CSV}")