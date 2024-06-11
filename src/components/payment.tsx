import React, { useEffect, useState } from "react";
import Cart from "./cartForPayment";
import Calculator from './calculator';
import ClosePayment from "./modal/closePayment";
import { calculateTotalPrice, calculateTotalTVA } from "../functions/cart";
import axios from 'axios';
import { ProductsInterface } from "./types";

const Payment = () => {
    const [payments, setPayments] = useState<{ amount: number, paymentMethod: string }[]>([]);
    const [remainder, setRemainder] = useState(0);
    const [totalCart, setTotalCart] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [products, setProducts] = useState<(ProductsInterface & { quantity: number; tva: number })[]>([]);

    useEffect(() => {
        const totalPaid = payments.reduce((acc, payment) => acc + payment.amount, 0);
        setRemainder(totalCart - totalPaid);
        if (remainder === 0 && totalPaid !== 0) {
            setShowModal(true);
            saveInvoice();  // Enregistrer la facture lorsque le paiement est finalisé
        }
    }, [totalCart, payments, remainder]);

    const handlePaymentConfirmation = (paymentData: { amount: number, paymentMethod: string }) => {
        setPayments(prevPayments => [...prevPayments, paymentData]);
    };

    const deletePaymentMethod = (index: number) => {
        const updatedPayments = [...payments];
        updatedPayments.splice(index, 1);
        setPayments(updatedPayments);
    };

    const getTotalCart = (totalFromCart: number) => {
        setTotalCart(totalFromCart);
    };

    const handleProductsFetched = (fetchedProducts: (ProductsInterface & { quantity: number; tva: number })[]) => {
        setProducts(fetchedProducts);
    };

    const saveInvoice = async () => {
        const invoiceData = {
            products: products.map(product => ({ 
                id: product.id ,
                quantity: product.quantity, 
            })), 
            tva: calculateTotalTVA(products),
            total: totalCart,
            payments: payments.map(payment => ({
                amount: payment.amount,
                paymentMethod: payment.paymentMethod,
            })),
        };

        try {
            await axios.post('https://localhost:8000/api/create_invoice', invoiceData);
            console.log('Invoice saved successfully');
        } catch (error) {
            console.error('Error saving invoice', error);
        }
        console.log(invoiceData);
    };

    return (
        <div className="container-fluid payment-container flex-sm-row flex-column p-0 d-flex min-vh-100  bg-dark">
            <ClosePayment show={showModal} onHide={() => setShowModal(false)} payments={payments} totalCart={totalCart} />
            <Cart remainder={remainder} totalCart={getTotalCart} payments={payments} onDeletePayment={deletePaymentMethod} onProductsFetched={handleProductsFetched}></Cart>
            <Calculator onPaymentConfirmed={handlePaymentConfirmation} remainder={remainder}></Calculator>
        </div>
    );
};

export default Payment;
