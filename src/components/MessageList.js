import React from 'react';
import Message from './Message';

const MessageList = ({ messages }) => {
  return (
    <div className='messages'>
      <h2> 채팅방 </h2>
      {messages.map((message, i) => (
        <Message key={i} user={message.user} text={message.text} />
      ))}
    </div>
  );
};

export default MessageList;
