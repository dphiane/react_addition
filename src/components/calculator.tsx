import React, { useState, useEffect } from "react";
import PaymentModal from './modal/paymentModal';

interface CalculatorProps {
  onPaymentConfirmed: (paymentData: { amount: number, paymentMethod: string }) => void;
  remainder: number
}

const Calculator = ({ onPaymentConfirmed, remainder }: CalculatorProps) => {
  const [ calcul, setCalcul ] = useState('0');
  const [ reset, setReset ] = useState(false);
  const [ showModal, setShowModal ] = useState(false);
  const operator = [ '+', '-', '/', '*' ];

  useEffect(() => {
    setCalcul(remainder.toString()); // Mettre à jour calcul avec la valeur de remainder lors du chargement initial
  }, [ remainder ]);

  const handleConfirmPayment = (method: string, howMuch: number) => {
    if (howMuch > remainder) {
      setShowModal(true);
      return; // Ne pas continuer si le montant est supérieur au reste
    }

    if (howMuch && method && (howMuch <= remainder)) {
      onPaymentConfirmed({ amount: howMuch, paymentMethod: method });
      setCalcul(remainder.toString());
    }
  };

  function handleInput(input: string) {
    const operatorCount = calcul.split('').filter(char => operator.includes(char)).length;

    if (operatorCount >= 1 && operator.includes(input)) {
      return;
    }

    if (reset || calcul === remainder.toString()) {
      setCalcul(input);
      setReset(false);
    } else {
      setCalcul(calcul + input);
    }
  }

  function remove() {
    setCalcul(calcul.slice(0, -1));
  }

  function evaluate() {
    const result = eval(calcul).toFixed(2);
    setCalcul(result.toString());
    setReset(true)
  }

  return (

    <div className="flex-grow-1 d-flex flex-column justify-content-between">
      <div>
      </div>
      <PaymentModal show={showModal} onHide={() => setShowModal(false)} />

      <div className="calculator-container d-flex flex-column justify-content-center align-items-center">
        <div className="row">
          <div className="calculator-case"></div>
          <div className="calculator-case"></div>
          <div className="calculator-case"><span className="fw-bold">{calcul}</span></div>
          <div className="calculator-case" onClick={() => remove()}><i className="fa-solid fa-lg fa-delete-left text-primary"></i></div>
        </div>
        <div className="row">
          <div className="calculator-case border" onClick={() => handleInput('7')}>7</div>
          <div className="calculator-case border" onClick={() => handleInput('8')}>8</div>
          <div className="calculator-case border" onClick={() => handleInput('9')}>9</div>
          <div className="calculator-case bg-primary text-light border" onClick={() => handleInput('/')}><i className="fa-solid fa-divide"></i></div>
        </div>
        <div className="row">
          <div className="calculator-case border" onClick={() => handleInput('4')}>4</div>
          <div className="calculator-case border" onClick={() => handleInput('5')}>5</div>
          <div className="calculator-case border" onClick={() => handleInput('6')}>6</div>
          <div className="calculator-case bg-primary text-light border" onClick={() => handleInput("*")}><i className="fa-solid fa-xmark"></i></div>
        </div>
        <div className="row">
          <div className="calculator-case border" onClick={() => handleInput('1')}>1</div>
          <div className="calculator-case border" onClick={() => handleInput('2')}>2</div>
          <div className="calculator-case border" onClick={() => handleInput('3')}>3</div>
          <div className="calculator-case bg-primary text-light border" onClick={() => handleInput('-')}><i className="fa-solid fa-minus"></i></div>
        </div>
        <div className="row">
          <div className="calculator-case border" onClick={() => handleInput('.')}>.</div>
          <div className="calculator-case border" onClick={() => handleInput('0')}>0</div>
          <div className="calculator-case border bg-danger" onClick={() => evaluate()}><i className="fa-solid fa-equals text-light "></i></div>
          <div className="calculator-case bg-primary text-light border" onClick={() => handleInput('+')}><i className="fa-solid fa-plus"></i></div>
        </div>
      </div>
      <div className="d-flex justify-content-between border-top">
        <button className="payment-case" onClick={() => { handleConfirmPayment('cash', parseFloat(calcul)) }}>
          <p className="m-0 text-center"><i className="fa-solid fa-lg fa-money-bill"></i></p>
          <p className="mt-1 mb-0 text-center">Espèce</p>
        </button>
        <button className="payment-case" onClick={() => { handleConfirmPayment('credit-card', parseFloat(calcul)) }}>
          <p className="m-0 text-center"><i className="fa-solid fa-lg fa-credit-card"></i></p>
          <p className="mt-1 mb-0 text-center">Carte de crédit</p>
        </button>
        <button className="payment-case" onClick={() => { handleConfirmPayment('money-check', parseFloat(calcul)) }}>
          <p className="m-0 text-center"><i className="fa-solid fa-lg fa-money-check"></i></p>
          <p className="mt-1 mb-0 text-center">Chèque</p>
        </button>
        <button className="payment-case" onClick={() => { handleConfirmPayment('ticket', parseFloat(calcul)) }}>
          <p className="m-0 text-center"><i className="fa-solid fa-lg  fa-ticket"></i></p>
          <p className="mt-1 mb-0 text-center">Ticket Restaurant</p>
        </button>
      </div>
    </div>
  )
}

export default Calculator;
