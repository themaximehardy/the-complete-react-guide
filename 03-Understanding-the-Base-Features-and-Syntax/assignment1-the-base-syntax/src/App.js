import React, { useState } from 'react';
import UserInput from './UserInput/UserInput';
import UserOutput from './UserOutput/UserOutput';
import './App.css';

const App = () => {
  const [username, setUsername] = useState('Max');

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  return (
    <div className="App">
      <UserInput changeUsername={handleChangeUsername} username={username} />
      <UserOutput username={username} />
    </div>
  );
};

export default App;
