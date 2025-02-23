import React, { useState } from "react";
import axios from "axios";

const ChurnPrediction = () => {
  const [formData, setFormData] = useState({
    age: 30,
    gender: "M",
    income: 500000,
    policy_type: "Term",
    policy_duration: 10,
    premium_amount: 20000,
    claim_history: 0,
    missed_payments: 1,
    customer_support_calls: 2,
    sentiment_score: 0.5,
    website_visit_frequency: 5,
    app_usage_frequency: 10,
    time_since_last_interaction: 30,
    days_since_last_payment: 30, // New feature added
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert categorical values to numbers
    const genderMap = { M: 0, F: 1 };
    const policyMap = { Term: 0, ULIP: 1, "Whole Life": 2 };

    const requestData = {
      features: [
        parseInt(formData.age),
        genderMap[formData.gender],
        parseInt(formData.income),
        policyMap[formData.policy_type],
        parseInt(formData.policy_duration),
        parseInt(formData.premium_amount),
        parseInt(formData.claim_history),
        parseInt(formData.missed_payments),
        parseInt(formData.customer_support_calls),
        parseFloat(formData.sentiment_score),
        parseInt(formData.website_visit_frequency),
        parseInt(formData.app_usage_frequency),
        parseInt(formData.time_since_last_interaction),
        parseInt(formData.days_since_last_payment), // Include new feature
      ],
    };

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", requestData);
      setResult(response.data);
    } catch (error) {
      console.error("Error making prediction:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Customer Churn Prediction</h2>
      <form onSubmit={handleSubmit}>
        <label>Age: <input type="number" name="age" value={formData.age} onChange={handleChange} /></label> <br />
        <label>Gender: 
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </label> <br />
        <label>Income: <input type="number" name="income" value={formData.income} onChange={handleChange} /></label> <br />
        <label>Policy Type:
          <select name="policy_type" value={formData.policy_type} onChange={handleChange}>
            <option value="Term">Term</option>
            <option value="ULIP">ULIP</option>
            <option value="Whole Life">Whole Life</option>
          </select>
        </label> <br />
        <label>Policy Duration: <input type="number" name="policy_duration" value={formData.policy_duration} onChange={handleChange} /></label> <br />
        <label>Premium Amount: <input type="number" name="premium_amount" value={formData.premium_amount} onChange={handleChange} /></label> <br />
        <label>Claim History: <input type="number" name="claim_history" value={formData.claim_history} onChange={handleChange} /></label> <br />
        <label>Missed Payments: <input type="number" name="missed_payments" value={formData.missed_payments} onChange={handleChange} /></label> <br />
        <label>Customer Support Calls: <input type="number" name="customer_support_calls" value={formData.customer_support_calls} onChange={handleChange} /></label> <br />
        <label>Sentiment Score: <input type="number" step="0.1" name="sentiment_score" value={formData.sentiment_score} onChange={handleChange} /></label> <br />
        <label>Website Visit Frequency: <input type="number" name="website_visit_frequency" value={formData.website_visit_frequency} onChange={handleChange} /></label> <br />
        <label>App Usage Frequency: <input type="number" name="app_usage_frequency" value={formData.app_usage_frequency} onChange={handleChange} /></label> <br />
        <label>Time Since Last Interaction: <input type="number" name="time_since_last_interaction" value={formData.time_since_last_interaction} onChange={handleChange} /></label> <br />
        <label>Days Since Last Payment: <input type="number" name="days_since_last_payment" value={formData.days_since_last_payment} onChange={handleChange} /></label> <br />
        
        <button type="submit">Predict</button>
      </form>

      {result && (
        <div>
          <h3>Prediction Result:</h3>
          <p><strong>Churn Prediction:</strong> {result.churn_prediction === 1 ? "Likely to Churn" : "Retained"}</p>
          <p><strong>Churn Probability:</strong> {result.churn_probability}%</p>
        </div>
      )}
    </div>
  );
};

export default ChurnPrediction;
