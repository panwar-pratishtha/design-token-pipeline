// demo-app/src/components/Card.jsx
// A reusable card: a section with a heading that names it.
import { useId } from 'react'
import Heading from './Heading.jsx'
import './Card.css'

// title = the card's heading text. headingLevel = which h-tag to use.
function Card({ title, headingLevel = 2, children }) {
  // useId gives a unique id, so the section can point at its heading.
  const headingId = useId()

  return (
    // aria-labelledby tells screen readers: "this section is named by that id".
    <section className="ui-card" aria-labelledby={headingId}>
      <Heading level={headingLevel} id={headingId}>{title}</Heading>
      {children}
    </section>
  )
}

export default Card