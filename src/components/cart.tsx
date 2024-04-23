import React from "react";
import { Link } from "react-router-dom";
import { calculateTotalPrice, calculateTotalTVA } from "../functions/cart";

// Define interface for the structure of cart items
interface CartItem {
  quantity: number;
  price: number;
}

const Cart = () => {
  const selectTable = localStorage.getItem("selectTable");
  let cart: { [key: string]: CartItem } = {}; // Define type for cart object

  if (selectTable) {
    const cartData = localStorage.getItem(selectTable);
    if (cartData) {
      cart = JSON.parse(cartData);
    }
  }

  return (
    <>
      {selectTable && Object.keys(cart).length > 0 ? (
        <div className="d-flex flex-column flex-grow-1 justify-content-between border-end">
          <div>
            <div className="d-flex flex-column">
                <p className="fw-bold">Table {parseInt(selectTable.split("_")[1])}</p>
              <p className="text-center">
                {Object.keys(cart).length} article
                {Object.keys(cart).length > 1 ? "s" : ""}
              </p>
              <hr />
            </div>
            <div>
              <ul>
                {Object.entries(cart).map(([product, { quantity, price }]) => (
                  <li className="edit-product position-relative" key={product}>
                    <span className="span-text">{quantity} x {product}</span>
                    <span className="position-absolute end-0 me-2">{price * quantity} €</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <p className="position-relative m-0">
              TVA <span className="position-absolute end-0 me-2">{calculateTotalTVA(cart)} €</span>
            </p>
            <p className="position-relative m-0">
              Total HT <span className="position-absolute end-0 me-2">{(calculateTotalPrice(cart) - calculateTotalTVA(cart)).toFixed(2)} €</span>
            </p>
            <p className="fw-bold position-relative m-0">
              Total <span className="position-absolute end-0 me-2">{calculateTotalPrice(cart)} €</span>
            </p>
            <div className="bg-primary text-light text-center fw-bold p-2">
              <Link to="/">Retour</Link>
            </div>
          </div>
        </div>
      ) : (
        <h1>La table est vide</h1>
      )}
    </>
  );
};

export default Cart;
