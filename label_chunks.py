import os
import time
import pandas as pd
from tqdm import tqdm
import openai

# === CONFIGURATION ===
ELEMENT = "DESIRE"  # Change to any element you want to label, e.g. "CONFLICT"
INPUT_CSV = "deepseek_dataset.csv"
OUTPUT_CSV = f"labeled_{ELEMENT.lower()}.csv"

# Set up Deepseek API (works with OpenAI's SDK)
openai.api_key = os.getenv("DEEPSEEK_API_KEY")
openai.api_base = "https://api.deepseek.com/v1"
MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")

# Load your dataset
df = pd.read_csv(INPUT_CSV)

labels = []

print(f"Starting labeling for: {ELEMENT}")
for idx, text in enumerate(tqdm(df["text"], desc="Labeling chunks")):
    prompt = (
        f"Rate the presence of the narrative element '{ELEMENT}' in the following text snippet. "
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
        print(f"Error on chunk {idx}: {e}")
        label = "error"
    labels.append(label)
    time.sleep(1)  # Pause to respect rate limits

df["load_level"] = labels
df.to_csv(OUTPUT_CSV, index=False)
print(f"Labeled dataset saved to {OUTPUT_CSV}")
