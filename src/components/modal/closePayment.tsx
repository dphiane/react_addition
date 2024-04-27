import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Navigate, redirect, useNavigate } from 'react-router-dom';

interface PaymentModalProps {
    show: boolean;
    onHide: () => void;
    payments: { amount: number, paymentMethod: string }[];
    totalCart: number
}

const closePayment = ({ show, onHide ,payments, totalCart }: PaymentModalProps) => {
    const selectTable = localStorage.getItem("selectTable");
    const navigate = useNavigate();

    const handleCloseModal=()=>{
        onHide()
        console.log(selectTable)
        if(selectTable){
            localStorage.removeItem(selectTable)
        }
        navigate("/plan");    
    }
    return (
        <Modal show={show} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Table {selectTable} </Modal.Title>
            </Modal.Header>
            <Modal.Body className='d-flex justify-content-center flex-column align-items-center'>
            <span className='fw-bold m-2'>Paiement</span>
                <ul>
              {payments.map((payment, index) => (
                <li className='text-center' key={index}>
                 {payment.amount}€ en {payment.paymentMethod}
                </li>
              ))}
            </ul>
            
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-between'>
                <div>
            <p className='fw-bold m-1'>Total: {totalCart}€</p>
                </div>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Fermer
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default closePayment;