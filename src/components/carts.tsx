import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import TableSelection from './tableSelection';
import { calculateTotalPrice, calculateTotalTVA } from '../utils/cartUtils';
import ReactToPrint from 'react-to-print';
import PrintCart from './printCart';
import CartModal from './cartModal';
import { CartProps, CartItemType } from '../types';

const Carts: React.FC<CartProps> = ({ cart, initialQuantity, updateQuantity, onTableSelect }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(initialQuantity);
  const componentRef = useRef<HTMLDivElement>(null);

  const [selectedTable, setSelectedTable] = useState<number | null>(() => {
    const storedTable = localStorage.getItem('selectTable');
    return storedTable ? parseInt(storedTable.split("_")[1]) : 1;
  });

  useEffect(() => {
    onTableSelect(selectedTable);
  }, [selectedTable, onTableSelect]);

  const handleTableSelect = (tableNumber: number) => {
    localStorage.setItem(`cart_${selectedTable}`, JSON.stringify(cart));
    setSelectedTable(tableNumber + 1);
    localStorage.setItem('selectTable', `cart_${tableNumber + 1}`);
  };

  const handleOpenModal = (product: string) => {
    setSelectedProduct(product);
    setQuantity(cart[product]?.quantity || initialQuantity);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleChangeQuantity = () => {
    if (selectedProduct) {
      const { price } = cart[selectedProduct];
      updateQuantity(selectedProduct, quantity, price);
      handleCloseModal();
    }
  };

  const handleRemoveProduct = () => {
    if (selectedProduct) {
      const { price } = cart[selectedProduct];
      updateQuantity(selectedProduct, 0, price);
      handleCloseModal();
    }
  };

  const handleSaveCart = () => {
    localStorage.setItem(`cart_${selectedTable}`, JSON.stringify(cart));
  };

  return (
    <div className="carts d-flex flex-column justify-content-between bg-dark">
      <div>
        <div className='d-flex flex-column'>
          <TableSelection onTableSelect={handleTableSelect} />
          <p className='text-center m-0'>{Object.keys(cart).length} article{Object.keys(cart).length > 1 ? 's' : ''}</p>
          <ReactToPrint
            trigger={() => <button className='btn btn-secondary rounded-0'><i className="fa-solid fa-print"></i> Imprimer</button>}
            content={() => componentRef.current}
          />
        </div>
        <div style={{ display: 'none' }}>
          <PrintCart cart={cart} table={selectedTable!} ref={componentRef} />
        </div>
        <div>
          <ul>
            {Object.entries(cart).map(([product, { quantity, price }]) => (
              <li className="edit-product position-relative m-1" key={product} onClick={() => handleOpenModal(product)}>
                <span className='span-text'>{quantity} x {product} </span>
                <span className="position-absolute end-0 me-2">{price * quantity} €</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className='position-relative m-1'>TVA 
          <span className='position-absolute end-0 me-2'>{calculateTotalTVA(cart).toFixed(2)} €</span></p>
        <p className='position-relative m-1'>Total HT 
          <span className='position-absolute end-0 me-2'>{(calculateTotalPrice(cart) - calculateTotalTVA(cart)).toFixed(2)} €</span></p>
        <p className='fw-bold position-relative m-1'>Total 
          <span className='position-absolute end-0 me-2'>{calculateTotalPrice(cart).toFixed(2)} €</span></p>
        <button className="bg-primary text-light text-center fw-bold p-2 w-100 border-0" onClick={handleSaveCart}>
          <Link to="/payment" className='text-light text-decoration-none'>Payer</Link>
        </button>
      </div>

      <CartModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        selectedProduct={selectedProduct}
        quantity={quantity}
        setQuantity={setQuantity}
        handleChangeQuantity={handleChangeQuantity}
        handleRemoveProduct={handleRemoveProduct}
      />
    </div>
  );
};

export default Carts;
