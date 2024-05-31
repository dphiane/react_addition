import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface PaymentModalProps {
    show: boolean;
    onHide: () => void;
    payments: { amount: number, paymentMethod: string }[];
    totalCart: number
}

const closePayment = ({ show, onHide ,payments, totalCart }: PaymentModalProps) => {
    const selectTable = localStorage.getItem("selectTable");
    const tableNumber = selectTable !== null ? selectTable[selectTable.length-1] : undefined;
    const navigate = useNavigate();

    const handleCloseModal=()=>{
        onHide()
        if(selectTable){
            localStorage.removeItem(selectTable)
        }
        navigate("/plan");    
    }
    return (
        <Modal show={show} onHide={handleCloseModal} >
            <Modal.Header  closeVariant="white" closeButton className='bg-dark'>
                <Modal.Title>Table {tableNumber} </Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-dark d-flex justify-content-center flex-column align-items-center'>
            <span className='fw-bold m-2'>Paiement</span>
                <ul>
              {payments.map((payment, index) => (
                <li className='text-center' key={index}>
                 {payment.amount}€ en {payment.paymentMethod}
                </li>
              ))}
            </ul>
            
            </Modal.Body>
            <Modal.Footer className='bg-dark d-flex justify-content-between'>
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