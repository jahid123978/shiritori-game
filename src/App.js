import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [players, setPlayers]  = useState({player1: 0, player2: 0});
  const [currentPlayer, setCurrentPlayer] = useState('player1');
  const [wordHistory, setWordHistory] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [countDown, setCountDown] = useState(30);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const timerRef = useRef(null)
  const lastLetter = wordHistory.length > 0 ? wordHistory[wordHistory.length-1].slice(-1): "";

  const validateWord = async(word) =>{
    try{
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      return response.ok;
    }catch(error){
      console.log("API calling error: ", error)
      return false
    }
  };

  const handleTimeout = useCallback(()=>{
    setPlayers(prev =>({...prev, [currentPlayer]:prev[currentPlayer]-1}));
    setError("Time is up");
    swicthPlayer();
  },[currentPlayer]);

  const swicthPlayer = () =>{
    setCurrentPlayer(prev => prev === 'player1'? 'player2' : 'player1');
    setCountDown(30);
  };

  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(!currentWord || isLoading) return;

    const word = currentWord.trim().toLowerCase();

    let structuralError = '';
    if(word.length < 4){
      structuralError = 'Word must be at least 4 letters';
    }
    else if(wordHistory.includes(word)){
      structuralError = 'Word already used';
    }
    else if(wordHistory.length > 0 && word[0] !== lastLetter){
      structuralError = `Must start with ${lastLetter}`;
    }

    if(structuralError){
      setError(structuralError);
      setPlayers(prev => ({...prev, [currentPlayer]:prev[currentPlayer]-1}));
      swicthPlayer();
      setCurrentWord('');
      return;
    }

    setIsLoading(true);
    try{
      const isValid = await validateWord(word);
      if(isValid){
        setWordHistory(prev => [...prev, word]);
        setError('');

        if(!gameStarted){
          setGameStarted(true);
        }
        swicthPlayer();
      }
      else{
        setError('invalid English word');
        setPlayers(prev =>({...prev, [currentPlayer]:prev[currentPlayer]-1}));
        swicthPlayer();
      }
    }catch(error){
      setError("Validation failed");
      setPlayers(prev => ({...prev, [currentPlayer]:prev[currentPlayer]-1}));
      swicthPlayer();
    } finally{
      setIsLoading(false);
      setCurrentWord('');
    }
  };

  useEffect(()=>{
    if(gameStarted && countDown > 0){
      timerRef.current = setInterval(()=>{
        setCountDown(prev =>prev-1);
      }, 1000);
    }else if(countDown === 0){
      handleTimeout();
    }

    return ()=> clearInterval(timerRef.current);
  },[gameStarted, countDown, handleTimeout])


  return (
    <div className="App">
      <div style={{padding: '20px', maxWidth: '600px', margin: '0 auto'}}>
      <h1>Welcome to Shiritori Game</h1>

      <div className='Game-scores' style={{marginn: '20px 0'}}>
        <h2>Scores</h2>
        <p className='first-player'>Player 1: {players.player1} </p>
        <p className='second-player'>Player 2: {players.player2} </p>
      </div>

   {gameStarted? (<div className='playing-time'>
        <h3>Playing Current Player: {currentPlayer} </h3>
        <p>Time Remaining: {countDown}s</p>
        {lastLetter && <p>Next Word must with: {lastLetter.toUpperCase()} </p>}
        </div>):
       (<p className='input-title'>Start by entering the first word (min 4 letters)!</p>)}

        <form className='input-form' onSubmit={handleSubmit}>
         <input
         type='text'
         value= {currentWord}
         onChange={(e)=>setCurrentWord(e.target.value)}
         disabled= {isLoading}
         style= {{textAlign: 'center', marginRight:'10px', padding: '10px', width:'36%', border: '1px solid white', borderRadius:'5px'}}
         />
         <button
         type="submit"
         disabled={isLoading}
         style={{padding: '10px 15px', color:'black', border: '1px solid white', borderRadius:'5px'}}
         >{isLoading? 'Validating...': 'Submit'}</button>
        </form>

        {error && <p style={{color: 'red'}}>Error: {error}</p>}

        <div className='history-section'>
          <h3>Word History</h3>
          <ul>
            {
              wordHistory.map((word, index)=>(
                <li key={index}>{word}</li>
              ))
            }
           
          </ul>
        </div>
      
      </div>
       
    </div>
  );
}

export default App;
