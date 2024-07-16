const FormInput = ({ label, value, onChange }) => {
  return (
    <div className="input-box">
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default FormInput;
