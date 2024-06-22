import React from "react";
import { Table } from "react-bootstrap";

interface PaymentMethodTotal {
  method: string;
  count: number;
  total: number;
}

interface PaymentMethodTableProps {
  paymentsMethodTotal: PaymentMethodTotal[];
}

const PaymentMethodTable: React.FC<PaymentMethodTableProps> = ({ paymentsMethodTotal }) => {
  return (
    <Table striped bordered variant="dark">
      <thead>
        <tr>
          <th className="text-center">Méthodes de paiement</th>
          <th className="align-middle text-center">Nombres</th>
          <th className="align-middle text-center">Total</th>
        </tr>
      </thead>
      <tbody>
        {paymentsMethodTotal.map((payment, index) => (
          <tr key={index}>
            <td className="text-center">{payment.method}</td>
            <td className="text-center">{payment.count}</td>
            <td className="text-center">{payment.total}€</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PaymentMethodTable;
