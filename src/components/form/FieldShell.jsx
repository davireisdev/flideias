export default function FieldShell({ id, label, hint, children }) {
  const labelId = `${id}-label`
  const hintId = hint ? `${id}-hint` : undefined

  return (
    <div className="flex flex-col gap-2">
      <label id={labelId} htmlFor={id} className="text-sm font-medium text-white">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-xs text-white/50">
          {hint}
        </p>
      )}
      {children}
    </div>
  )
}
