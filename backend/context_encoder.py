# context_encoder.py

ONSET = ["a few days", "weeks", "months", "years", "Unknown"]
YES_NO = ["No", "Yes"]
SURFACE = ["dry and scaly", "smooth", "raised bumps", "blisters", "pus-filled", "Unknown"]
EDGES = ["well-defined", "ill-defined", "Unknown"]
LOCATIONS = ["face", "back", "neck", "scalp", "body", "Unknown"]
COLORS = ["red", "brown", "white", "pink", "yellow", "mixed", "Unknown"]

def one_hot(value, vocab):
    vec = [0] * len(vocab)
    idx = vocab.index(value) if value in vocab else vocab.index("Unknown")
    vec[idx] = 1
    return vec

def encode_context(ctx):
    v = []
    v += one_hot(ctx.get("onset", "Unknown"), ONSET)
    v += one_hot(ctx.get("first_occurrence", "No"), YES_NO)
    v += one_hot(ctx.get("itchiness", "No"), YES_NO)
    v += one_hot(ctx.get("pain", "No"), YES_NO)
    v += one_hot(ctx.get("discharge", "No"), YES_NO)
    v += one_hot(ctx.get("surface", "Unknown"), SURFACE)
    v += one_hot(ctx.get("edges", "Unknown"), EDGES)
    v += one_hot(ctx.get("location", "Unknown"), LOCATIONS)
    v += one_hot(ctx.get("symmetry", "No"), YES_NO)
    v += one_hot(ctx.get("color", "Unknown"), COLORS)
    v += one_hot(ctx.get("scaling", "No"), YES_NO)
    return v
