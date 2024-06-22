import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface CartModalProps {
  showModal: boolean;
  handleCloseModal: () => void;
  selectedProduct: string | null;
  quantity: number;
  setQuantity: (quantity: number) => void;
  handleChangeQuantity: () => void;
  handleRemoveProduct: () => void;
}

const CartModal: React.FC<CartModalProps> = ({
  showModal,
  handleCloseModal,
  selectedProduct,
  quantity,
  setQuantity,
  handleChangeQuantity,
  handleRemoveProduct,
}) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeVariant='white' closeButton className='bg-dark'>
        <Modal.Title>{selectedProduct}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='bg-dark'>
        <p className="text-center">
          Quantité:
          <input
            className='text-center'
            type="number"
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value >= 0) {
                setQuantity(value);
              }
            }}
          />
        </p>
      </Modal.Body>
      <Modal.Footer className='bg-dark'>
        <Button variant="secondary" onClick={handleCloseModal}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleChangeQuantity}>
          Appliquer
        </Button>
        <Button variant="danger" onClick={handleRemoveProduct}>
          Supprimer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CartModal;
