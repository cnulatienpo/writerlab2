import os
import time
import pandas as pd
from tqdm import tqdm
import openai

# === CONFIGURATION ===
INPUT_CSV = "deepseek_dataset.csv"       # Your input data file with 'text' column
OUTPUT_CSV = "labeled_sensory_detail.csv" # Output file with sensory detail labels

# Set up Deepseek API (OpenAI-compatible)
openai.api_key = "sk-0c5deb25d184480db47c2b9ad42eaac3"  # Replace with your real key or set as env var
openai.api_base = "https://api.deepseek.com/v1"
MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")

# Load your dataset
df = pd.read_csv(INPUT_CSV)

# Sensory detail instructions to guide labeling:
SENSORY_DETAIL_PROMPT = (
    "You are an expert literary analyst. \n\n"
    "Rate the presence of *sensory detail* in the following text snippet.\n"
    "Sensory detail means the writing makes you *feel something in your body* — "
    "like shivering, hunger, warmth, itch, or a vivid physical reaction. "
    "It can also trigger a memory or emotional reaction through detail, "
    "or slow you down as you immerse in the texture, smell, taste, or touch described.\n"
    "Respond with exactly one word: low, medium, or high.\n\n"
    "Text:\n"
)

labels = []

print(f"Labeling sensory detail for {len(df)} text entries...")

for text in tqdm(df["text"], desc="Labeling sensory detail"):
    prompt = SENSORY_DETAIL_PROMPT + text
    try:
        response = openai.ChatCompletion.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You are an expert literary analyst."},
                {"role": "user", "content": prompt}
            ]
        )
        label = response.choices[0].message.content.strip().lower()
        # Sanitize label: force to one of expected values or 'low' if unexpected
        if label not in {"low", "medium", "high"}:
            label = "low"
    except Exception as e:
        print(f"Error labeling text: {e}")
        label = "low"  # Default safe label on error
    labels.append(label)
    time.sleep(1)  # Adjust if rate limits allow faster calls

df["sensory_detail"] = labels
df.to_csv(OUTPUT_CSV, index=False)

print(f"\nDone! Sensory detail labels saved to {OUTPUT_CSV}")
