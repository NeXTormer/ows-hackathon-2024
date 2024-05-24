import transformers
import torch
import sys

input = " ".join(sys.argv[1:])

summarizer = transformers.pipeline("summarization", model="facebook/bart-large-cnn")

out = summarizer(input, max_length=130, min_length=30, do_sample=False)

print(out[0]['summary_text'])