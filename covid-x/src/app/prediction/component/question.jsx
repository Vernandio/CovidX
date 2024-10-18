import "../css/Question.css";

function Question({ text, answer, onChange, radioID }) {
  return (
    <div className="question-container">
      <h3 className="question-text">{text}</h3>
      <div className="options-container">
        <div className="radio-button">
          <input
            type="radio"
            value="Yes"
            checked={answer === "Yes"}
            onChange={onChange}
            className="radio-input"
            id={radioID}
          />
          <label for={radioID} className="option-label">
            <span class="radio-button-custom"></span>
            Yes
          </label>
        </div>
        <div className="radio-button">
          <input
            type="radio"
            value="No"
            checked={answer === "No"}
            onChange={onChange}
            className="radio-input"
            id={radioID + "-no"}
          />
          <label for={radioID + "-no"} className="option-label">
            <span class="radio-button-custom"></span>
            No
          </label>
        </div>
      </div>
    </div>
  );
}

export default Question;
