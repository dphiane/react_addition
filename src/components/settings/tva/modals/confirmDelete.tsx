import React from "react"
import { Modal, Button } from "react-bootstrap"
import { Tva } from "../tva";


interface ConfirmDeleteInterface{
show: boolean;
onHide: ()=> void;
tvaToDelete: Tva | null;
handleDeleteTva: (id:number)=> void;
}

const ConfirmDelete = ({show, onHide,tvaToDelete, handleDeleteTva}:ConfirmDeleteInterface)=>{

return(
    <Modal show={show} onHide={onHide}>
<Modal.Header closeButton closeVariant="white" className='bg-dark'>
  <Modal.Title>Confirmer la suppression</Modal.Title>
</Modal.Header>
<Modal.Body className='bg-dark'>
   Êtes-vous sûr de vouloir supprimer la taxe {tvaToDelete?.tva}% ?
</Modal.Body>
<Modal.Footer className='bg-dark'>
  <Button variant="secondary" onClick={onHide}>
    {tvaToDelete ? 'Fermer' : 'Annuler'}
  </Button>
      <Button variant="danger" onClick={() => handleDeleteTva(tvaToDelete?.id!)}>
      Supprimer
    </Button>
</Modal.Footer>
</Modal>
)
}

export default ConfirmDelete;