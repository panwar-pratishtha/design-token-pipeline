// demo-app/src/App.jsx
// Test page using our Button and Heading components.
import Button from './components/Button.jsx'
import Heading from './components/Heading.jsx'

function App() {
  return (
    <main className="page">
      <Heading level={1}>Token test page</Heading>
      <p>This text, the background and the button all come from tokens.css.</p>
      <div className="card">
        <Heading level={2}>Buttons</Heading>
        <p className="caption">Caption text on a surface (card) color.</p>
        <Button onClick={() => alert('Button clicked')}>Sample button</Button>
        <Button disabled>Disabled button</Button>
      </div>
    </main>
  )
}

export default App