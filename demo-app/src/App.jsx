// demo-app/src/App.jsx
// A small test page to prove the tokens reach the screen.
function App() {
  return (
    <main className="page">
      <h1 className="title">Token test page</h1>
      <p>This text, the background and the button all come from tokens.css.</p>
      <div className="card">
        <p className="caption">Caption text on a surface (card) color.</p>
        <button className="demo-button" type="button">
          Sample button
        </button>
      </div>
    </main>
  )
}

export default App