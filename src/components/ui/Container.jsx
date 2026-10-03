export default function Container({ children, className = '', ...props }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 sm:px-8 ${className}`} {...props}>
      {children}
    </div>
  )
}
