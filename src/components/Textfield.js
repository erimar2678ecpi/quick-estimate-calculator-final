import React from 'react';

const Textfield = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  error = '',
  helperText = '',
}) => {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-') || 'input-field';
  const helpId = `${fieldId}-help`;
  const errorId = `${fieldId}-error`;

  const handleChange = (e) => {
    if (type !== 'number' && onChange) {
      e.target.value = e.target.value.trimStart();
    }

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="field">
      {label && <label htmlFor={fieldId}>{label}</label>}
      <input
        id={fieldId}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={disabled ? 'grayed' : ''}
        min={type === 'number' ? '0' : undefined}
        step={type === 'number' ? '0.5' : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helperText ? helpId : undefined}
      />
      {helperText && !error && (
        <span className="field-help" id={helpId}>
          {helperText}
        </span>
      )}
      {error && (
        <span className="field-error" id={errorId}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Textfield;
