import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface Product {
  name: string;
  price: number;
  tva: number
}

interface CartItemType {
  quantity: number;
  price: number;
  tva: number
}

interface CategoryProps {
  addToCart: (name: string, quantity: number, price: number, tva: number) => void;
  cart: { [ key: string ]: CartItemType };
}
const productsByCategory: { [ key: string ]: Product[] } = {
  Entrée: [
    { name: 'Salade', price: 5.00, tva: 10 },
    { name: 'Soupe', price: 4.00, tva: 10 },
    { name: 'Bruschetta', price: 6.00, tva: 10 },
  ],
  Plats: [
    { name: 'Poulet rôti', price: 10.00, tva: 10 },
    { name: 'Pâtes carbonara', price: 12.00, tva: 10 },
    { name: 'Steak frites', price: 15.00, tva: 10 },
  ],
  Dessert: [
    { name: 'Tiramisu', price: 8.00, tva: 10 },
    { name: 'Crème brûlée', price: 7.00, tva: 10 },
    { name: 'Gâteau au chocolat', price: 6.50, tva: 10 },
  ],
  Boisson: [
    { name: 'Eau plate', price: 2.50, tva: 10 },
    { name: 'Coca-Cola', price: 3.50, tva: 10 },
    { name: 'Vin rouge', price: 12.00, tva: 20 },
  ],
  Vin: [

  ],
  Boisson_Chaude: [

  ],


};

const Category: React.FC<CategoryProps> = ({ addToCart, cart }) => {
  const [ showModal, setShowModal ] = useState(false);
  const [ selectedCategory, setSelectedCategory ] = useState<string | null>(null);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = (category: string) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleProductSelection = (product: Product) => {
    addToCart(product.name, 1, product.price, product.tva);
    handleCloseModal();
  };


  const categoryList = Object.keys(productsByCategory).map((category, index) => (
    <div
      className={`category m-3 border border-2 border-primary fw-bold rounded  ${category.length > 10 ? 'justify-content-start' : 'justify-content-center'}`}
      key={index}
      onClick={() => handleOpenModal(category)}
    >
      <p className='m-0 text-center'>{category}</p>
    </div>
  ));

  return (
    <div className="container-fluid d-flex flex-wrap justify-content-center justify-content-sm-start">
      {categoryList}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCategory}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCategory && (
            <div className="d-flex flex-column">
              {productsByCategory[ selectedCategory ].map((product, index) => (
                <li
                  className="icon-product m-2 fw-bold"
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
