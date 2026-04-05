import React from 'react';

const Button = ({
  label,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}) => {
  return (
    <button className={className} onClick={onClick} disabled={disabled} type={type}>
      {label}
    </button>
  );
};

export default Button;
