import React, { useState } from 'react';
import Home from './containers/Home/Home';
import Game from './containers/Game/Game';
import './App.css';
import { QuestionSetProvider } from './context/QuestionSetProvider'

const App = () => {
  // States
  const [gameStarted, setGameStarted] = useState(false);

  // Render
  return (
    <QuestionSetProvider>
      {gameStarted ?
        <Game setGameStarted={setGameStarted} /> : 
        <Home setGameStarted={setGameStarted} />
      }
    </QuestionSetProvider>
  );
};

export default App;
