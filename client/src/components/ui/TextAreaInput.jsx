
function TextAreaInput({ inputName, inputId, placeholder, value, onChange }) {
  return (
    <textarea
      name={inputName}
      id={inputId}
      placeholder={placeholder}
      value={value}          // controlled value
      onChange={onChange}    // update parent state
      className="w-full h-80 border border-zinc-500 p-4 rounded placeholder:text-zinc-600 text-2xl resize-none"
    ></textarea>
  );
}

export default TextAreaInput;
