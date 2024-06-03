import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Category } from '../category';

interface ConfirmDeleteInterface{
    show:boolean;
    onHide: ()=>void;
    categoryToDelete:  Category | null;
    handleDeleteCategory: (id:number)=> void;
}

const ConfirmDelete = ({show,onHide,categoryToDelete,handleDeleteCategory}:ConfirmDeleteInterface)=>{
return(
    <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton className="bg-dark" closeVariant="white">
      <Modal.Title>Confirmer la suppression</Modal.Title>
    </Modal.Header>
    <Modal.Body className="bg-dark">
      Êtes-vous sûr de vouloir supprimer la catégorie {categoryToDelete?.name} ?
    </Modal.Body>
    <Modal.Footer className="bg-dark">
      <Button variant="secondary" onClick={onHide}>
        Annuler
      </Button>
      <Button variant="danger" onClick={() => handleDeleteCategory(categoryToDelete?.id!)}>
        Supprimer
      </Button>
    </Modal.Footer>
  </Modal>
)
}
export default ConfirmDelete;