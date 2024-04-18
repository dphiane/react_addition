import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";

const productsByCategory = {
  Entrée: ["Salade", "Soupe", "Bruschetta"],
  Plats: ["Poulet rôti", "Pâtes carbonara", "Steak frites"],
  Dessert: ["Tiramisu", "Crème brûlée", "Gâteau au chocolat"],
  Boisson: ["Eau plate", "Coca-Cola", "Vin rouge"],
};

export default function Category({ addToCart, cart }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleOpenModal = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleProductSelection = (product) => {
    // Vérifie si le produit existe déjà dans le panier
    if (cart[product]) {
      // Si le produit existe, incrémente la quantité
      addToCart(product, cart[product] + 1);
    } else {
      // Sinon, ajoute le produit au panier avec une quantité de 1
      addToCart(product, 1);
    }
    handleCloseModal();
  };

  const categoryList = Object.keys(productsByCategory).map(
    (category, index) => (
      <div
        className="category m-3 border border-2 border-primary fw-bold rounded"
        key={index}
        onClick={() => handleOpenModal(category)}
      >
        <p className="m-0">{category}</p>
      </div>
    )
  );

  return (
    <div className="container-fluid d-flex flex-wrap justify-content-center justify-content-lg-start">
      {categoryList}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCategory}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCategory && (
            <div className="d-flex">
              {productsByCategory[selectedCategory].map((product, index) => (
                <li
                  className="icon-product border rounded m-2"
                  key={index}
                  onClick={() => handleProductSelection(product)}
                >
                  {product}
                </li>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

Category.propTypes = {
  addToCart: PropTypes.func.isRequired,
  cart: PropTypes.object.isRequired
};
