import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { calculateTotalPrice, calculateTotalTVA } from "../functions/cart";

// Define interface for the structure of cart items
interface CartItem {
  quantity: number;
  price: number;
}
interface Payment {
  amount: number;
  paymentMethod: string;
}
interface paymentProps {
  remainder: number
  totalCart: (totalCart: number) => void
  payments: Payment[];
  onDeletePayment: (index: number) => void;
}

const Cart = ({ remainder, totalCart, payments,onDeletePayment }: paymentProps) => {

  const selectTable = localStorage.getItem("selectTable");
  let cart: { [ key: string ]: CartItem } = {};
  if (selectTable) {
    const cartData = localStorage.getItem(selectTable);
    if (cartData) {
      cart = JSON.parse(cartData);
    }
  }
  const handleDelete = (index: number) => {
    onDeletePayment(index); // Appeler la fonction onDeletePayment avec l'index du paiement à supprimer
    };
  useEffect(() => {
    totalCart(calculateTotalPrice(cart))
  })

  return (
    <>
      {selectTable && Object.keys(cart).length > 0 ? (
        <div className="d-flex flex-column flex-grow-1 justify-content-between border-end bg-dark">
          <div>
            <div className="d-flex flex-column">
              <p className="fw-bold text-center mb-0">Table {parseInt(selectTable.split("_")[ 1 ])}</p>
              <p className="text-center">
                {Object.keys(cart).length} article
                {Object.keys(cart).length > 1 ? "s" : ""}
              </p>
              <hr />
            </div>
            <div>
              <ul>
                {Object.entries(cart).map(([ product, { quantity, price } ]) => (
                  <li className="edit-product position-relative m-1" key={product}>
                    <span className="span-text">{quantity} x {product}</span>
                    <span className="position-absolute end-0 me-2">{price * quantity} €</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <p className="position-relative m-1">
              TVA <span className="position-absolute end-0 me-2">{calculateTotalTVA(cart)} €</span>
            </p>
            <p className="position-relative m-1">
              Total HT <span className="position-absolute end-0 me-2">{(calculateTotalPrice(cart) - calculateTotalTVA(cart)).toFixed(2)} €</span>
            </p>
            <p className="fw-bold position-relative m-1">
              Total <span className="position-absolute end-0 me-2">{calculateTotalPrice(cart)} €</span>
            </p>
            <ul>
              {payments.map((payment, index) => (
                <li key={index} className="position-relative m-1">
                {payment.amount}€ en {payment.paymentMethod} <button className="btn position-absolute end-0 text-danger p-0 me-2" onClick={() => handleDelete(index)}><i className="fa-solid fa-trash"></i></button>
                </li>
              ))}
            </ul>
            <p className="fw-bold position-relative m-1">
              Reste à payer <span className="position-absolute end-0 me-2">{remainder} €</span>
            </p>
            <button className="bg-primary text-light text-center fw-bold p-2 w-100 border-0">
              <Link to="/">Retour</Link>
            </button>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column flex-grow-1 justify-content-between border-end">

          <h1 className="text-center mt-5">La table est vide</h1>
          <button className="bg-primary text-light text-center fw-bold p-2 w-100 border-0">
            <Link to="/">Retour</Link>
          </button>
        </div>
      )}
    </>
  );
};

export default Cart;
