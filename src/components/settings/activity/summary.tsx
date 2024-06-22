import React from "react";
import { Table } from "react-bootstrap";

interface SummaryProps {
  totalTTC: number;
  totalHT: number;
  averageBasket: number;
  invoiceCount: number;
}

const Summary: React.FC<SummaryProps> = ({ totalTTC, totalHT, averageBasket, invoiceCount }) => {
  return (
    <Table striped bordered variant="dark">
      <tbody>
        <tr className="align-middle text-center">
          <td>Tickets</td>
          <td>{invoiceCount}</td>
        </tr>
        <tr className="align-middle text-center">
          <td>Panier moyen</td>
          <td>{averageBasket.toFixed(2)}€</td>
        </tr>
        <tr className="align-middle text-center">
          <td>Total HT</td>
          <td>{totalHT.toFixed(2)}€</td>
        </tr>
        <tr className="align-middle text-center fw-bold">
          <td>Total TTC</td>
          <td>{totalTTC.toFixed(2)}€</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default Summary;
