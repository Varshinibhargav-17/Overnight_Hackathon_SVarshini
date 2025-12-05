# app/services/risk_scorer.py
"""
ML-based Risk Scoring Service
Uses behavioral analytics to calculate real-time risk scores
"""
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import json
import joblib
import os

class RiskScorer:
    def __init__(self, model_path=None):
        self.scaler = StandardScaler()
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self.is_trained = False
        self.model_path = model_path or 'model.pkl'
        
        # Try to load existing model
        self.load_model()
        
        # If not trained, initialize with some synthetic data to allow usage
        if not self.is_trained:
            self._train_initial_model()
    
    def load_model(self):
        """Load trained model from disk if exists"""
        if os.path.exists(self.model_path):
            try:
                loaded_data = joblib.load(self.model_path)
                self.model = loaded_data['model']
                self.scaler = loaded_data['scaler']
                self.is_trained = True
                print(f"✅ Loaded ML model from {self.model_path}")
            except Exception as e:
                print(f"⚠️ Failed to load model: {e}")

    def save_model(self):
        """Save trained model to disk"""
        try:
            joblib.dump({
                'model': self.model,
                'scaler': self.scaler
            }, self.model_path)
            print(f"✅ Saved ML model to {self.model_path}")
        except Exception as e:
            print(f"⚠️ Failed to save model: {e}")

    def _train_initial_model(self):
        """Train on synthetic normal behavior data to initialize"""
        # Features: [typing_speed, tab_switches, mouse_speed, answer_time]
        # Generate synthetic "normal" data
        X_normal = np.random.normal(loc=[45, 0.5, 500, 150], scale=[10, 0.5, 100, 30], size=(100, 4))
        
        # Fit scaler and model
        X_scaled = self.scaler.fit_transform(X_normal)
        self.model.fit(X_scaled)
        self.is_trained = True
        print("✅ Initialized ML model with synthetic baseline data")

    def calculate_risk_score(self, current_behavior, baseline, events):
        """
        Calculate risk score using Hybrid approach:
        1. Heuristic Rules (Expert System)
        2. ML Anomaly Detection (Isolation Forest)
        """
        try:
            # 1. Calculate Heuristic Score
            heuristic_score = self._calculate_heuristic_score(current_behavior, baseline, events)
            
            # 2. Calculate ML Anomaly Score
            ml_score = self._calculate_ml_score(current_behavior, events)
            
            # Weighted combination (70% Heuristic, 30% ML)
            # We prioritize heuristics because they are explainable and rule-based
            final_risk_score = (heuristic_score * 0.7) + (ml_score * 0.3)
            
            return max(0.0, min(1.0, final_risk_score))
            
        except Exception as e:
            print(f"Error calculating risk score: {e}")
            return 0.0

    def _calculate_ml_score(self, current_behavior, events):
        """Get anomaly score from Isolation Forest"""
        if not self.is_trained:
            return 0.0
            
        try:
            # Extract features matching training data
            # [typing_speed, tab_switches, mouse_speed, answer_time]
            tab_switches = len([e for e in events if e.event_type == 'tab_switch'])
            
            features = np.array([[
                current_behavior.get('typing_speed_wpm', 45),
                tab_switches,
                current_behavior.get('mouse_speed_pxs', 500),
                current_behavior.get('avg_question_time_sec', 150)
            ]])
            
            # Scale features
            features_scaled = self.scaler.transform(features)
            
            # Predict anomaly score (lower is more anomalous)
            # decision_function returns negative for outliers, positive for inliers
            score = self.model.decision_function(features_scaled)[0]
            
            # Convert to risk probability (0 to 1)
            # Typical range is -0.5 to 0.5. We map -0.5 (anomaly) to 1.0 (high risk)
            # and 0.5 (normal) to 0.0 (low risk)
            risk_prob = 1.0 / (1.0 + np.exp(score * 5)) # Sigmoid-like transformation
            
            return risk_prob
            
        except Exception as e:
            print(f"ML scoring error: {e}")
            return 0.0

    def _calculate_heuristic_score(self, current_behavior, baseline, events):
        """Original rule-based calculation"""
        # Calculate individual component scores
        typing_score = self._calculate_typing_score(
            current_behavior.get('typing_speed_wpm', 0),
            baseline.typing_speed_wpm or 45
        )
        
        tab_switch_score = self._calculate_tab_switch_score(
            events,
            baseline.tab_switch_rate or 0.01
        )
        
        mouse_score = self._calculate_mouse_score(
            current_behavior.get('mouse_speed_pxs', 0),
            baseline.mouse_speed_pxs or 500
        )
        
        answer_speed_score = self._calculate_answer_speed_score(
            current_behavior.get('avg_question_time_sec', 0),
            baseline.avg_question_time_sec or 150
        )
        
        window_focus_score = self._calculate_window_focus_score(events)
        
        # Weighted combination
        return (
            typing_score * 0.2 +
            tab_switch_score * 0.3 +
            mouse_score * 0.15 +
            answer_speed_score * 0.2 +
            window_focus_score * 0.15
        )
    
    def _calculate_typing_score(self, current_wpm, baseline_wpm):
        """Calculate typing speed deviation score"""
        if baseline_wpm == 0:
            return 0.0
        
        deviation = abs(current_wpm - baseline_wpm) / baseline_wpm
        
        # High deviation = high risk
        if deviation > 1.0:  # More than 100% deviation
            return 0.9
        elif deviation > 0.5:  # 50-100% deviation
            return 0.6
        elif deviation > 0.3:  # 30-50% deviation
            return 0.3
        else:
            return 0.1
    
    def _calculate_tab_switch_score(self, events, baseline_rate):
        """Calculate tab switching risk score"""
        tab_switches = [e for e in events if e.event_type == 'tab_switch']
        current_rate = len(tab_switches)
        
        if current_rate == 0:
            return 0.0
        
        # More than 5 tab switches is highly suspicious
        if current_rate > 10:
            return 1.0
        elif current_rate > 5:
            return 0.8
        elif current_rate > 2:
            return 0.5
        else:
            return 0.2
    
    def _calculate_mouse_score(self, current_speed, baseline_speed):
        """Calculate mouse movement deviation score"""
        if baseline_speed == 0:
            return 0.0
        
        deviation = abs(current_speed - baseline_speed) / baseline_speed
        
        # Unusually slow mouse movement can indicate cheating
        if current_speed < baseline_speed * 0.3:  # Less than 30% of normal
            return 0.7
        elif deviation > 0.5:
            return 0.4
        else:
            return 0.1
    
    def _calculate_answer_speed_score(self, current_time, baseline_time):
        """Calculate answer speed deviation score"""
        if baseline_time == 0:
            return 0.0
        
        # Too fast = suspicious (copy-paste)
        if current_time < baseline_time * 0.3:
            return 0.8
        # Too slow = might be looking up answers
        elif current_time > baseline_time * 3:
            return 0.6
        else:
            return 0.1
    
    def _calculate_window_focus_score(self, events):
        """Calculate window focus loss score"""
        blur_events = [e for e in events if e.event_type == 'window_blur']
        
        if not blur_events:
            return 0.0
        
        # Calculate total blur time
        total_blur_time = 0
        for event in blur_events:
            event_data = json.loads(event.event_data) if event.event_data else {}
            total_blur_time += event_data.get('duration', 0)
        
        # More than 2 minutes of blur time is suspicious
        if total_blur_time > 120:
            return 0.9
        elif total_blur_time > 60:
            return 0.6
        elif total_blur_time > 30:
            return 0.3
        else:
            return 0.1
    
    def get_risk_level(self, risk_score):
        """Convert risk score to level"""
        if risk_score < 0.3:
            return 'low'
        elif risk_score < 0.7:
            return 'medium'
        else:
            return 'high'
    
    def get_severity(self, risk_score):
        """Get severity label"""
        return self.get_risk_level(risk_score)


# Global instance
risk_scorer = RiskScorer()
