# app/services/risk_engine.py
"""
Simple pluggable risk engine. Keep it small and interpretable:
- Handles a few event types with heuristic weights
- Compares typing WPM vs baseline wpm_mean if baseline provided
- Returns (risk_score_float, details_dict)
"""

def safe_float(x, default=0.0):
    try:
        return float(x)
    except Exception:
        return default

def compute_risk_score(event_type: str, payload: dict, baseline):
    """
    Returns:
      (risk_score: float in [0,1], details: dict)
    """
    score = 0.0
    details = {"reasons": []}

    # Heuristic: tab switch event
    if event_type == "tab_switch":
        # weight for tab switching
        cnt = payload.get("count", 1)
        # each switch gives 0.15, capped
        _s = min(0.15 * cnt, 0.6)
        score += _s
        details["reasons"].append(f"tab_switch_count={cnt}")

    # Heuristic: copy-paste detected
    if event_type == "copy_paste":
        score += 0.6
        details["reasons"].append("copy_paste")

    # Heuristic: typing speed anomaly (compare to baseline if available)
    if event_type == "typing":
        wpm = safe_float(payload.get("wpm", 0.0))
        details["typing_wpm"] = wpm
        if baseline and isinstance(baseline.features, dict):
            base_wpm = safe_float(baseline.features.get("wpm_mean", 0.0))
            # if base_wpm is tiny or zero, skip
            if base_wpm > 5:
                # relative jump factor
                ratio = wpm / base_wpm if base_wpm > 0 else 1.0
                if ratio >= 2.0:
                    score += 0.4
                    details["reasons"].append(f"wpm_jump_ratio={ratio:.2f}")
                elif ratio >= 1.5:
                    score += 0.25
                    details["reasons"].append(f"wpm_increase={ratio:.2f}")
            else:
                # no baseline info: penalize extremely high wpm heuristically
                if wpm >= 120:
                    score += 0.25
                    details["reasons"].append("typing_wpm_high_no_baseline")
        else:
            if wpm >= 120:
                score += 0.25
                details["reasons"].append("typing_wpm_high")

    # Heuristic: window blur / long focus loss
    if event_type == "window_blur":
        seconds = safe_float(payload.get("duration_seconds", 0.0))
        if seconds >= 30:
            score += 0.35
            details["reasons"].append(f"window_blur_{int(seconds)}s")

    # Clip score between 0 and 1 and return
    score = max(0.0, min(1.0, score))
    return score, details
