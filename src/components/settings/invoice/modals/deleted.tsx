import React from "react";
import { Modal, Button } from "react-bootstrap";

interface DeleteProps {
    show: boolean;
    onHide: () => void;
    invoice:string | undefined;
}

const Deleted = ({show,onHide,invoice}:DeleteProps) => {
    return (
      <>  
        <Modal show={show} onHide={onHide}>
          <Modal.Header closeButton closeVariant="white" className='bg-dark'>
            <Modal.Title>Confirmation de suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body className='bg-dark'>
            La facture N°{invoice} à bien été supprimée.
          </Modal.Body>
          <Modal.Footer className='bg-dark'>
            <Button variant="secondary" onClick={onHide}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
  export default Deleted;