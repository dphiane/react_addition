import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import TableSelection from './tableSelection';
import { calculateTotalPrice , calculateTotalTVA } from '../functions/cart';

export interface CartProps {
  cart: { [ key: string ]: { quantity: number; price: number; tva: number, comment?: string; } };
  updateQuantity: (product: string, quantity: number, price: number) => void;
  initialQuantity: number;
  onTableSelect: (selectedTable: number | null) => void
}

export interface CartItemType {
  quantity: number;
  price: number;
  tva: number
}

const Carts: React.FC<CartProps> = ({ cart, initialQuantity, updateQuantity, onTableSelect }) => {
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

  const handleSaveCart= () =>{
    localStorage.setItem(`cart_${selectedTable}`, JSON.stringify(cart));
  }


  return (
    <div className="carts d-flex flex-column justify-content-between bg-dark">
      <div>
        <div className='d-flex flex-column'>
          <TableSelection onTableSelect={handleTableSelect} />
          <p className='text-center'>{Object.keys(cart).length} article{Object.keys(cart).length > 1 ? 's' : ''}</p>
          <hr />
        </div>
        <div>
          <ul>
            {Object.entries(cart).map(([ product, { quantity, price , comment } ]) => (
              <li className="edit-product position-relative m-1" key={product} onClick={() => handleOpenModal(product)}>
                <span className='span-text'>{quantity} x {product} </span>
                <span className="position-absolute end-0 me-2">{price * quantity} €</span>
              </li>
            ))}
            </ul>
        </div>
      </div>
      <div>
        <p className='position-relative m-1'>TVA 
          <span className='position-absolute end-0 me-2'>{calculateTotalTVA(cart)} €</span></p>
        <p className='position-relative m-1'>Total HT 
          <span className='position-absolute end-0 me-2'>{(calculateTotalPrice(cart) - calculateTotalTVA(cart)).toFixed(2)} €</span></p>
        <p className='fw-bold position-relative m-1'>Total 
          <span className='position-absolute end-0 me-2'>{calculateTotalPrice(cart)} €</span></p>
        <button className="bg-primary text-light text-center fw-bold p-2 w-100 border-0" onClick={handleSaveCart}>
          <Link to="/payment">Payer</Link>
        </button>
      </div>

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
    </div>
  );
};

export default Carts;