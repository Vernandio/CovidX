from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
from tensorflow.keras.models import load_model

import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS so your React app can communicate with the Flask backend

# Define the upload folder
UPLOAD_FOLDER = './uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load the pre-trained COVID detection model
try:
    # Load the full model (both architecture and weights) from the saved .h5 file
    model = load_model('./CBV.keras')  # This loads both the architecture and the weights
    print("COVID model loaded successfully.")
except Exception as e:
    print(f"Error loading COVID model: {e}")
    raise e

model_classification = joblib.load('svm_model.pkl')

# Preprocessing function to handle the uploaded image
def preprocess_image(image_path):
    try:
        img = cv2.imread(image_path)  # Read the image
        img = cv2.resize(img, (400, 400))  # Resize to match the input size expected by the model
        img = img / 255.0
        img = np.expand_dims(img, axis=0)  # Add batch dimension
        print(f"Image preprocessed successfully, shape: {img.shape}")
        return img
    except Exception as e:
        print(f"Error in preprocessing image: {e}")
        raise e

# Prediction function
def predict_covid(image_path):
    try:
        img = preprocess_image(image_path)  # Preprocess the input image
        prediction = model.predict(img)  # Get the model's prediction
        
        # Log the raw prediction to see the model's output
        # print(f"Raw prediction probability: {prediction}")
        
        # Interpreting prediction: Assuming binary classification (COVID vs. No COVID)
        # predicted_label = 'COVID Detected' if prediction[0][0] < 0.5 else 'No COVID'
        # print(f"Predicted Label: {predicted_label}")
        # classes = ['COVID19', 'NORMAL', 'PNEUMONIA', 'TBC']
        classes = ['BACTERIAL-PNEUMONIA', 'COVID19', 'VIRAL-PNEUMONIA']
        predicted_label=classes[np.argmax(prediction)]
        # Return the prediction
        return predicted_label
    except Exception as e:
        print(f"Error in prediction: {e}")
        raise e

# Flask route to handle image upload and prediction
@app.route('/predict', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
    
    if file:
        filename = file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)  # Save the file

        try:
            # Make prediction
            prediction = predict_covid(file_path)
            return jsonify({"message": f"Prediction: {prediction}"})
        except Exception as e:
            return jsonify({"message": f"Error during prediction: {e}"}), 500

@app.route('/predict-prediction', methods=['POST'])
def predict():
    # Get the JSON data from the request
    data = request.get_json(force=True)
    
    # Extract features from the input dictionary
    breathing = 1 if data['answer']['breathing'] == 'Yes' else 0
    fever = 1 if data['answer']['fever'] == 'Yes' else 0
    cough = 1 if data['answer']['cough'] == 'Yes' else 0
    soreThroat = 1 if data['answer']['soreThroat'] == 'Yes' else 0
    
    hyperTension = 1 if data['answer']['hyperTension'] == 'Yes' else 0
    
    abroad = 1 if data['answer']['abroad'] == 'Yes' else 0
    contact = 1 if data['answer']['contact'] == 'Yes' else 0
    gathering = 1 if data['answer']['gathering'] == 'Yes' else 0
    exposed = 1 if data['answer']['exposed'] == 'Yes' else 0
    family = 1 if data['answer']['family'] == 'Yes' else 0
    
    #using pandas, for saver if not in order
    input_features = pd.DataFrame([[breathing, fever, cough, soreThroat, hyperTension, abroad, contact, gathering, exposed, family]],
                               columns=['Breathing Problem', 'Fever', 'Dry Cough', 'Sore throat', 'Hyper Tension', 'Abroad travel', 'Contact with COVID Patient', 'Attended Large Gathering', 'Visited Public Exposed Places', 'Family working in Public Exposed Places'])

    # Make a prediction
    prediction = model_classification.predict(input_features)

    predicted_probabilities = model_classification.predict_proba(input_features)
    
    predicted_class = prediction[0]
    confidence_percentage = predicted_probabilities[0][predicted_class] * 100
    
    # Return the prediction as a JSON response
    
    return jsonify({'prediction': prediction[0].item(), 'confidence' : confidence_percentage}) 

if __name__ == '__main__':
    app.run(debug=True, port=5000)
