import React from 'react';
import { InvoiceInterface } from 'types';

interface TotalDetailsProps {
  invoice: InvoiceInterface | null;
}

const TotalDetails: React.FC<TotalDetailsProps> = ({ invoice }) => {
  return (
    <ul>
      <li className="position-relative">Total HT <span className="position-absolute end-0 me-2">{invoice ? invoice.total - invoice.tva : 0}€</span></li>
      <li className="position-relative">Total TVA <span className="position-absolute end-0 me-2">{invoice?.tva}€</span></li>
      <li className="position-relative fw-bold">Total TTC <span className="position-absolute end-0 me-2">{invoice?.total}€</span></li>
    </ul>
  );
};

export default TotalDetails;
