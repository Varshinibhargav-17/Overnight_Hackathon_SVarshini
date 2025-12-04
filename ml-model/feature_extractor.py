"""
Feature Extractor for Behavioral Analytics
Extracts 30+ features from raw behavioral data for anomaly detection
"""

import numpy as np
from typing import Dict, List
from scipy import stats


class BehaviorFeatureExtractor:
    """
    Extracts comprehensive behavioral features from raw mouse, keyboard, and tab data.
    Designed for real-time feature computation during exams.
    """
    
    def __init__(self):
        self.feature_names = []
        
    def extract_mouse_features(self, mouse_data: Dict) -> Dict[str, float]:
        """
        Extract 10 features from mouse movement data.
        
        Features:
        1. Average speed
        2. Speed variance (consistency)
        3. Speed CV (coefficient of variation)
        4. Pause frequency
        5. Average pause duration
        6. Jitter mean (nervousness indicator)
        7. Jitter variance
        8. Smoothness mean
        9. Smoothness variance
        10. Speed transitions (sudden changes)
        """
        speeds = np.array(mouse_data['speeds'])
        pauses = np.array(mouse_data['pauses'])
        jitter = np.array(mouse_data['jitter'])
        smoothness = np.array(mouse_data['smoothness'])
        
        features = {}
        
        # Speed features
        features['mouse_speed_mean'] = float(np.mean(speeds))
        features['mouse_speed_std'] = float(np.std(speeds))
        features['mouse_speed_cv'] = float(np.std(speeds) / (np.mean(speeds) + 1e-6))
        
        # Pause features
        features['mouse_pause_freq'] = float(len(pauses) / (len(speeds) + 1))
        features['mouse_pause_mean'] = float(np.mean(pauses))
        
        # Jitter features (nervousness/mechanical indicator)
        features['mouse_jitter_mean'] = float(np.mean(jitter))
        features['mouse_jitter_std'] = float(np.std(jitter))
        
        # Smoothness features
        features['mouse_smoothness_mean'] = float(np.mean(smoothness))
        features['mouse_smoothness_std'] = float(np.std(smoothness))
        
        # Speed transition (sudden changes - bot-like behavior)
        speed_diff = np.abs(np.diff(speeds))
        features['mouse_speed_transitions'] = float(np.mean(speed_diff))
        
        return features
    
    def extract_keyboard_features(self, keyboard_data: Dict) -> Dict[str, float]:
        """
        Extract 12 features from keystroke dynamics.
        
        Features:
        1-3. Interval statistics (mean, std, CV)
        4. Rhythm consistency (entropy of intervals)
        5-6. Hold time statistics
        7. Burst size mean
        8. Burst size variance
        9. Backspace rate
        10. Typing speed (keystrokes per minute)
        11. Interval outliers (paste detection)
        12. Typing pattern stability
        """
        intervals = np.array(keyboard_data['intervals'])
        hold_times = np.array(keyboard_data['hold_times'])
        burst_sizes = np.array(keyboard_data['burst_sizes'])
        backspace_freq = np.array(keyboard_data['backspace_freq'])
        
        features = {}
        
        # Interval features
        features['key_interval_mean'] = float(np.mean(intervals))
        features['key_interval_std'] = float(np.std(intervals))
        features['key_interval_cv'] = float(np.std(intervals) / (np.mean(intervals) + 1e-6))
        
        # Rhythm consistency (low entropy = mechanical, high entropy = varied/copy-paste)
        hist, _ = np.histogram(intervals, bins=20)
        hist = hist / (hist.sum() + 1e-6)
        features['key_rhythm_entropy'] = float(stats.entropy(hist + 1e-6))
        
        # Hold time features
        features['key_hold_mean'] = float(np.mean(hold_times))
        features['key_hold_std'] = float(np.std(hold_times))
        
        # Burst features
        features['key_burst_mean'] = float(np.mean(burst_sizes))
        features['key_burst_std'] = float(np.std(burst_sizes))
        
        # Backspace rate
        features['key_backspace_rate'] = float(np.mean(backspace_freq))
        
        # Typing speed (WPM equivalent)
        total_time = np.sum(intervals)
        features['key_typing_speed'] = float(len(intervals) / (total_time / 60 + 1e-6))
        
        # Outlier detection (paste events have very small intervals)
        q1, q3 = np.percentile(intervals, [25, 75])
        iqr = q3 - q1
        outliers = np.sum((intervals < q1 - 1.5 * iqr) | (intervals > q3 + 1.5 * iqr))
        features['key_interval_outliers'] = float(outliers / len(intervals))
        
        # Pattern stability (coefficient of variation over time windows)
        if len(intervals) > 20:
            window_size = len(intervals) // 5
            window_means = [np.mean(intervals[i:i+window_size]) 
                           for i in range(0, len(intervals)-window_size, window_size)]
            features['key_pattern_stability'] = float(np.std(window_means) / (np.mean(window_means) + 1e-6))
        else:
            features['key_pattern_stability'] = 0.0
        
        return features
    
    def extract_tab_features(self, tab_data: Dict, duration: float) -> Dict[str, float]:
        """
        Extract 8 features from tab-switching behavior.
        
        Features:
        1. Switch frequency (per hour)
        2. Total time away (percentage)
        3. Average time away per switch
        4. Time away variance
        5. Switch clustering (consecutive quick switches)
        6. Switch regularity (periodic vs random)
        7. Early vs late switching ratio
        8. Long absence count (>30 seconds)
        """
        num_switches = tab_data['num_switches']
        switch_times = np.array(tab_data['switch_times']) if num_switches > 0 else np.array([])
        time_away = np.array(tab_data['time_away']) if num_switches > 0 else np.array([])
        
        features = {}
        
        # Basic frequency
        features['tab_switch_freq'] = float(num_switches / (duration / 3600))  # Per hour
        
        # Time away features
        features['tab_time_away_pct'] = float(tab_data['total_time_away'] / duration * 100)
        
        if num_switches > 0:
            features['tab_time_away_mean'] = float(np.mean(time_away))
            features['tab_time_away_std'] = float(np.std(time_away))
            
            # Clustering (multiple switches in quick succession)
            if len(switch_times) > 1:
                inter_switch = np.diff(switch_times)
                quick_switches = np.sum(inter_switch < 10)  # Switches within 10 seconds
                features['tab_clustering'] = float(quick_switches / len(inter_switch))
            else:
                features['tab_clustering'] = 0.0
            
            # Regularity (periodic pattern detection via coefficient of variation)
            if len(switch_times) > 2:
                inter_switch = np.diff(switch_times)
                features['tab_regularity'] = float(np.std(inter_switch) / (np.mean(inter_switch) + 1e-6))
            else:
                features['tab_regularity'] = 0.0
            
            # Early vs late switching (behavioral shift detection)
            mid_point = duration / 2
            early_switches = np.sum(switch_times < mid_point)
            late_switches = num_switches - early_switches
            features['tab_early_late_ratio'] = float(early_switches / (late_switches + 1))
            
            # Long absences (strong cheating indicator)
            features['tab_long_absence_count'] = float(np.sum(time_away > 30))
        else:
            features['tab_time_away_mean'] = 0.0
            features['tab_time_away_std'] = 0.0
            features['tab_clustering'] = 0.0
            features['tab_regularity'] = 0.0
            features['tab_early_late_ratio'] = 1.0
            features['tab_long_absence_count'] = 0.0
        
        return features
    
    def extract_answer_features(self, answer_data: Dict) -> Dict[str, float]:
        """
        Extract 5 features from answer submission patterns.
        
        Features:
        1. Average time per question
        2. Time variance (consistency)
        3. Answer change rate
        4. Quick answer ratio (<10 seconds)
        5. Slow answer ratio (>180 seconds)
        """
        time_per_q = np.array(answer_data['time_per_question'])
        changes = np.array(answer_data['answer_changes'])
        
        features = {}
        
        features['answer_time_mean'] = float(np.mean(time_per_q))
        features['answer_time_std'] = float(np.std(time_per_q))
        features['answer_change_rate'] = float(np.mean(changes))
        
        # Quick answers (might indicate prior knowledge or cheating)
        features['answer_quick_ratio'] = float(np.sum(time_per_q < 10) / len(time_per_q))
        
        # Slow answers (might indicate searching for answers)
        features['answer_slow_ratio'] = float(np.sum(time_per_q > 180) / len(time_per_q))
        
        return features
    
    def extract_cross_modal_features(self, mouse_data: Dict, keyboard_data: Dict, 
                                    tab_data: Dict, duration: float) -> Dict[str, float]:
        """
        Extract 5 advanced cross-modal features that capture relationships between modalities.
        These are particularly powerful for detecting sophisticated cheating.
        
        Features:
        1. Mouse-keyboard coordination (correlation between activities)
        2. Activity concentration (are they active in bursts or steady?)
        3. Multitasking indicator (simultaneous mouse/keyboard/tab activity)
        4. Focus stability score
        5. Behavioral consistency score
        """
        features = {}
        
        # 1. Mouse-keyboard coordination
        mouse_times = np.array(mouse_data['timestamps'])
        key_times = np.array(keyboard_data['timestamps'])
        
        # Create activity bins
        bins = np.linspace(0, duration, 50)
        mouse_activity = np.histogram(mouse_times, bins=bins)[0]
        key_activity = np.histogram(key_times, bins=bins)[0]
        
        # Correlation between mouse and keyboard activity
        if len(mouse_activity) > 1 and len(key_activity) > 1:
            correlation = np.corrcoef(mouse_activity, key_activity)[0, 1]
            features['cross_mouse_key_correlation'] = float(correlation if not np.isnan(correlation) else 0)
        else:
            features['cross_mouse_key_correlation'] = 0.0
        
        # 2. Activity concentration (Gini coefficient)
        total_activity = mouse_activity + key_activity + 1e-6
        sorted_activity = np.sort(total_activity)
        n = len(sorted_activity)
        cumsum = np.cumsum(sorted_activity)
        gini = (2 * np.sum((np.arange(n) + 1) * sorted_activity)) / (n * cumsum[-1]) - (n + 1) / n
        features['cross_activity_concentration'] = float(gini)
        
        # 3. Multitasking indicator
        # High mouse speed + typing + tab switches happening close together = suspicious
        num_switches = tab_data['num_switches']
        mouse_speeds = np.array(mouse_data['speeds'])
        key_intervals = np.array(keyboard_data['intervals'])
        
        high_activity_periods = np.sum(mouse_speeds > np.percentile(mouse_speeds, 75))
        fast_typing_periods = np.sum(key_intervals < np.percentile(key_intervals, 25))
        features['cross_multitask_indicator'] = float(
            (high_activity_periods + fast_typing_periods + num_switches) / (len(mouse_speeds) + 1)
        )
        
        # 4. Focus stability (variance in activity across time windows)
        window_activities = []
        window_size = int(duration / 10)  # 10 windows
        for i in range(10):
            start = i * window_size
            end = (i + 1) * window_size
            mouse_in_window = np.sum((mouse_times >= start) & (mouse_times < end))
            key_in_window = np.sum((key_times >= start) & (key_times < end))
            window_activities.append(mouse_in_window + key_in_window)
        
        features['cross_focus_stability'] = float(
            1 / (np.std(window_activities) + 1e-6)
        )
        
        # 5. Behavioral consistency (how similar are different parts of the exam?)
        # Split into 3 parts and compare feature distributions
        third = duration / 3
        parts = [0, third, 2*third, duration]
        part_features = []
        
        for i in range(3):
            part_mouse = mouse_times[(mouse_times >= parts[i]) & (mouse_times < parts[i+1])]
            part_keys = key_times[(key_times >= parts[i]) & (key_times < parts[i+1])]
            
            # Simple activity measure
            part_features.append(len(part_mouse) + len(part_keys))
        
        features['cross_behavioral_consistency'] = float(
            1 / (np.std(part_features) / (np.mean(part_features) + 1e-6) + 1e-6)
        )
        
        return features
    
    def extract_all_features(self, session_data: Dict) -> np.ndarray:
        """
        Extract all features from a session and return as numpy array.
        
        Returns:
            Feature vector with 40 features total
        """
        all_features = {}
        
        # Extract from each modality
        all_features.update(self.extract_mouse_features(session_data['mouse']))
        all_features.update(self.extract_keyboard_features(session_data['keyboard']))
        all_features.update(self.extract_tab_features(session_data['tabs'], session_data['duration']))
        all_features.update(self.extract_answer_features(session_data['answers']))
        all_features.update(self.extract_cross_modal_features(
            session_data['mouse'], 
            session_data['keyboard'], 
            session_data['tabs'],
            session_data['duration']
        ))
        
        # Store feature names for later use
        if not self.feature_names:
            self.feature_names = sorted(all_features.keys())
        
        # Return as ordered array
        return np.array([all_features[name] for name in self.feature_names])
    
    def extract_features_from_dataset(self, dataset: List[Dict]) -> np.ndarray:
        """
        Extract features from entire dataset.
        
        Returns:
            Feature matrix of shape (n_samples, n_features)
        """
        print("Extracting features from dataset...")
        feature_matrix = []
        
        for i, session in enumerate(dataset):
            if (i + 1) % 100 == 0:
                print(f"  Processed {i + 1}/{len(dataset)} sessions")
            
            features = self.extract_all_features(session)
            feature_matrix.append(features)
        
        feature_matrix = np.array(feature_matrix)
        print(f"✓ Extracted {feature_matrix.shape[1]} features from {feature_matrix.shape[0]} sessions")
        
        return feature_matrix
    
    def get_feature_names(self) -> List[str]:
        """Return list of feature names in order."""
        return self.feature_names.copy()


