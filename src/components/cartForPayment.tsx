import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { calculatePrice, calculateTotalPrice, calculateTotalTVA } from "../utils/cart";
import { ProductsInterface } from '../types';
import { getMultipleProducts } from "api";
import Loader from "./loader";

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
  onProductsFetched: (products: (ProductsInterface & { quantity: number; tva: number })[]) => void;
}

const CartForPayment = ({ remainder, totalCart, payments, onDeletePayment , onProductsFetched }: paymentProps) => {
  const selectTable = localStorage.getItem("selectTable");
  const [products, setProducts] = useState<(ProductsInterface & { quantity: number; tva: number })[]>([]);
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
  const [ids, setIds] = useState<number[]>([]);
  const [loading,setLoading]= useState<boolean>(false);

  useEffect(() => {
    totalCart(calculateTotalPrice(products));
  }, [products, totalCart]);

  useEffect(() => {
    if (ids.length > 0) {
      fetchProductDetails(ids);
    }
  }, [ids]);

  useEffect(() => {
    if (selectTable) {
      const cartData = localStorage.getItem(selectTable);
      if (cartData) {
        const parsedCart = JSON.parse(cartData) as { [key: string]: CartItem };
        setCart(parsedCart);
        const productIds = Object.entries(parsedCart).map(([_, { id }]) => id);
        setIds(productIds);
      }
    }
  }, [selectTable]);

  const fetchProductDetails = async (productIds: number[]) => {
    setLoading(true);
    try {
      const response = await getMultipleProducts(productIds);
      const productsWithQuantityAndTVA = response.data.map((product: ProductsInterface) => {
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
    }finally{
      setLoading(false);
    }
  };

  const handleDelete = (index: number) => {
    onDeletePayment(index);
  };
  const totalQuantity = Object.values(cart).reduce((acc, { quantity }) => acc + quantity, 0);

  return (
    <>
      {selectTable && Object.keys(cart).length > 0 ? (

        <div className="carts d-flex flex-column flex-grow-1 justify-content-between border-end bg-dark">
          <div>
            <div className="d-flex flex-column">
              <h2 className="fw-bold text-center mb-0">Table {parseInt(selectTable.split("_")[1])}</h2>
              <p className="text-center m-0">
              {totalQuantity} article
              {totalQuantity > 1 ? "s" : ""}
              </p>
              <hr />
            </div>
            {loading ? (
              <Loader loading={loading}></Loader>
            ) : (
              <div>
                <ul>
                  {products.map(({ id, name, price, quantity }) => (
                    <li className="edit-product position-relative m-1" key={id}>
                      <span className="span-text">{quantity} x {name}</span>
                      <span className="position-absolute end-0 me-2">{calculatePrice(price,quantity)} €</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
