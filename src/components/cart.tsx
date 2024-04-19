import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

export interface CartProps {
  cart: { [ key: string ]: { quantity: number; price: number } };
  addToCart: (product: string, quantity: number, price: number) => void;
  updateQuantity: (product: string, quantity: number, price: number) => void;
  initialQuantity: number;
}
export interface CartItemType {
  quantity: number;
  price: number;
}

const Cart: React.FC<CartProps> = ({ cart, addToCart, initialQuantity, updateQuantity }) => {
  const [ showModal, setShowModal ] = useState(false);
  const [ selectedProduct, setSelectedProduct ] = useState<string | null>(null);
  const [ quantity, setQuantity ] = useState(initialQuantity);

  const handleOpenModal = (product: string) => {
    setSelectedProduct(product);
    if (cart[ product ]) {
      setQuantity(cart[ product ].quantity);
    } else {
      setQuantity(1);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleChangeQuantity = () => {
    if (selectedProduct && cart[ selectedProduct ]) {
      const { price } = cart[ selectedProduct ];
      updateQuantity(selectedProduct, quantity, price);
      handleCloseModal();
    }
  }

  const handleRemoveProduct = () => {
    if (selectedProduct && cart[ selectedProduct ]) {
      const { quantity, price } = cart[ selectedProduct ];
      addToCart(selectedProduct, 0, price);
      handleCloseModal();
    };
  }
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    Object.values(cart).forEach(item => {
      totalPrice += item.quantity * item.price;
    });
    return totalPrice;
  };

  return (
    <div className="d-flex flex-column flex-grow-1">
      <div className="position-relative">
        <Link to={'/'}>
          <i className="fa-solid fa-arrow-left position-absolute"></i>
        </Link>
        <h3 className="text-center">Table</h3>
        <hr />
      </div>
      <div>
        <ul>
          {Object.entries(cart).map(([ product, { quantity, price } ]) => (
            <li className="edit-product position-relative" key={product} onClick={() => handleOpenModal(product)}>
              {product} x {quantity} <span className="position-absolute end-0 me-2">{price * quantity} €</span>
            </li>
          ))}
        </ul>
      </div>
      <div className='position-relative'>Total TVA <span className='position-absolute end-0 me-2'>{calculateTotalPrice()} €</span></div>
      <div className='fw-bold position-relative'>Total <span className='position-absolute end-0 me-2'>{calculateTotalPrice()} €</span></div>
      <div className="bg-primary text-light text-center fw-bold p-2">
        <Link to="/paid">Payer</Link>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center">
            Quantité:
            <input
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
        <Modal.Footer>
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
    </div>
  );
};


export default Cart;
