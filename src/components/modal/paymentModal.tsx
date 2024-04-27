import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface PaymentModalProps {
    show: boolean;
    onHide: () => void;
  }

const PaymentModal = ({ show, onHide }:PaymentModalProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Erreur de paiement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Le montant à payer est supérieur au reste à payer. Veuillez saisir un montant valide.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;