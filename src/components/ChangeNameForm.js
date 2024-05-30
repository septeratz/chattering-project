import React, { useState } from 'react';

const ChangeNameForm = ({ onChangeName }) => {
  const [newName, setNewName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onChangeName(newName);
    setNewName('');
  };

  return (
    <div className='change_name_form'>
      <h3> 아이디 변경 </h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder='변경할 아이디 입력'
          onChange={(e) => setNewName(e.target.value)}
          value={newName}
        />
        <button type="submit">Change</button>
      </form>
    </div>
  );
};

export default ChangeNameForm;
