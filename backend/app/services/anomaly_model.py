# app/services/anomaly_model.py
from typing import Any

class AnomalyModelService:
    def __init__(self, model_path: str = None) -> None:
        # initialize/load model here
        self.model_path = model_path
        self.model = None
        # e.g. self.model = load_model(model_path)
    
    def predict(self, data: Any) -> Any:
        # implement prediction
        # return some result
        return {"anomaly_score": 0.0}

# Factory function that other modules import
def get_anomaly_model_service(model_path: str = None) -> AnomalyModelService:
    """
    Return a (singleton or new) instance of the service.
    If you want a singleton, you can implement caching here.
    """
    # simple stateless example — create a new instance
    return AnomalyModelService(model_path=model_path)
