// demo-app/src/components/Heading.jsx
// A reusable heading. The "level" prop picks the real HTML tag (h1 to h6).
import './Heading.css'

// id is optional, so other components can point at this heading.
function Heading({ level = 2, id, children }) {
  const Tag = `h${level}`
  return <Tag className="heading" id={id}>{children}</Tag>
}

export default Heading