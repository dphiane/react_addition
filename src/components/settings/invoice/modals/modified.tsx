import React from "react";
import { Modal, Button } from "react-bootstrap";

interface Modified{
    show:boolean;
    onHide:()=>void;
    invoice: string;
}

const Modified = ({show, onHide, invoice}:Modified) =>{
    return(
        <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton closeVariant="white" className='bg-dark'>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark'>
          La facture N°{invoice} modifiée avec succès.
        </Modal.Body>
        <Modal.Footer className='bg-dark'>
          <Button variant="secondary" onClick={onHide}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    )
}
export default Modified;