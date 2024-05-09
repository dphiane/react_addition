import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface PaymentModalProps {
    show: boolean;
    onHide: () => void;
  }

const PaymentModal = ({ show, onHide }:PaymentModalProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton className='bg-dark'>
        <Modal.Title>Erreur de paiement</Modal.Title>
      </Modal.Header>
      <Modal.Body className='bg-dark'>
        Le montant à payer est supérieur au reste à payer. Veuillez saisir un montant valide.
      </Modal.Body>
      <Modal.Footer className='bg-dark'>
        <Button variant="secondary" onClick={onHide}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;