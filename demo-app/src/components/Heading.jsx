// demo-app/src/components/Heading.jsx
// A reusable heading. The "level" prop picks the real HTML tag (h1 to h6).
import './Heading.css'

// level = 2 is the default if none is given. children is the text inside.
function Heading({ level = 2, children }) {
  // Builds the tag name as text: level 1 becomes 'h1', level 2 becomes 'h2'.
  const Tag = `h${level}`

  // A capitalised variable can be used like a tag: <Tag> becomes <h1> or <h2>.
  return <Tag className="heading">{children}</Tag>
}

export default Heading