// demo-app/src/App.jsx
// Test page using Button, Heading, Card and Input.
import Button from './components/Button.jsx'
import Heading from './components/Heading.jsx'
import Card from './components/Card.jsx'
import Input from './components/Input.jsx'

function App() {
  return (
    <main className="page">
      <Heading level={1}>Token test page</Heading>
      <p>This text, the background and the button all come from tokens.css.</p>

      <Card title="Buttons">
        <p className="caption">Caption text on a surface (card) color.</p>
        <Button onClick={() => alert('Button clicked')}>Sample button</Button>
        <Button disabled>Disabled button</Button>
      </Card>

      <Card title="Form fields">
        <Input
          label="Full name"
          hint="As written on your ID card."
          placeholder="e.g. Asha Rao"
        />
        <Input
          label="Email"
          type="email"
          error="Please enter a valid email address."
        />
      </Card>
    </main>
  )
}

export default App