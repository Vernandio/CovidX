"use client";
import React, { useState } from "react";
import Question from "./components/Question";

const questions = [
  { text: "Do you have difficulty breathing?", key: "breathing" },
  { text: "Do you have a fever?", key: "fever" },
  { text: "Do you have dry cough?", key: "cough" },
  { text: "Do you have a sore throat?", key: "soreThroat" },
  { text: "Do you have hyper tension?", key: "hyperTension" },
  { text: "Did you travel abroad recently?", key: "abroad" },
  {
    text: "Have you been in contact with a COVID patient recently?",
    key: "contact",
  },
  { text: "Did you attend a large gathering recently?", key: "gathering" },
  { text: "Did you visit public exposed places recently?", key: "exposed" },
  {
    text: "Do you have any family members that work in public exposed places?",
    key: "family",
  },
];

function QuestionList() {
  const [result, setResult] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false); // Control popup visibility

  const handleAnswerChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 5, questions.length - 1)
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 5, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      answer: answers,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/predict-prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setResult(result);
      setShowResult(true); // Show the result popup after form submission
    } catch (error) {
      console.error("Error during prediction submission:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-purple-800 relative z-10">
      <div className="flex justify-center items-center w-full h-full p-4 relative z-20 mt-16">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full max-w-lg mx-auto bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg shadow-lg"
        >
          {questions.slice(currentIndex, currentIndex + 5).map((q, index) => (
            <Question
              key={index}
              text={q.text}
              answer={answers[q.key] || ""}
              onChange={(e) => handleAnswerChange(q.key, e.target.value)}
              radioID={index}
            />
          ))}
          <div className="mt-5 flex justify-between">
            {currentIndex > 0 && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                type="button"
                onClick={handlePrevious}
              >
                Previous
              </button>
            )}
            <div className="ml-auto">
              {currentIndex + 5 < questions.length && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Next
                </button>
              )}
              {currentIndex + 5 >= questions.length && (
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Result Popup */}
      {showResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full">
            <h2 className="text-3xl font-bold text-gray-800 text-center">
              Prediction Result
            </h2>
            {result ? (
              <p className="text-center text-lg text-gray-700 mt-6 leading-relaxed">
                {result.prediction === 1
                  ? `There is a ${result.confidence.toFixed(
                      2
                    )}% chance that you have COVID.`
                  : `There is a ${result.confidence.toFixed(
                      2
                    )}% chance that you don't have COVID.`}
              </p>
            ) : (
              <p className="text-gray-700 text-center mt-6">Loading...</p>
            )}
            <div className="flex justify-center mt-8">
              <button
                className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
                onClick={() => setShowResult(false)} // Close the popup
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionList;
