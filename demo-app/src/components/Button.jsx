// demo-app/src/components/Button.jsx
// A reusable accessible button. Its look comes only from tokens.
import './Button.css'

// { children, onClick, type, disabled } are the "props" (the inputs).
// type = 'button' is a default value, used when no type is passed in.
function Button({ children, onClick, type = 'button', disabled = false }) {
  return (
    <button
      className="btn"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button