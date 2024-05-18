import React, { useEffect, useState } from "react";
import Cart from "./cart";
import Calculator from './calculator';
import ClosePayment from "./modal/closePayment";

const Payment = () => {
    const [ payments, setPayments ] = useState<{ amount: number, paymentMethod: string }[]>([]);
    const [ remainder, setRemainder ] = useState(0);
    const [ totalCart, setTotalCart ] = useState(0);
    const [ showModal, setShowModal ] = useState(false);

    useEffect(() => {
        const totalPaid = payments.reduce((acc, payment) => acc + payment.amount, 0);
        setRemainder(totalCart - totalPaid);
        if (remainder === 0 && totalPaid !== 0) {
            setShowModal(true);
        }
    }, [totalCart, payments,remainder]);

    const handlePaymentConfirmation = (paymentData: { amount: number, paymentMethod: string }) => {
        setPayments(prevPayments => [ ...prevPayments, paymentData ]);
    };

    const deletePaymentMethod = (index: number) => {
        const updatedPayments = [...payments];
        updatedPayments.splice(index, 1);
        setPayments(updatedPayments);
      };

    const getTotalCart = (totalFromCart: number) => {
        setTotalCart(totalFromCart);
    }

    return (
        <div className="container-fluid payment-container flex-sm-row flex-column p-0 d-flex min-vh-100  bg-dark">
            <ClosePayment show={showModal} onHide={() => setShowModal(false)} payments={payments} totalCart={totalCart}/>
            <Cart remainder={remainder} totalCart={getTotalCart} payments={payments} onDeletePayment={deletePaymentMethod}></Cart>
            <Calculator onPaymentConfirmed={handlePaymentConfirmation} remainder={remainder}></Calculator>
        </div>
    )
}

export default Payment;
