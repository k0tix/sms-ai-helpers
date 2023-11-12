from flask import Flask, jsonify, request
from transformers import pipeline
from evaluate import load
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

app = Flask(__name__)
summarizer = pipeline("summarization", model="pszemraj/led-large-book-summary")

@app.route("/summarize", methods=["POST"])
def predict():
    logging.info("Processing summary request")
    input_data = request.get_json().get("input_data", [])
    skizo_meter = request.get_json().get("scizo_meter")
    max_length = request.get_json().get("max_length")
    summary = summarizer(input_data, do_sample=True, temperature=skizo_meter, max_length=max_length)
    logging.info("Summary ready")
    return jsonify(summary)

if __name__ == "__main__":
    app.run(host="0.0.0.0")