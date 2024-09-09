import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import WebRouter from './routes/index'

function App() {
  return (
    <div className='app'>
      <Router>
        <WebRouter />
      </Router>
    </div>
  );
}

export default App;
