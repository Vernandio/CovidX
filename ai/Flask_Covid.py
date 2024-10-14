from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
from tensorflow.keras.models import load_model

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
    model = load_model('./covid_model.h5')  # This loads both the architecture and the weights
    print("COVID model loaded successfully.")
except Exception as e:
    print(f"Error loading COVID model: {e}")
    raise e

# Preprocessing function to handle the uploaded image
def preprocess_image(image_path):
    try:
        img = cv2.imread(image_path)  # Read the image
        img = cv2.resize(img, (150, 150))  # Resize to match the input size expected by the model
        img = np.expand_dims(img, axis=0)  # Add batch dimension
        img = img / 255.0  # Normalize pixel values
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
        print(f"Raw prediction probability: {prediction}")
        
        # Interpreting prediction: Assuming binary classification (COVID vs. No COVID)
        predicted_label = 'COVID Detected' if prediction[0][0] < 0.5 else 'No COVID'
        print(f"Predicted Label: {predicted_label}")
        
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
