import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

interface Tva {
    id: number;
    tva: number;
  }

interface TvaFormProps { // Correction de la casse du nom de l'interface
  tvaToUpdate: Tva | null;
  onSubmit: (updatedTva: number) => void;
  onAddTva: (newTva: number) => void;
  existingTva: number | null;
  showFormModal: boolean;
  setShowFormModal:(value:boolean)=>void;
}

const TvaForm: React.FC<TvaFormProps> = ({ tvaToUpdate, onSubmit, onAddTva, existingTva,setShowFormModal,showFormModal }) => {
  const [tva, setTva] = useState<number>();
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

  useEffect(() => {
    if (tvaToUpdate) {
      setTva(tvaToUpdate.tva);
      setShowFormModal(true);
    }
  }, [tvaToUpdate]);

  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setTva(0);
  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
      if (tvaToUpdate) {
        onSubmit(tva!);
        handleCloseFormModal();
        if (existingTva !== null) {
          setShowConfirmationModal(true);
        }
        setShowConfirmationModal(true);
      } else {
        onAddTva(tva!);
        handleCloseFormModal();
        if (existingTva !== null) {
          setShowConfirmationModal(true);
        }
    }
  };

  return (
    <>
      <Modal show={showFormModal} onHide={handleCloseFormModal}>
        <Modal.Header closeButton closeVariant="white" className='bg-dark'>
          <Modal.Title>{tvaToUpdate ? 'Modifier une taxe' : 'Ajouter une taxe'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark'>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="tva">
              <Form.Control
                type="number"
                value={tva === 0 ? '' : tva}
                min={0} 
                max={100}
                onChange={(e) => setTva(Number(e.target.value))} 
                autoFocus
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button className='m-2' variant="primary" type="submit">
                {tvaToUpdate ? 'Modifier' : 'Ajouter'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
        <Modal.Header closeButton  closeVariant="white" className='bg-dark'>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark'>
          La tva de {tva} a été {tvaToUpdate ? 'modifiée' : 'ajoutée'} avec succès.
        </Modal.Body>
        <Modal.Footer className='bg-dark'>
          <Button variant="secondary" onClick={handleCloseConfirmationModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TvaForm;
