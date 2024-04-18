import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

export default function Cart({ cart, addToCart, initialQuantity }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(initialQuantity);
/*   const [price, setPrice] = useState(initialPrice); */

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setQuantity(cart[product]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleChangeQuantity = () => {
    addToCart(selectedProduct, quantity);
    handleCloseModal();
  };

  const handleRemoveProduct = () => {
    addToCart(selectedProduct, 0);
    handleCloseModal();
  };

  return (
    <div className="d-flex flex-column flex-grow-1">
      <div className="position-relative">
        <Link to={"/"}>
          <i className="fa-solid fa-arrow-left position-absolute"></i>
        </Link>
        <h3 className="text-center">Table</h3>
        <hr />
      </div>
      <div>
        <ul>
          {Object.entries(cart).map(([product, quantity]) => (
            <li  className="edit-product position-relative" key={product} onClick={() => handleOpenModal(product)}>
              {product} x {quantity} <span className="position-absolute end-0 me-2">{quantity}</span> 
            </li>
          ))}
        </ul>
      </div>
      <div>Total :</div>
      <div className="bg-primary text-light text-center fw-bold p-2">
        <Link to="/paid">Payer</Link>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center">
            Quantité:{" "}
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
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
}

Cart.propTypes = {
  cart: PropTypes.object.isRequired,
  addToCart: PropTypes.func.isRequired,
  initialQuantity: PropTypes.number.isRequired,
};