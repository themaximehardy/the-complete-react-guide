import React, { useState } from 'react';
import Validation from './Validation/Validation';
import Char from './Char/Char';
import './App.css';

const App = () => {
  const [text, setText] = useState('text');

  const inputChangedHandler = (event) => {
    setText(event.target.value);
  };

  const deleteLetterHandler = (index) => {
    const newText = text.split('');
    newText.splice(index, 1);
    setText(newText.join(''));
  };

  const charList = text.split('').map((letter, index) => {
    return (
      <Char
        key={index}
        letter={letter}
        clicked={() => deleteLetterHandler(index)}
      />
    );
  });

  return (
    <div className="App">
      <input onChange={inputChangedHandler} type="text" value={text} />
      <p>The length of the text is {text.length}</p>
      <Validation length={text.length} />
      {charList}
    </div>
  );
};

export default App;
