import React, { useState } from 'react';

const EditableTitle: React.FC = () => {
  const [title, setTitle] = useState<string>('Ticket');
  const [tempTitle, setTempTitle] = useState<string>(''); 
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempTitle(event.target.value); 
  };

  const handleEditClick = () => {
    setTempTitle(title);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (tempTitle.trim() !== '') {
      setTitle(tempTitle.trim()); 
    }
    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSaveClick();
    }
  };

  return (
    <div className='d-flex justify-content-center'>
      {isEditing ? (
        <input
          type="text"
          value={tempTitle}
          onChange={handleTitleChange}
          onBlur={handleSaveClick}
          onKeyDown={handleKeyDown} // Ajouter le gestionnaire d'événements pour la touche "Entrée"
          autoFocus // Pour mettre automatiquement le focus sur l'entrée lorsqu'elle est affichée
          className='text-center'
        />
      ) : (
        <h3 className="text-center" onClick={handleEditClick}>
          {title}
        </h3>
      )}
    </div>
  );
};

export default EditableTitle;
