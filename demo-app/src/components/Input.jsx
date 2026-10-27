// demo-app/src/components/Input.jsx
// A reusable text field: label + input + optional hint + optional error.
import { useId } from 'react'
import './Input.css'

// label = visible text above the field (required for accessibility).
// hint  = optional help text. error = optional error message.
// ...rest = any other normal input props (type, placeholder, name...).
function Input({ label, hint, error, ...rest }) {
  // Unique ids so the label and the help text can be linked to the input.
  const inputId = useId()
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`

  // Build the list of help texts that exist, separated by spaces.
  const describedBy = [hint ? hintId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="ui-field">
      {/* htmlFor must match the input's id. */}
      <label className="ui-field__label" htmlFor={inputId}>
        {label}
      </label>

      {hint && (
        <p className="ui-field__hint" id={hintId}>
          {hint}
        </p>
      )}

      <input
        className={error ? 'ui-field__input ui-field__input--error' : 'ui-field__input'}
        id={inputId}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? 'true' : undefined}
        {...rest}
      />

      {error && (
        <p className="ui-field__error" id={errorId}>
          Error: {error}
        </p>
      )}
    </div>
  )
}

export default Input