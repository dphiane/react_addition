import React, { useEffect, useReducer, useState } from "react";
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";
import { formatDateForResearch, toUTC } from "utils/formatDate";
import { fetchInvoicesByDate, fetchPaymentsByIri } from "api";
import { PaymentMethodTotal, State, Action } from "types";
import Loader from "../../loader";
import DatePicker from "react-datepicker";
import { Button } from 'react-bootstrap';
import InvoiceTable from "./invoiceTable";
import PaymentMethodTable from "./PaymentMethodTable";
import Summary from "./summary";

const initialState: State = {
  invoices: [],
  totalTTC: 0,
  totalHT: 0,
  averageBasket: 0,
  paymentsMethodTotal: [],
  loading: false,
  errors: ''
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_INVOICES_REQUEST':
      return { ...state, loading: true, errors: '' };
    case 'FETCH_INVOICES_SUCCESS':
      return { ...state, invoices: action.payload, loading: false };
    case 'FETCH_INVOICES_FAILURE':
      return { ...state, errors: action.payload, loading: false };
    case 'CALCULATE_TOTALS':
      const total = action.payload.reduce((acc, invoice) => acc + invoice.total, 0);
      const HT = action.payload.reduce((acc, invoice) => acc + invoice.tva, 0);
      const averageBasket = total / action.payload.length;
      return { ...state, totalTTC: total, totalHT: total - HT, averageBasket };
    case 'SET_PAYMENTS_TOTALS':
      return { ...state, paymentsMethodTotal: action.payload };
    default:
      return state;
  }
}

const Activity: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedDate, setSelectedDate] = useState<string>('today');
  const [searchStart, setSearchStart] = useState<Date>(new Date());
  const [searchEnd, setSearchEnd] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  useEffect(() => {
    fetchInvoices();
  }, [searchStart, searchEnd]);

  useEffect(() => {
    getRealDate();
  }, [selectedDate]);

  useEffect(() => {
    fetchPayments();

    if (state.invoices.length > 0) {
      dispatch({ type: 'CALCULATE_TOTALS', payload: state.invoices });
    }
  }, [state.invoices]);

  const fetchInvoices = async () => {
    dispatch({ type: 'FETCH_INVOICES_REQUEST' });
    try {
      const startDateParam = formatDateForResearch(toUTC(searchStart));
      const endDateParam = searchEnd ? formatDateForResearch(toUTC(searchEnd)) : '';
      const invoicesData = await fetchInvoicesByDate(startDateParam, endDateParam);
      dispatch({ type: 'FETCH_INVOICES_SUCCESS', payload: invoicesData.reverse() });
    } catch (error) {
      dispatch({ type: 'FETCH_INVOICES_FAILURE', payload: 'Une erreur s\'est produite lors du chargement des factures' });
    }
  };

  const fetchPayments = async () => {
    if (state.invoices !== null) {
      const paymentIRIs = state.invoices.flatMap(invoice => invoice.payment);
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

      const paymentTotalsArray: PaymentMethodTotal[] = Object.keys(paymentTotalsMap).map(method => ({
        method,
        count: paymentTotalsMap[method].count,
        total: paymentTotalsMap[method].total
      }));

      dispatch({ type: 'SET_PAYMENTS_TOTALS', payload: paymentTotalsArray });
    }
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

  const handleSearchStart = (value: Date) => {
    dispatch({ type: 'FETCH_INVOICES_FAILURE', payload: '' });
    if (searchEnd !== null) {
      if (value > searchEnd) {
        dispatch({ type: 'FETCH_INVOICES_FAILURE', payload: "Votre date de début ne peut pas être supérieure à celle de fin" });
        return;
      }
    }
    setSearchStart(value);
  };

  const handleSearchEnd = (value: Date) => {
    dispatch({ type: 'FETCH_INVOICES_FAILURE', payload: '' });
    if (searchStart !== null) {
      if (value < searchStart) {
        dispatch({ type: 'FETCH_INVOICES_FAILURE', payload: "Votre date de fin ne peut pas être inférieure à celle du début" });
        return;
      }
    }
    setSearchEnd(value);
  };

  return (
    <>
      <Loader loading={state.loading}></Loader>
      {state.errors && (
        <p className="text-danger text-center mb-1">{state.errors}</p>
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
        <InvoiceTable invoices={state.invoices} />
        <PaymentMethodTable paymentsMethodTotal={state.paymentsMethodTotal} />
        <Summary
          totalTTC={state.totalTTC}
          totalHT={state.totalHT}
          averageBasket={state.averageBasket}
          invoiceCount={state.invoices.length}
        />
      </div>
      <Link to={"/"}><button className="btn btn-secondary position-absolute start-0 ms-2">Retour</button></Link>
    </>
  );
}

export default Activity;
