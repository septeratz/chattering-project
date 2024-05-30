import React from 'react';

const Message = ({ user, text }) => {
  return (
    <div className="message">
      <strong>{user} :</strong>
      <span>{text}</span>
    </div>
  );
};

export default Message;
