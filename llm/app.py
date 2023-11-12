from flask import Flask, jsonify, request
from transformers import pipeline
import os


app = Flask(__name__)
#print(f"DIRRRR: {os.listdir()}")
summarizer = pipeline("summarization", model="pszemraj/led-large-book-summary")

@app.route("/summarize", methods=["POST"])
def predict():
    input_data = request.get_json().get("input_data", [])
    skizo_meter = request.get_json().get("scizo_meter")
    summary = summarizer(input_data, do_sample=True, temperature=skizo_meter)
    return jsonify(summary)

if __name__ == "__main__":
    app.run(host="0.0.0.0")