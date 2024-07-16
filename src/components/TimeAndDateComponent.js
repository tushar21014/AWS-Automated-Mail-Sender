import SchedularInput from "./SchedularInput";

const TimeAndDateComponent = ({ date, setDate, time, setTime, sendImmediately }) => {
  return (
    <>
      <div className="column">
        {/* If the checkbox is checked, disable the date and time inputs */}
        <SchedularInput
          inputName="date"
          inputValue={date}
          setInput={setDate}
          sendImmediately={sendImmediately}
        />

        <SchedularInput
          inputName="time"
          inputValue={time}
          setInput={setTime}
          sendImmediately={sendImmediately}
        />
      </div>
      <button type="submit">Schedule Email</button>
    </>
  );
};

export default TimeAndDateComponent;