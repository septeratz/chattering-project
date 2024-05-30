import React, { useState } from 'react';

const ChatRoomList = ({ rooms, onSelectRoom, onCreateRoom }) => {
  const [search, setSearch] = useState('');

  const filteredRooms = rooms.filter(room =>
    room.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateRoom = () => {
    if (!filteredRooms.length) {
      onCreateRoom(search);
    }
  };

  return (
    <div>
      <h2>Chat Rooms</h2>
      <input
        type="text"
        placeholder="Search rooms..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul>
        {filteredRooms.map((room, index) => (
          <li key={index} onClick={() => onSelectRoom(room)}>
            <strong>{room}</strong>
          </li>
        ))}
      </ul>
      {!filteredRooms.length && search && (
        <button onClick={handleCreateRoom}>Create Room "{search}"</button>
      )}
    </div>
  );
};

export default ChatRoomList;
