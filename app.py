from flask import Flask, request, jsonify
import pandas as pd
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load the trained model
model = joblib.load("churn_model.pkl")

@app.route('/predict', methods=['POST'])
def predict_churn():
    try:
        data = request.get_json()  # Get JSON data from frontend
        print("Request received:", data)

        # Define the expected feature names (must match model training)
        expected_features = [
            "Age", "Gender", "Income", "Policy_Type", "Policy_Duration",
            "Premium_Amount", "Claim_History", "Missed_Payments",
            "Customer_Support_Calls", "Sentiment_Score", "Website_Visit_Frequency",
            "App_Usage_Frequency", "Time_Since_Last_Interaction", "Days_Since_Last_Payment"
        ]

        # Ensure all expected features are present
        if len(data["features"]) == len(expected_features) - 1:
            data["features"].append(30)  # Default value for "Days_Since_Last_Payment"

        # Convert input data into a DataFrame
        df = pd.DataFrame([data["features"]], columns=expected_features)
        
        # Make prediction
        prediction = model.predict(df)[0]
        probability = model.predict_proba(df)[0][1]  # Get probability of churn

        return jsonify({
            "churn_prediction": int(prediction),  # 1 = Likely to churn, 0 = Retained
            "churn_probability": round(probability * 100, 2)  # Percentage
        })
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