if __name__ == "__main__":
    # Test with dummy data
    print("Testing Feature Extractor...")
    
    dummy_session = {
        'duration': 3600,
        'mouse': {
            'speeds': list(np.random.gamma(2, 50, 1000)),
            'pauses': list(np.random.exponential(3, 1000)),
            'jitter': list(np.random.normal(2, 1, 1000)),
            'smoothness': list(np.random.beta(8, 2, 1000)),
            'timestamps': list(np.cumsum(np.random.exponential(2, 1000)))
        },
        'keyboard': {
            'intervals': list(np.random.gamma(3, 0.15, 500)),
            'hold_times': list(np.random.gamma(2, 0.08, 500)),
            'burst_sizes': list(np.random.poisson(8, 50)),
            'backspace_freq': list(np.random.binomial(1, 0.15, 500)),
            'timestamps': list(np.cumsum(np.random.gamma(3, 0.15, 500)))
        },
        'tabs': {
            'num_switches': 2,
            'switch_times': [1000.0, 2000.0],
            'time_away': [5.0, 8.0],
            'total_time_away': 13.0
        },
        'answers': {
            'time_per_question': list(np.random.gamma(3, 40, 50)),
            'answer_changes': list(np.random.binomial(1, 0.20, 50)),
            'total_changes': 10
        }
    }
    
    extractor = BehaviorFeatureExtractor()
    features = extractor.extract_all_features(dummy_session)
    
    print(f"\nExtracted {len(features)} features:")
    for name, value in zip(extractor.get_feature_names(), features):
        print(f"  {name}: {value:.4f}")