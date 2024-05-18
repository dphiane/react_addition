import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Carts, { CartItemType } from './carts';
import Categories from './categories';

export default function Command() {
    const [ cart, setCart ] = useState<{ [ key: string ]: CartItemType }>({});
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const initialQuantity: number = 1;

    const handleTableSelect = (tableNumber: number | null) => {
        setSelectedTable(tableNumber);
    };
    
    useEffect(() => {
        if (selectedTable !== null) {
            const cartFromLocalStorage = localStorage.getItem(`cart_${selectedTable}`);
            if (cartFromLocalStorage) {
                setCart(JSON.parse(cartFromLocalStorage));
            } else {
                setCart({});
            }
        }
    }, [selectedTable]);

    const updateCart = (product: string, quantity: number, price: number) => {
        setCart((prevCart) => {
            const updatedCart = { ...prevCart };

            if (updatedCart[ product ]) {
                updatedCart[ product ].quantity = quantity;
                updatedCart[ product ].price = price;
            }

            if (quantity === 0) {
                delete updatedCart[ product ];
            }

            return updatedCart;
        });
    };
    const addToCart = (product: string, quantity: number, price: number, tva: number) => {
        setCart((prevCart) => {
            const updatedCart = { ...prevCart };

            if (updatedCart[ product ]) {
                updatedCart[ product ].quantity += quantity;
                updatedCart[ product ].price = price;
            } else {
                updatedCart[ product ] = { quantity, price, tva };
            }

            if (quantity === 0) {
                delete updatedCart[ product ];
            }
            return updatedCart;
        });
    };

    return (
            <div className="min-vh-100 d-flex flex-column flex-sm-row payment-container">
                    <Carts cart={cart} updateQuantity={updateCart} initialQuantity={initialQuantity} onTableSelect={handleTableSelect} />
                <div className="d-flex justify-content-between flex-column bg-dark">
                    <Categories addToCart={addToCart} cart={cart} />
                    <div className="options bg-dark text-light text-center fw-bold p-2">
                        <Link to={'/settings'}>Configuration</Link>
                    </div>
                </div>
            </div>
    );
}