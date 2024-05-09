import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Product {
  name: string;
  price: number;
  tva: number;
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

const productsByCategory: { [key: string]: Product[] } = {
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
  Vin: [],
  Boisson_Chaude: [],
};

const Category: React.FC<CategoryProps> = ({ addToCart, cart  }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Entrée');

  const handleOpenCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const handleProductSelection = (product: Product) => {
    addToCart(product.name, 1, product.price, product.tva);
  };

  return (
    <div className="container bg-dark d-flex">
      <nav className="navbar navbar-expand-lg navbar-dark flex-column">
        <div className="container-fluid">
            <ul className="navbar-nav flex-column">
              {Object.keys(productsByCategory).map((category, index) => (
                <li key={index} className={`nav-item fw-bold ${selectedCategory === category ? 'nav-selected' : ''}`}>
                  <button className="nav-link bg-dark border-0 text-white" onClick={() => handleOpenCategory(category)}>{category}</button>
                </li>
              ))}
            </ul>
        </div>
      </nav>
          {selectedCategory && (
            <div className="mt-3">
            <div className="d-flex flex-wrap">
              {productsByCategory[selectedCategory].map((product, index) => (
                <Button key={index} className='m-2' variant="primary" onClick={() => handleProductSelection(product)}>{product.name}</Button>
              ))}
            </div>
              </div>
          )}

    </div>
  );
};

export default Category;
