
const SchedularInput = ({
  inputName,
  inputValue,
  setInput,
  sendImmediately,
}) => {
  return (
    <div className="input-box">
      <label>{inputName === "time" ? "Time:" : "Date:"}</label>
      {/* If the checkbox is checked, disable the date and time inputs */}
      <input
        type={inputName}
        value={inputValue}
        onChange={(e) => setInput(e.target.value)}
        required={sendImmediately ? false : true}
        disabled={sendImmediately}
      />
    </div>
  );
};

export default SchedularInput;