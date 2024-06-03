import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ConfirmationDeleteProps {
    show: boolean;
    onHide: () => void;
    categoryName:string | undefined;
}

const Deleted = ({show,onHide,categoryName}:ConfirmationDeleteProps) => {
    return (
      <>  
        <Modal show={show} onHide={onHide}>
          <Modal.Header closeButton closeVariant="white" className='bg-dark'>
            <Modal.Title>Confirmation de suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body className='bg-dark'>
            La catégorie {categoryName} à bien été supprimée.
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