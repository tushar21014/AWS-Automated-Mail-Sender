const FormInput = ({ label, value, onChange, placeholder="" }) => {
  return (
    <div className="input-box">
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default FormInput;
