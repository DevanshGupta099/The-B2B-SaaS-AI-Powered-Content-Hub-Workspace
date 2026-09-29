#!/usr/bin/env python3
"""
Nexus Content OS - Advanced NLP & Brand Intelligence Engine
Enterprise-grade linguistic telemetry: Readability, Lexical Richness, Voice Governance & Sentiment Polarity.
"""

import sys
import json
import re
import argparse
from typing import Dict, List, Any

# Enterprise B2B Restricted Lexicon
PROHIBITED_BUZZWORDS = [
    "revolutionary", "game-changing", "paradigm shift", "synergy",
    "disruptive", "seamlessly", "delve", "tapestry", "plethora",
    "mission-critical", "best-of-breed", "deep dive"
]

EXECUTIVE_TONE_MARKERS = [
    "strategic", "governance", "telemetry", "throughput", "velocity",
    "architecture", "compliance", "optimization", "infrastructure",
    "deterministic", "scalability", "orchestration", "resilience"
]

class ContentIntelligenceEngine:
    def __init__(self):
        pass

    def count_syllables(self, word: str) -> int:
        word = word.lower().strip(".:;?!")
        if not word:
            return 1
        if len(word) <= 3:
            return 1
        word = re.sub(r'(?:[^laeiouy]|ed|es|e)$', '', word)
        word = re.sub(r'^y', '', word)
        syllables = len(re.findall(r'[aeiouy]{1,2}', word))
        return max(1, syllables)

    def analyze(self, text: str) -> Dict[str, Any]:
        cleaned = text.strip()
        if not cleaned:
            return {"error": "Empty text provided"}

        # Tokenize sentences
        sentences = [s.strip() for s in re.split(r'[.!?]+', cleaned) if s.strip()]
        sentence_count = max(1, len(sentences))

        # Tokenize words
        words = re.findall(r'\b[A-Za-z0-9\'-]+\b', cleaned)
        word_count = max(1, len(words))

        # Syllables & complex words
        total_syllables = sum(self.count_syllables(w) for w in words)
        complex_words = [w for w in words if self.count_syllables(w) >= 3]
        complex_count = len(complex_words)

        # 1. Readability Scores
        # Flesch Reading Ease: 206.835 - (1.015 * ASL) - (84.6 * ASW)
        asl = word_count / sentence_count
        asw = total_syllables / word_count
        flesch_reading_ease = round(206.835 - (1.015 * asl) - (84.6 * asw), 1)
        flesch_reading_ease = max(0.0, min(100.0, flesch_reading_ease))

        # Flesch-Kincaid Grade Level: (0.39 * ASL) + (11.8 * ASW) - 15.59
        fk_grade = round((0.39 * asl) + (11.8 * asw) - 15.59, 1)
        fk_grade = max(1.0, fk_grade)

        # Gunning Fog Index: 0.4 * ((words / sentences) + 100 * (complex / words))
        gunning_fog = round(0.4 * (asl + 100 * (complex_count / word_count)), 1)

        # 2. Lexical Richness & Diversity
        unique_words = set(w.lower() for w in words)
        type_token_ratio = round(len(unique_words) / word_count, 3)

        # 3. Brand Voice & Prohibited Buzzword Linters
        lower_text = cleaned.lower()
        flagged_terms = []
        for term in PROHIBITED_BUZZWORDS:
            pattern = r'\b' + re.escape(term) + r'\b'
            matches = re.findall(pattern, lower_text)
            if matches:
                flagged_terms.append({"term": term, "count": len(matches)})

        governance_score = round(max(0.0, 100.0 - (len(flagged_terms) * 12.5)), 1)

        # 4. Executive Tone Index
        exec_markers_found = [
            term for term in EXECUTIVE_TONE_MARKERS 
            if re.search(r'\b' + re.escape(term) + r'\b', lower_text)
        ]
        exec_tone_index = round(min(100.0, (len(exec_markers_found) / 8.0) * 100.0), 1)

        # 5. Passive Voice Detection
        passive_regex = re.compile(r'\b(am|are|is|was|were|be|been|being)\s+([a-z]+ed|[a-z]+en)\b', re.IGNORECASE)
        passive_matches = passive_regex.findall(cleaned)
        passive_count = len(passive_matches)
        passive_percent = round((passive_count / sentence_count) * 100.0, 1)

        # Estimated reading time in seconds (average 200 words per minute)
        reading_time_seconds = round((word_count / 200.0) * 60)

        return {
            "status": "success",
            "telemetry": {
                "word_count": word_count,
                "sentence_count": sentence_count,
                "unique_words": len(unique_words),
                "reading_time_seconds": reading_time_seconds,
            },
            "readability": {
                "flesch_reading_ease": flesch_reading_ease,
                "flesch_kincaid_grade": fk_grade,
                "gunning_fog_index": gunning_fog,
                "grade_label": "Executive / Professional" if fk_grade >= 11 else "Standard Business"
            },
            "lexical_richness": {
                "type_token_ratio": type_token_ratio,
                "complex_word_ratio": round(complex_count / word_count, 3)
            },
            "governance": {
                "score": governance_score,
                "flagged_buzzwords": flagged_terms,
                "clean": len(flagged_terms) == 0
            },
            "tone": {
                "executive_tone_index": exec_tone_index,
                "executive_markers": exec_markers_found,
                "passive_voice_frequency": f"{passive_percent}%"
            }
        }

def run_tests():
    engine = ContentIntelligenceEngine()
    test_sample = """
    Nexus Content OS delivers deterministic governance and low-latency inference orchestration. 
    Our multi-model architecture synchronizes enterprise documents with strict brand voice compliance. 
    The system was evaluated across high-throughput telemetry pipelines without retaining customer buffers.
    """
    result = engine.analyze(test_sample)
    assert result["status"] == "success"
    assert result["telemetry"]["word_count"] > 20
    assert result["governance"]["score"] >= 80
    print("[SUCCESS] Python NLP Intelligence Engine passed all validation benchmarks.")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Nexus Content OS NLP Intelligence Engine")
    parser.add_argument("--text", type=str, help="Raw text to analyze")
    parser.add_argument("--file", type=str, help="Path to markdown/text file to analyze")
    parser.add_argument("--test", action="store_true", help="Run internal validation test suite")

    args = parser.parse_args()
    engine = ContentIntelligenceEngine()

    if args.test:
        run_tests()
        sys.exit(0)

    if args.file:
        try:
            with open(args.file, "r", encoding="utf-8") as f:
                content = f.read()
            print(json.dumps(engine.analyze(content)))
        except Exception as e:
            print(json.dumps({"status": "error", "message": str(e)}))
        sys.exit(0)

    if args.text:
        print(json.dumps(engine.analyze(args.text)))
        sys.exit(0)

    # Read from stdin if no args provided
    if not sys.stdin.isatty():
        input_text = sys.stdin.read()
        print(json.dumps(engine.analyze(input_text)))
    else:
        # Default self-test
        run_tests()
