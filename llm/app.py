from flask import Flask, jsonify, request
from transformers import pipeline
import logging
from evaluate import load

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

app = Flask(__name__)
summarizer = pipeline("summarization", model="pszemraj/led-large-book-summary")
bertscore = load("bertscore")


def add_hallucination_score(input_data, summary, scizo_meter, max_length):
    logging.info("Calculating hallucination score")
    summary2 = summarizer(input_data, do_sample=True, temperature=scizo_meter, max_length=max_length)
    summaries = [s['summary_text'] for s in summary]
    summaries2 = [s['summary_text'] for s in summary2]
    results = bertscore.compute(predictions=summaries2, references=summaries, lang="en")
    f1_scores = results['f1']
    for s, f in zip(summary, f1_scores):
        s['hallucination_score'] = f
    return summary


@app.route("/summarize", methods=["POST"])
def summarize():
    input_data = request.get_json().get("input_data", [])
    scizo_meter = request.get_json().get("scizo_meter")
    max_length = request.get_json().get("max_length")
    compute_hallucination_score = request.get_json().get("compute_hallucination_score")
    do_sample = False if scizo_meter == 1.0 else True

    logging.info("Processing summary request")
    logging.info(f"scizo_meter: {scizo_meter}")
    logging.info(f"max_length: {max_length}")
    logging.info(f"do_sample: {do_sample}")
    logging.info(f"compute_hallucination_score: {compute_hallucination_score}")

    summary = summarizer(input_data, do_sample=do_sample, temperature=scizo_meter, max_length=max_length)
    if compute_hallucination_score:
        summary = add_hallucination_score(input_data, summary, scizo_meter, max_length)

    logging.info("Summary ready")
    return jsonify(summary)


if __name__ == "__main__":
    app.run(host="0.0.0.0")
