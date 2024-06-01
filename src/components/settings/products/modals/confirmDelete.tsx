import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Products } from '../products';

interface ConfirmDeleteInterface{
    show:boolean;
    onHide: ()=>void;
    productToDelete: Products | null;
    handleDeleteProducts: (id:number)=> void;
}

const ConfirmDelete = ({show,onHide,productToDelete,handleDeleteProducts}:ConfirmDeleteInterface)=>{
return(
    <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton className="bg-dark" closeVariant="white">
      <Modal.Title>Confirmer la suppression</Modal.Title>
    </Modal.Header>
    <Modal.Body className="bg-dark">
      Êtes-vous sûr de vouloir supprimer la catégorie {productToDelete?.name} ?
    </Modal.Body>
    <Modal.Footer className="bg-dark">
      <Button variant="secondary" onClick={onHide}>
        Annuler
      </Button>
      <Button variant="danger" onClick={() => handleDeleteProducts(productToDelete?.id!)}>
        Supprimer
      </Button>
    </Modal.Footer>
  </Modal>
)
}
export default ConfirmDelete;