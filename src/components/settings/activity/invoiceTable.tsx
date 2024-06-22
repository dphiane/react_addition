import React from "react";
import { Table } from "react-bootstrap";
import { InvoiceInterface } from "../../../types";
import { formatDate } from "utils/formatDate";

interface InvoiceTableProps {
  invoices: InvoiceInterface[];
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices }) => {
  return (
    <Table striped bordered variant="dark">
      <thead>
        <tr>
          <th className="text-center">Numéro de facture</th>
          <th className="text-center">Date</th>
          <th className="text-center">TVA</th>
          <th className="text-center">Montant</th>
        </tr>
      </thead>
      <tbody>
        {invoices.length <= 0 && (
          <tr>
            <td colSpan={4} className="text-danger text-center m-2">Vous n'avez pas d'encaissement à ce jour</td>
          </tr>
        )}

        {invoices.map(invoice => (
          <tr key={invoice.id}>
            <td className="text-center">{invoice.invoiceNumber}</td>
            <td className="text-center">{formatDate(new Date(invoice.date))}</td>
            <td className="text-center">{invoice.tva}€</td>
            <td className="text-center">{invoice.total}€</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default InvoiceTable;
