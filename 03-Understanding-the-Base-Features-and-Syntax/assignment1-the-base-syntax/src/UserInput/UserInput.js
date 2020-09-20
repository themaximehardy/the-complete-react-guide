import React from 'react';

const userInput = (props) => {
  return (
    <input onChange={props.changeUsername} type="text" value={props.username} />
  );
};

export default userInput;
