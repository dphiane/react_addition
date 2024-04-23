import React, { Component, useState } from "react";

const Calculator = () => {
  const [ calcul, setCalcul ] = useState("0");
  const operator = [ '+', '-', '/', '*' ];
  const [ reset, setReset ] = useState(false); // Ajoutez reset au state

  function handleInput(input: string) {
    const operatorCount = calcul.split('').filter(char => operator.includes(char)).length;
  
    // Vérifiez si un opérateur est déjà présent et que l'entrée est également un opérateur
    if (operatorCount >= 1 && operator.includes(input)) {
      return;
    }
  
    // Vérifiez si vous devez réinitialiser la valeur de calcul
    if (reset || calcul === '0') {
      setCalcul(input);
      setReset(false);
    } else {
      // Concaténez l'entrée à la valeur existante de calcul
      setCalcul(calcul + input);
    }
  }
  

  function remove() {
    setCalcul(calcul.slice(0, -1));
  }

  function evaluate() {
    const result = eval(calcul).toFixed(2); // Utiliser la fonction eval pour évaluer l'expression
    setCalcul(result.toString());
    setReset(true)
  }
  return (

    <div className="flex-grow-1 d-flex flex-column justify-content-between">
      <div>
      </div>

      <div className="calculator-container d-flex flex-column justify-content-center align-items-center">
        <div className="row">
          <div className="calculator-case"></div>
          <div className="calculator-case"></div>
          <div className="calculator-case"></div>
          <div className="calculator-case"><span className="fw-bold">{calcul}</span></div>
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
          <div className="calculator-case border" onClick={() => remove()}><i className="fa-solid fa-lg fa-delete-left text-primary"></i></div>
          <div className="calculator-case border" onClick={() => handleInput('0')}>0</div>
          <div className="calculator-case border bg-danger" onClick={() => evaluate()}><i className="fa-solid fa-equals text-light "></i></div>
          <div className="calculator-case bg-primary text-light border" onClick={() => handleInput('+')}><i className="fa-solid fa-plus"></i></div>
        </div>
      </div>
      <div className="d-flex justify-content-between border-top">
        <div className="payment-case border-end">
          <p className="m-0 text-center"><i className="fa-solid fa-lg fa-money-bill"></i></p>
          <p className="mt-1 mb-0 text-center">Espèce</p>
        </div>
        <div className="payment-case border-end">
          <p className="m-0 text-center"><i className="fa-solid fa-lg fa-credit-card"></i></p>
          <p className="mt-1 mb-0 text-center">Carte de crédit</p>
        </div>
        <div className="payment-case border-end">
          <p className="m-0 text-center"><i className="fa-solid fa-lg fa-money-check"></i></p>
          <p className="mt-1 mb-0 text-center">Chèque</p>
        </div>
        <div className="payment-case border-end">
          <p className="m-0 text-center"><i className="fa-solid fa-lg  fa-ticket"></i></p>
          <p className="mt-1 mb-0 text-center">Ticket Restaurant</p>
        </div>
      </div>
    </div>
  )
}

export default Calculator;
