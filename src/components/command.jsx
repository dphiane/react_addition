import { Link } from "react-router-dom";
import { useState } from 'react';
import Cart from "./cart";
import Categories from './category';

export default function Command() {
    const [cart, setCart] = useState({});
    const initialQuantity = 1; // Initialiser la quantité

    const addToCart = (product, quantity) => {
        setCart((prevCart) => {
          const updatedCart = { ...prevCart };
          updatedCart[product] = quantity;

          if(updatedCart[product]===0){
            delete updatedCart[product]
          }
          return updatedCart;
        });
      };

  return (
    <div className="container-fluid vh-100">
      <div className="d-flex h-100">
        {/* Passez cart comme prop au composant Cart */}
        <Cart cart={cart} addToCart={addToCart} initialQuantity={initialQuantity}/>
        <div className="d-flex flex-column justify-content-between bg-secondary-subtle w-75">
          <Categories addToCart={addToCart} cart={cart} ></Categories>
          <div className="bg-secondary text-light text-center fw-bold p-2">
            <Link to={"/"}>Menu</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
