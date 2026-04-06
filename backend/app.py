from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pickle
import json
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load Artifacts
with open('model.pkl', 'rb') as f:
    MODEL = pickle.load(f)
with open('scaler.pkl', 'rb') as f:
    SCALER = pickle.load(f)
with open('encoders.pkl', 'rb') as f:
    ENCODERS = pickle.load(f)

with open('metadata.json', 'r') as f:
    METADATA = json.load(f)

# Load CSV for Stats
DF = pd.read_csv('global greenhouse gas emissions from agriculture.csv')
DF.dropna(subset=['Value', 'Area', 'Item', 'Element'], inplace=True)

@app.route('/')
def index():
    return jsonify({
        "status": "online",
        "message": "EcoPredict AI Backend API is running. Direct traffic to the Frontend URL for the user interface."
    })

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model': 'KNN Agricultural Emissions Classifier'})

@app.route('/api/metadata', methods=['GET'])
def get_metadata():
    """Returns dropdown options and column mappings."""
    return jsonify(METADATA)

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Returns aggregated data for charts."""
    # Top 10 Areas by Total Emission Value
    top_areas = DF.groupby('Area')['Value'].sum().sort_values(ascending=False).head(10)
    
    # Emission Trends over Years
    yearly_trend = DF.groupby('Year')['Value'].sum()
    
    # Element breakdown (CO2, CH4, N2O)
    element_dist = DF.groupby('Element')['Value'].sum()

    stats = {
        'top_areas': {
            'labels': list(top_areas.index),
            'values': [float(v) for v in top_areas.values]
        },
        'yearly_trend': {
            'labels': [int(y) for y in yearly_trend.index],
            'values': [float(v) for v in yearly_trend.values]
        },
        'element_dist': {
            'labels': list(element_dist.index),
            'values': [float(v) for v in element_dist.values]
        }
    }
    return jsonify(stats)

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predicts emission type from input features."""
    try:
        data = request.json
        # The input features must match the training script's columns
        # Column order is important for the scaler
        features = []
        for col in METADATA['columns']:
            val = data.get(col)
            
            # Encode if categorical
            if col in ENCODERS and col != 'Element':
                try:
                    # Handle unknown categories by falling back or erroring
                    le = ENCODERS[col]
                    val = str(val)
                    if val in le.classes_:
                        encoded_val = le.transform([val])[0]
                    else:
                        # Fallback to a default or first class if unknown
                        encoded_val = 0 
                    features.append(encoded_val)
                except Exception as e:
                    features.append(0)
            else:
                # Numerical value
                if val == '' or val is None:
                    features.append(0.0)
                else:
                    features.append(float(val))
        
        # Reshape and scale
        features_arr = np.array(features).reshape(1, -1)
        features_scaled = SCALER.transform(features_arr)
        
        # Predict
        pred_idx = MODEL.predict(features_scaled)[0]
        prediction = METADATA['target_classes'][pred_idx]
        
        # Probabilities
        probs = MODEL.predict_proba(features_scaled)[0]
        confidence = float(max(probs))

        return jsonify({
            'success': True,
            'prediction': prediction,
            'confidence': confidence,
            'all_probs': {METADATA['target_classes'][i]: float(probs[i]) for i in range(len(probs))}
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    # Use port assigned by Render, falling back to 5000 for local development
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
