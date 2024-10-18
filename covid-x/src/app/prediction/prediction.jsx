import React, { useState } from "react";
import Question from "./component/question";
import "./css/predictionPage.css";
import { useRef } from "react";

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
    text: "Do you have any family members that works in public exposed places?",
    key: "family",
  },
];

function QuestionList() {
  const [result, setResult] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

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
    e.preventDefault(); // Prevent default form submission

    const dataToSend = {
      answer: answers,
    };

    const response = await fetch("http://127.0.0.1:8080/predict-prediction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    const result = await response.json();
    // console.log(result);
    setResult(result);
  };

  const sectionRef = useRef(null);
  const scrollToSection = () => {
    sectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {questions.slice(currentIndex, currentIndex + 5).map((q, index) => (
            <Question
              key={index}
              text={q.text}
              answer={answers[q.key] || ""}
              onChange={(e) => handleAnswerChange(q.key, e.target.value)}
              radioID={index}
            />
          ))}
          <div style={{ marginTop: "20px" }}>
            {currentIndex > 0 && (
              <button className="button-class" onClick={handlePrevious}>
                Previous
              </button>
            )}
            {currentIndex + 5 < questions.length && (
              <button onClick={handleNext} className="button-class">
                Next
              </button>
            )}
            {currentIndex + 5 >= questions.length && (
              <button
                type="submit"
                className="button-class"
                onClick={scrollToSection}
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="prediction-container">
        <div className="prediction-section" ref={sectionRef}>
          <h2>Prediction Result</h2>
          {result ? (
            <>
              {/* <pre>{JSON.stringify(result, null, 2)}</pre> */}
              <p>
                {result.prediction === 1
                  ? `There is a ${result.confidence.toFixed(
                      2
                    )}% chance that you have COVID.`
                  : `There is a ${result.confidence.toFixed(
                      2
                    )}% chance that you don't have COVID.`}
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionList;
