import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Carts from '../components/carts';
import  { CartItem } from '../types';
import Categories from '../components/categories';
import { getCartFromLocalStorage } from '../utils/cartUtils';

export default function Command() {
    const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const initialQuantity: number = 1;

    useEffect(() => {
        if (selectedTable !== null) {
            setCart(getCartFromLocalStorage(selectedTable));
        }
    }, [selectedTable]);

    const updateCart = (product: string, quantity: number, price: number) => {
        setCart(prevCart => {
            const updatedCart = { ...prevCart };

            if (updatedCart[product]) {
                updatedCart[product].quantity = quantity;
                updatedCart[product].price = price;
            }

            if (quantity === 0) {
                delete updatedCart[product];
            }

            return updatedCart;
        });
    };

    const addToCart = (product: string, quantity: number, price: number, tva: number, id: number) => {
        setCart(prevCart => {
            const updatedCart = { ...prevCart };

            if (updatedCart[product]) {
                updatedCart[product].quantity += quantity;
                updatedCart[product].price = price;
                updatedCart[product].id = id;
            } else {
                updatedCart[product] = { quantity, price, tva, id };
            }

            if (quantity === 0) {
                delete updatedCart[product];
            }
            return updatedCart;
        });
    };

    return (
        <div className="min-vh-100 d-flex flex-column flex-sm-row payment-container">
            <Carts cart={cart} updateQuantity={updateCart} initialQuantity={initialQuantity} onTableSelect={setSelectedTable} />
            <div className="d-flex flex-grow-1 justify-content-between flex-column bg-dark">
                <Categories addToCart={addToCart} cart={cart} />
                <div className="options bg-dark text-light text-center fw-bold p-2">
                    <Link to={'/settings'}>Configuration</Link>
                </div>
            </div>
        </div>
    );
}
