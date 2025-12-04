# simple incremental merge logic for numeric features
from copy import deepcopy

def merge_baseline(old_features: dict, new_features: dict, old_count: int) -> dict:
    """
    Merge numeric features by incremental average:
      merged = (old_mean * old_count + new_value) / (old_count + 1)

    For features missing in old_features, treat old_mean as new_value for initialization.
    Non-numeric values will be replaced by the new value (no averaging).
    """
    if old_features is None:
        return new_features

    merged = deepcopy(old_features)
    for k, v_new in new_features.items():
        v_old = old_features.get(k)
        # try numeric averaging
        try:
            if v_old is None:
                merged[k] = v_new
            else:
                # both numeric?
                merged[k] = (float(v_old) * float(old_count) + float(v_new)) / (old_count + 1)
        except Exception:
            # fallback: just overwrite non-numeric fields
            merged[k] = v_new
    return merged
