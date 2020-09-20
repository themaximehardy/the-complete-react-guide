import React from 'react';

const userOutput = (props) => {
  const style = {
    backgroundColor: '#eee',
    marginTop: '10px',
    border: '1px solid #c9c9c9',
  };
  return (
    <div style={style}>
      <p>Username: {props.username}</p>
      <p>Paragraph 2</p>
    </div>
  );
};

export default userOutput;
