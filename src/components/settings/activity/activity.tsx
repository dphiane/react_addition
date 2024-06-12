import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import { Table, Toast } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatDateForResearch, formatDate, toUTC } from "../../utils";
import { fetchInvoicesByDate, fetchPaymentsByIri } from "../../api";
import { InvoiceInterface, PaymentsInterface } from "components/types";
import Loader from "../../loader";
import DatePicker from "react-datepicker";
import { Button } from 'react-bootstrap';

const Activity = () => {
  const [errors, setErrors] = useState<string>("");
  const [invoices, setInvoices] = useState<InvoiceInterface[]>([]);
  const [totalTTC, setTotalTTC] = useState<number>(0);
  const [totalHT, setTotalHT] = useState<number>(0);
  const [averageBasket, setAverageBasket] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('today');
  const [searchStart, setSearchStart] = useState<Date>(new Date());
  const [searchEnd, setSearchEnd] = useState<Date | null>(null);
  const [paymentsMethodTotal, setPaymentsMethodTotal] = useState<{ method: string, count: number, total: number }[] | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  useEffect(() => {
    fetchInvoices();
  }, [searchStart, searchEnd]);

  useEffect(() => {
    getRealDate();
  }, [selectedDate]);

  useEffect(() => {
    fetchPayments();

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
    setErrors('');
    try {
      const startDateParam = formatDateForResearch(toUTC(searchStart));
      const endDateParam = searchEnd ? formatDateForResearch(toUTC(searchEnd)) : '';
      const invoicesData = await fetchInvoicesByDate(startDateParam, endDateParam);
      setInvoices(invoicesData.reverse());
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
        setShowDatePicker(false);
        break;
      case 'yesterday':
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        setSearchStart(yesterday);
        setSearchEnd(new Date());
        setShowDatePicker(false);
        break;
      case 'week':
        const start = new Date();
        start.setDate(start.getDate() - 7);
        const end = new Date();
        end.setDate(end.getDate() + 1)
        setSearchStart(start);
        setSearchEnd(end);
        setShowDatePicker(true);
        break;
      case 'month':
        const endMonth = new Date();
        const startMonth = new Date();
        startMonth.setDate(1); // Début du mois courant
        setSearchStart(startMonth);
        setSearchEnd(endMonth);
        setShowDatePicker(false);
        break;
      case 'custom':
        setShowDatePicker(true);
        break;
      default:
        console.warn('Période sélectionnée invalide');
        setShowDatePicker(false);
        break;
    }
  };

  const fetchPayments = async () => {
    if (invoices !== null) {
      const paymentIRIs = invoices.flatMap(invoice => invoice.payment);
      const payments = await fetchPaymentsByIri(paymentIRIs);
      const filteredPayments = payments.map(payment => ({
        amount: payment.amount,
        paymentMethod: payment.paymentMethod
      }));

      const paymentTotalsMap: { [key: string]: { total: number, count: number } } = {};
      filteredPayments.forEach(payment => {
        if (paymentTotalsMap[payment.paymentMethod]) {
          paymentTotalsMap[payment.paymentMethod].total += payment.amount;
          paymentTotalsMap[payment.paymentMethod].count += 1;
        } else {
          paymentTotalsMap[payment.paymentMethod] = { total: payment.amount, count: 1 };
        }
      });

      const paymentTotalsArray = Object.keys(paymentTotalsMap).map(method => ({
        method,
        count: paymentTotalsMap[method].count,
        total: paymentTotalsMap[method].total
      }));

      setPaymentsMethodTotal(paymentTotalsArray);
      console.log("Payment Totals:", paymentTotalsArray);
    }
  };

  const handleSearchStart = (value: Date) => {
    setErrors('');
    if (searchEnd !== null) {
      if (value > searchEnd) {
        setErrors("Votre date de début ne peut pas être supérieure à celle de fin");
        return;
      }
    }
    setSearchStart(value);
  };

  const handleSearchEnd = (value: Date) => {
    setErrors('');
    if (searchStart !== null) {
      if (value < searchStart) {
        setErrors("Votre date de fin ne peut pas être inférieure à celle du début");
        return;
      }
    }
    setSearchEnd(value);
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
          <option value="custom">Date personnalisée</option>
        </Form.Select>
      </div>

      {showDatePicker && (
        <div className="d-flex justify-content-center align-items-center flex-sm-row flex-column gap-2 m-2">
          <DatePicker
            selected={searchStart}
            onChange={(date: Date) => handleSearchStart(date)}
            dateFormat="dd/MM/yyyy"
            className="text-center rounded border-0 p-1"
            placeholderText="Date de début"
            locale="fr"
            name="début"
          />
          <div className="d-flex align-items-center m-2">
            <i className="activity-icon-arrow-right fa-solid fa-arrow-right text-light fa-xl"></i>
            <i className="activity-icon-arrow-down fa-solid fa-arrow-down text-light fa-xl"></i>
          </div>
          <DatePicker
            selected={searchEnd}
            onChange={(date: Date) => handleSearchEnd(date)}
            dateFormat="dd/MM/yyyy"
            className="text-center rounded border-0 p-1"
            placeholderText="Date de fin"
            locale="fr"
          />
          <Button className="p-1" onClick={() => fetchInvoices()}><i className="fa-solid fa-magnifying-glass ps-1 pe-1"></i></Button>
        </div>
      )}

      <div className="d-flex justify-content-center flex-column gap-3">
        <div>
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
        </div>
        <div>
          <Table striped bordered variant="dark">
            <thead>
              <tr>
                <th className="text-center">Méthodes de paiement</th>
                <th className="align-middle text-center">Nombres</th>
                <th className="align-middle text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {paymentsMethodTotal?.map((payment, index) => (
                <tr key={index}>
                  <td className="text-center">{payment.method}</td>
                  <td className="text-center">{payment.count}</td>
                  <td className="text-center">{payment.total}€</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div>

          <Table striped bordered variant="dark">
            <tbody>
              <tr className="align-middle text-center">
                <td>Tickets</td>
                <td>{invoices.length}</td>
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
        </div>
      </div>
      <Link to={"/"}><button className="btn btn-secondary position-absolute start-0 ms-2">Retour</button></Link>
    </>
  );
}

export default Activity;
