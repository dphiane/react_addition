import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Menu from './menu';

export interface CartProps {
  cart: { [ key: string ]: { quantity: number; price: number; tva: number } };
  updateQuantity: (product: string, quantity: number, price: number) => void;
  initialQuantity: number;
  onTableSelect: (selectedTable: number | null) => void
}

export interface CartItemType {
  quantity: number;
  price: number;
  tva: number
}

const Cart: React.FC<CartProps> = ({ cart, initialQuantity, updateQuantity, onTableSelect }) => {
  const [ showModal, setShowModal ] = useState(false);
  const [ selectedProduct, setSelectedProduct ] = useState<string | null>(null);
  const [ quantity, setQuantity ] = useState(initialQuantity);
  const [selectedTable, setSelectedTable] = useState<number | null>(() => {
    const storedTable = localStorage.getItem('selectTable');
    return storedTable ? parseInt(storedTable.split("_")[1]) : 1
});

  useEffect(() => {
    onTableSelect(selectedTable)
  }, [ selectedTable , onTableSelect ]);

  useEffect(() => {
    onTableSelect(selectedTable);
  }, [ selectedTable, onTableSelect ]);

  const handleTableSelect = (tableNumber: number) => {
    localStorage.setItem(`cart_${selectedTable}`, JSON.stringify(cart));
    setSelectedTable(tableNumber + 1);
    localStorage.setItem('selectTable', `cart_${tableNumber + 1}`)
  }

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
  };

  const handleRemoveProduct = () => {
    if (selectedProduct && cart[ selectedProduct ]) {
      const { price } = cart[ selectedProduct ];
      updateQuantity(selectedProduct, 0, price);
      handleCloseModal();
    }
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    Object.values(cart).forEach(item => {
      totalPrice += item.quantity * item.price;
    });
    return totalPrice;
  };

  const calculateTotalTVA = () => {
    let total = 0;
    Object.values(cart).forEach(item => {
      total += item.quantity * (item.price / (1 + item.tva));
    });
    return parseFloat(total.toFixed(2));
  };

  return (
    <div className="d-flex flex-column flex-grow-1 justify-content-between">
      <div>
        <div className='d-flex flex-column'>
          <Menu onTableSelect={handleTableSelect} />
          <p className='text-center'>{Object.keys(cart).length} article{Object.keys(cart).length > 1 ? 's' : ''}</p>
          <hr />
        </div>
        <div>
          <ul>
            {Object.entries(cart).map(([ product, { quantity, price } ]) => (
              <li className="edit-product position-relative" key={product} onClick={() => handleOpenModal(product)}>
                <span className='span-text'>{quantity} x {product} </span><span className="position-absolute end-0 me-2">{price * quantity} €</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <p className='position-relative m-0'>TVA <span className='position-absolute end-0 me-2'>{calculateTotalTVA()} €</span></p>
        <p className='position-relative m-0'>Total HT <span className='position-absolute end-0 me-2'>{(calculateTotalPrice() - calculateTotalTVA()).toFixed(2)} €</span></p>
        <p className='fw-bold position-relative m-0'>Total <span className='position-absolute end-0 me-2'>{calculateTotalPrice()} €</span></p>
        <div className="bg-primary text-light text-center fw-bold p-2">
          <Link to="/paid">Payer</Link>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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