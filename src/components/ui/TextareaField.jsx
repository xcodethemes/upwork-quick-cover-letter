// TextareaField.jsx
import React from "react";

const TextareaField = ({ value, onChange, placeholder, error, rows = 4, className = "" }) => {
  return (
    <div className={className}>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default TextareaField;
