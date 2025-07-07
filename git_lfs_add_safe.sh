#!/bin/bash
set -e

git lfs install

# Remove sample PDF safely
if git ls-files --error-unmatch your-large-files.pdf > /dev/null 2>&1; then
  git rm --cached your-large-files.pdf
  rm -f your-large-files.pdf
  echo "Removed sample PDF your-large-files.pdf"
else
  echo "Sample PDF your-large-files.pdf not found, skipping removal"
fi

git lfs track "*.pdf"
git add .gitattributes

# Run Python to get valid PDFs list
VALID_PDFS=$(python3 check_pdfs.py | sed -n '/VALID_PDFS_START/,/VALID_PDFS_END/p' | grep -v 'VALID_PDFS_START' | grep -v 'VALID_PDFS_END')

# Add only valid PDFs
for file in $VALID_PDFS; do
  echo "Adding $file"
  git add "$file"
done

# Commit and push
git commit -m "Add valid PDFs with Git LFS and remove sample placeholder"
git lfs prune
git push
