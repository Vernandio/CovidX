function Question({ text, answer, onChange, radioID }) {
  return (
    <div className="mb-5 p-4 bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">{text}</h3>
      <div className="flex justify-center gap-5">
        <div className="flex items-center cursor-pointer">
          {/* Radio button */}
          <input
            type="radio"
            value="Yes"
            checked={answer === "Yes"}
            onChange={onChange}
            id={radioID}
            name={radioID}
            className="form-radio cursor-pointer w-5 h-5 text-blue-600 border-2 border-white focus:ring-transparent focus:ring-offset-0"
          />
          {/* Label */}
          <label
            htmlFor={radioID}
            className="ml-2 text-white text-base cursor-pointer transition-colors duration-300 hover:text-blue-400"
          >
            Yes
          </label>
        </div>

        <div className="flex items-center cursor-pointer">
          {/* Radio button */}
          <input
            type="radio"
            value="No"
            checked={answer === "No"}
            onChange={onChange}
            id={`${radioID}-no`}
            name={radioID}
            className="form-radio cursor-pointer w-5 h-5 text-blue-600 border-2 border-white focus:ring-transparent focus:ring-offset-0"
          />
          {/* Label */}
          <label
            htmlFor={`${radioID}-no`}
            className="ml-2 text-white text-base cursor-pointer transition-colors duration-300 hover:text-red-400"
          >
            No
          </label>
        </div>
      </div>
    </div>
  );
}

export default Question;
