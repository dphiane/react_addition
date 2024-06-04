import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { calculateTotalPrice, calculateTotalTVA } from "../functions/cart";
import { Products } from './settings/products/products';
import axios from "axios";

interface CartItem {
  quantity: number;
  price: number;
  tva: number;
  id: number;
}
interface Payment {
  amount: number;
  paymentMethod: string;
}
interface paymentProps {
  remainder: number;
  totalCart: (totalCart: number) => void;
  payments: Payment[];
  onDeletePayment: (index: number) => void;
  onProductsFetched: (products: (Products & { quantity: number; tva: number })[]) => void; // Add this line
}

const CartForPayment = ({ remainder, totalCart, payments, onDeletePayment , onProductsFetched }: paymentProps) => {
  const selectTable = localStorage.getItem("selectTable");
  const [products, setProducts] = useState<(Products & { quantity: number; tva: number })[]>([]);
  let cart: { [key: string]: CartItem } = {};

  useEffect(() => {
    totalCart(calculateTotalPrice(products));
  });

  useEffect(() => {
    fetchProductDetails(ids);
  }, []);

  if (selectTable) {
    const cartData = localStorage.getItem(selectTable);
    if (cartData) {
      cart = JSON.parse(cartData);
    }
  }
  const ids = Object.entries(cart).map(([product, { id }]) => id);

  const fetchProductDetails = async (productIds: number[]) => {
    try {
      const response = await axios.get('https://localhost:8000/api/multiple', {
        params: {
          ids: productIds.join(',')
        }
      });
      const productsWithQuantityAndTVA = response.data.map((product: Products) => {
        const cartItem = Object.entries(cart).find(([key, item]) => item.id === product.id);
        return {
          ...product,
          quantity: cartItem ? cartItem[1].quantity : 0,
          tva: cartItem ? cartItem[1].tva : 0
        };
      });
      setProducts(productsWithQuantityAndTVA);
      onProductsFetched(productsWithQuantityAndTVA);
    } catch (error) {
      console.error("Error fetching product details", error);
    }
  };

  const handleDelete = (index: number) => {
    onDeletePayment(index);
  };

  return (
    <>
      {selectTable && Object.keys(cart).length > 0 ? (
        <div className="carts d-flex flex-column flex-grow-1 justify-content-between border-end bg-dark">
          <div>
            <div className="d-flex flex-column">
              <h2 className="fw-bold text-center mb-0">Table {parseInt(selectTable.split("_")[1])}</h2>
              <p className="text-center m-0">
                {Object.keys(cart).length} article
                {Object.keys(cart).length > 1 ? "s" : ""}
              </p>
              <hr />
            </div>
            <div>
              <ul>
                {products.map(({ id, name, price, quantity }) => (
                  <li className="edit-product position-relative m-1" key={id}>
                    <span className="span-text">{quantity} x {name}</span>
                    <span className="position-absolute end-0 me-2">{price * quantity} €</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <hr />
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

export default CartForPayment;
