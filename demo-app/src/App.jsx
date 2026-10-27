// demo-app/src/App.jsx
// Test page that now uses our own Button component.
import Button from './components/Button.jsx'

function App() {
  return (
    <main className="page">
      <h1 className="title">Token test page</h1>
      <p>This text, the background and the button all come from tokens.css.</p>
      <div className="card">
        <p className="caption">Caption text on a surface (card) color.</p>
        <Button onClick={() => alert('Button clicked')}>Sample button</Button>
        <Button disabled>Disabled button</Button>
      </div>
    </main>
  )
}

export default App