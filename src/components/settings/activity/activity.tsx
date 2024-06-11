import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import { Table, Toast } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatDateForResearch, formatDate } from "../../utils";
import { fetchInvoicesByDate, fetchPaymentsByIri } from "../../api";
import { InvoiceInterface, PaymentsInterface } from "components/types";
import Loader from "../../loader";

const Activity = () => {
  const [errors, setErrors] = useState<string>("")
  const [invoices, setInvoices] = useState<InvoiceInterface[]>([]);
  const [totalTTC, setTotalTTC] = useState<number>(0);
  const [totalHT, setTotalHT] = useState<number>(0);
  const [averageBasket, setAverageBasket] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('today');
  const [searchStart, setSearchStart] = useState<Date>(new Date());
  const [searchEnd, setSearchEnd] = useState<Date | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, [searchStart, searchEnd]);

  useEffect(() => {
    getRealDate();
  }, [selectedDate]);

  useEffect(() => {
    if (invoices.length > 0) {
      calculateTotals();
    } else {
      setTotalTTC(0);
      setTotalHT(0);
      setAverageBasket(0);
    }
  }, [invoices]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = searchEnd !== null
        ? await fetchInvoicesByDate(formatDateForResearch(searchStart), formatDateForResearch(searchEnd))
        : await fetchInvoicesByDate(formatDateForResearch(searchStart));
      setInvoices(response.reverse());
    } catch (error) {
      console.error('Erreur lors de la récupération des factures', error);
      setErrors('Une erreur s\'est produite lors du chargement des factures');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    let total = 0;
    let HT = 0;

    invoices.forEach(invoice => {
      total += invoice.total;
      HT += invoice.tva;
    });

    setTotalTTC(total);
    setTotalHT(total - HT);
    setAverageBasket(total / invoices.length);
  };

  const handleChangeDate = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(event.target.value);
  };

  const getRealDate = () => {
    switch (selectedDate) {
      case 'today':
        const today = new Date();
        setSearchStart(today);
        setSearchEnd(null);
        break;
      case 'yesterday':
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        setSearchStart(yesterday);
        setSearchEnd(null);
        break;
      case 'week':
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);
        setSearchStart(start);
        setSearchEnd(end);
        break;
      case 'month':
        const endMonth = new Date();
        const startMonth = new Date();
        startMonth.setDate(1); // Début du mois courant
        setSearchStart(startMonth);
        setSearchEnd(endMonth);
        break;
      default:
        console.warn('Période sélectionnée invalide');
        break;
    }
  };

  return (
    <>
      <Loader loading={loading}></Loader>
      {errors && (
        <p className="text-danger text-center mb-1">{errors}</p>
      )}
      <div className="d-flex justify-content-center align-items-center ">
        <Form.Select className="w-auto m-2" value={selectedDate} onChange={handleChangeDate}>
          <option value='today'>Aujourd'hui</option>
          <option value="yesterday">Hier</option>
          <option value="week">Les 7 derniers jours</option>
          <option value="month">Ce mois-ci</option>
        </Form.Select>
      </div>

      <Table striped bordered hover variant="dark">

        <thead>
          <tr>
            <th className="text-center">Numéro de facture</th>
            <th className="text-center">Date</th>
            <th className="text-center">Montant</th>
            <th className="text-center">TVA</th>
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
              <td className="text-center">{invoice.total}€</td>
              <td className="text-center">{invoice.tva}€</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="text-end">
              Tickets
            </td>
            <td className="text-center">{invoices.length}</td>
          </tr>
          <tr>
            <td colSpan={3} className="text-end">Panier moyen</td>
            <td className="text-center">{averageBasket.toFixed(2)}€</td>
          </tr>
          <tr>
            <td colSpan={3} className="text-end">Total HT</td>
            <td className="text-center">{totalHT.toFixed(2)}€</td>
          </tr>
          <tr>
            <td colSpan={3} className="text-end">Total TTC
            </td>
            <td className="text-center">{totalTTC.toFixed(2)}€</td>
          </tr>
        </tfoot>
      </Table>

      <Link to={"/"}><button className="btn btn-secondary position-absolute start-0 ms-2">Retour</button></Link>
    </>
  )
}

export default Activity;
