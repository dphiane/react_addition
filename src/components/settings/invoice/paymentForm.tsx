import React from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

interface PaymentFormProps {
  remainder: number;
  newPaymentAmount: string;
  setNewPaymentAmount: (value: string) => void;
  newPaymentMethod: string;
  setNewPaymentMethod: (value: string) => void;
  addPaymentMethod: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  remainder, newPaymentAmount, setNewPaymentAmount, 
  newPaymentMethod, setNewPaymentMethod, addPaymentMethod 
}) => {
  return (
    <>
      {remainder > 0 && (
        <>
          <p className="position-relative fw-bold">Reste à payer <span className="position-absolute end-0 me-2">{remainder}€</span></p>
          <InputGroup className="mb-3">
            <Form.Control type="text" placeholder="Montant payé" value={newPaymentAmount} onChange={(e) => setNewPaymentAmount(e.target.value)} />
            <Form.Select aria-label="Sélectionner un moyen de paiement" value={newPaymentMethod} onChange={(e) => setNewPaymentMethod(e.target.value)} >
              <option value="Espèce">Espèce</option>
              <option value="Carte bancaire">Carte Bancaire</option>
              <option value="Ticket restaurant">Ticket Restaurant</option>
              <option value="Chèque">Chèque</option>
            </Form.Select>
            <Button variant="primary" id="button-addon1" onClick={addPaymentMethod}>
              Ajouter
            </Button>
          </InputGroup>
          <hr />
        </>
      )}
    </>
  );
};

export default PaymentForm;
