import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Carts, { CartItemType } from './carts';
import Categories from './category';

export default function Command() {
    const [ cart, setCart ] = useState<{ [ key: string ]: CartItemType }>({});
    const initialQuantity: number = 1;

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
        <div className="container-fluid vh-100">
            <div className="d-flex h-100">
                    <Carts cart={cart} updateQuantity={updateCart} initialQuantity={initialQuantity} />
                <div className="container-category d-flex flex-column justify-content-between bg-secondary-subtle">
                    <Categories addToCart={addToCart} cart={cart} />
                    <div className="bg-secondary text-light text-center fw-bold p-2">
                        <Link to={'/'}>Menu</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
