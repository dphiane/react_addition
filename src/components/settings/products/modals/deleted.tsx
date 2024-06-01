import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ConfirmationDeleteProps {
    handleShow: boolean;
    handleClose: () => void;
    articleName:string | undefined;
}

const Deleted = ({handleShow,handleClose,articleName}:ConfirmationDeleteProps) => {
    return (
      <>  
        <Modal show={handleShow} onHide={handleClose}>
          <Modal.Header closeButton closeVariant="white" className='bg-dark'>
            <Modal.Title>Confirmation de suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body className='bg-dark'>
            L'article {articleName} à bien été supprimée
          </Modal.Body>
          <Modal.Footer className='bg-dark'>
            <Button variant="secondary" onClick={handleClose}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
  export default Deleted;