import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

interface Tva {
    id: number;
    tva: number;
  }

interface TvaFormProps {
  tvaToUpdate: Tva | null;
  onSubmit: (updatedTva: number) => void;
  onAddTva: (newTva: number) => void;
  showFormModal: boolean;
  setShowFormModal:(value:boolean)=>void;
  reset: ()=>void;
  error: string;
}

const TvaForm: React.FC<TvaFormProps> = ({ tvaToUpdate, onSubmit, onAddTva,setShowFormModal,showFormModal,reset,error }) => {
  const [tva, setTva] = useState<number>();

  useEffect(() => {
    if (tvaToUpdate) {
      setTva(tvaToUpdate.tva);
      setShowFormModal(true);
    }
  }, [tvaToUpdate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
      if (tvaToUpdate) {
        onSubmit(tva!);
      } else {
        onAddTva(tva!);
    }
  };

  const handleCloseModal=()=>{
    setTva(0);
    reset();
  }
  return (
    <>
      <Modal show={showFormModal} onHide={()=>handleCloseModal()}>
        <Modal.Header closeButton closeVariant="white" className='bg-dark'>
          <Modal.Title>{tvaToUpdate ? 'Modifier une taxe' : 'Ajouter une taxe'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark rounded-bottom'>
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
            {error.length > 0 && (
              <p className='text-danger m-1'>{error}</p>
            )}
            <div className="d-flex justify-content-end">
              <Button className='mt-2' variant="primary" type="submit">
                {tvaToUpdate ? 'Modifier' : 'Ajouter'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

    </>
  );
};

export default TvaForm;
