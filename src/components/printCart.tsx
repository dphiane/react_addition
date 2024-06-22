import React from "react";
import { calculateTotalPrice, calculateTotalTVA } from '../utils/cart';

interface PrintCartProps {
    cart: { [ key: string ]: { quantity: number; price: number; tva: number } };
    table: number
}
const PrintCart = React.forwardRef<HTMLDivElement, PrintCartProps>(({

    cart, table }, ref) => {
    return (
        <div ref={ref} className="m-4 d-flex flex-column align-items-center justify-content-center">
            <div>
                <h1 className="text-center">Mealtin</h1>
                <ul>
                    <li className="text-center">6 rue des Halles,</li>
                    <li className="text-center">68100 Mulhouse</li>
                    <li className="text-center">03.89.61.45.93</li>
                </ul>
                <h3 className="m-2">Table N°{table}</h3>
                <hr className="border border-primary border-3 opacity-75">
                </hr>
                <ul>
                    {Object.entries(cart).map(([ product, { quantity, price } ]) => (
                        <li className="edit-product position-relative m-1" key={product}>
                            <span className='span-text'>{quantity} x {product} </span>
                            <span className="position-absolute end-0 me-2">{price * quantity} €</span>
                        </li>
                    ))}
                </ul>
                <hr className="border border-primary border-3 opacity-75">
                </hr>
                <div className="m-2 d-flex justify-content-between">
                    <div>TVA</div>
                    <div>{calculateTotalTVA(cart)} €</div>
                </div>
                <div className="m-2 d-flex justify-content-between">
                    <div>Total HT</div>
                    <div>{(calculateTotalPrice(cart) - calculateTotalTVA(cart)).toFixed(2)} €</div>
                </div>
                <div className="m-2 d-flex fw-bold justify-content-between">
                    <div>Total TTC</div>
                    <div>{calculateTotalPrice(cart)} €</div>
                </div>
            </div>
        </div>
    )
})
export default PrintCart;