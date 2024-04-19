import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface Product {
  name: string;
  price: number;
}

interface CartItemType {
  quantity: number;
  price: number;
}

interface CategoryProps {
  addToCart: (name: string, quantity: number, price: number) => void;
  cart: { [key: string]: CartItemType };
}
const productsByCategory: { [key: string]: Product[] } = {
  Entrée: [
    { name: 'Salade', price: 5.00 },
    { name: 'Soupe', price: 4.00 },
    { name: 'Bruschetta', price: 6.00 },
  ],
  Plats: [
    { name: 'Poulet rôti', price: 10.00 },
    { name: 'Pâtes carbonara', price: 12.00 },
    { name: 'Steak frites', price: 15.00 },
  ],
  Dessert: [
    { name: 'Tiramisu', price: 8.00 },
    { name: 'Crème brûlée', price: 7.00 },
    { name: 'Gâteau au chocolat', price: 6.50 },
  ],
  Boisson: [
    { name: 'Eau plate', price: 2.50 },
    { name: 'Coca-Cola', price: 3.50 },
    { name: 'Vin rouge', price: 12.00 },
  ],
};

const Category: React.FC<CategoryProps> = ({ addToCart, cart }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = (category: string) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleProductSelection = (product: Product) => {
    addToCart(product.name, 1, product.price);
    handleCloseModal();
};


  const categoryList = Object.keys(productsByCategory).map((category, index) => (
    <div
      className="category m-3 border border-2 border-primary fw-bold rounded"
      key={index}
      onClick={() => handleOpenModal(category)}
    >
      <p className="m-0">{category}</p>
    </div>
  ));

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
                  {product.name}
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
};

export default Category;
