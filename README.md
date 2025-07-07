# writerlab

## Setup Instructions

The following commands install PDF handling, OCR, and text cleanup tools used in the project:

```
pip install --upgrade pip
pip install pdfminer.six
pip install pytesseract
sudo apt-get update && sudo apt-get install -y tesseract-ocr
pip install PyPDF2 pdf2image
pip install pillow opencv-python
pip install nltk spacy
python -m spacy download en_core_web_sm
```

