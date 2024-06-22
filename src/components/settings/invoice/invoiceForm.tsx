import React, { useEffect, useState, useRef } from "react";
import { Form, Button, Modal } from 'react-bootstrap';
import axios from "axios";
import { InvoiceInterface, InvoiceProducts, ProductsInterface, PaymentsInterface } from "types";
import Loader from "../../loader";
import { formatDate, formatTime } from "utils/formatDate";
import ReactToPrint from 'react-to-print';
import PrintInvoice from "./printInvoice";
import FormErrors from "../../formErrors";
import PaymentForm from "./paymentForm";
import ProductList from "./ProductList";
import TotalDetails from "./totalDetails";
import Deleted from "./modals/deleted";
import ConfirmDelete from "./modals/confirmDelete";
import Modified from "./modals/modified";
import { fetchPaymentsByIri,fetchInvoiceProducts, API_URL,deleteMarkedPayments, addNewPayments } from "api";

interface InvoiceProps {
  editInvoice: InvoiceInterface | null;
  resetForm: () => void;
  refreshInvoices: () => void;
}

const InvoiceForm: React.FC<InvoiceProps> = ({ editInvoice, resetForm, refreshInvoices }) => {
  const [modals, setModals] = useState({
    addedOrModified: false,
    form: false,
    deleted: false,
    confirmDelete: false,
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [products, setProducts] = useState<(ProductsInterface & { quantity: number })[]>([]);
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<PaymentsInterface[]>([]);
  const [deletedPayments, setDeletedPayments] = useState<number[]>([]);
  const [newPayments, setNewPayments] = useState<PaymentsInterface[]>([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState<string>('Espèce');
  const [newPaymentAmount, setNewPaymentAmount] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [remainder, setRemainder] = useState<number>(0);
  const [dirty, setDirty] = useState<boolean>(false);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editInvoice) {
      const invoiceProducts = editInvoice.invoiceProducts;
      setModals({ ...modals, form: true });
      setDirty(false);
      getPayments(editInvoice.payment);
      getInvoiceProducts(invoiceProducts);
      const invoiceDate = new Date(editInvoice.date);
      setDate(formatDate(invoiceDate));
      setTime(formatTime(invoiceDate));
    }
  }, [editInvoice]);

  useEffect(() => {
    setNewPaymentAmount(remainder.toString());
  }, [remainder]);

  const getPayments = async (paymentsIRIs: string[]) => {
    setLoading(true);
    try {
      const paymentsData = await fetchPaymentsByIri(paymentsIRIs)
      setPayments(paymentsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements', error);
      setFormErrors(prevErrors => [...prevErrors, "Une erreur s'est produite lors du chargement des paiements"]);
    } finally {
      setLoading(false);
    }
  };

  const getInvoiceProducts = async (invoiceProducts: InvoiceProducts[]) => {
    setLoading(true);
    try {
      const productsData = await fetchInvoiceProducts(invoiceProducts)
      setProducts(productsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des articles', error);
      setFormErrors(prevErrors => [...prevErrors, "Une erreur s'est produite lors du chargement des articles"]);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseFormModal = () => {
    setModals({ ...modals, form: false });
    setRemainder(0);
    setNewPayments([]);
    setFormErrors([]);
    setDeletedPayments([]);
    resetForm();
  };

  const closeConfirmModal = () => {
    handleCloseFormModal();
    setModals({ ...modals, addedOrModified: false, deleted: false });
    refreshInvoices();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (dirty === false) {
      setModals({ ...modals, form: false });
      return;
    }
    if (remainder === 0) {
      try {
        // Supprimer les paiements marqués pour suppression
        if (deletedPayments.length > 0) {
          await deleteMarkedPayments(deletedPayments)
          }
        // Ajouter les nouveaux paiements
        if (newPayments.length > 0) {
          await addNewPayments(newPayments)
        }
        setModals({ ...modals, form: false, addedOrModified: true });
      } catch (error) {
        console.error('Erreur lors de la mise à jour des paiements', error);
        setFormErrors(prevErrors => [...prevErrors, "Une erreur s'est produite lors de la mise à jour des paiements"]);
      } finally {
        setLoading(false);
      }
    } else {
      setFormErrors(prevErrors => [...prevErrors, "Le montant restant à payer doit être égal à 0 avant de soumettre."]);
      setLoading(false);
    }
  };

  const deletePaymentMethod = (index: number) => {
    const paymentToDelete = payments[index];
    if (paymentToDelete.id) {
      setDeletedPayments([...deletedPayments, paymentToDelete.id]);
      setPayments(payments.filter((_, i) => i !== index));
      setRemainder(remainder + paymentToDelete.amount);
      setDirty(true);
    } else {
      setFormErrors(previousError => [...previousError, 'Paiement à supprimer non trouvé']);
    }
  };

  const addPaymentMethod = () => {
    setFormErrors([]);
    if (parseFloat(newPaymentAmount) <= remainder) {
      if (!editInvoice) {
        setFormErrors(previousError => [...previousError, 'Erreur: aucune facture à éditer']);
        return;
      }

      const newPayment = {
        amount: parseFloat(newPaymentAmount),
        paymentMethod: newPaymentMethod,
        invoice: `${API_URL}/invoices/${editInvoice.id}`
      };

      setNewPayments([...newPayments, newPayment]);
      setNewPaymentMethod('Espèce');
      setNewPaymentAmount('0');
      setRemainder(remainder - parseFloat(newPaymentAmount));
      setDirty(true);
    } else {
      setFormErrors(previousError => [...previousError, 'Vous ne pouvez pas dépasser le montant total']);
    }
  };

  const cancelNewPaymentMethod = (index: number) => {
    setRemainder(remainder + newPayments[index].amount);
    setNewPayments(newPayments.filter((_, i) => i !== index));
  };

  const handleDeleteInvoice = async (invoiceId: number) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/invoices/${invoiceId}`);
      setModals({ ...modals, deleted: true, form: false });
    } catch {
      setFormErrors(previousError => [...previousError, 'Erreur lors de la suppression de la facture']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ConfirmDelete show={modals.confirmDelete} onHide={() => handleCloseFormModal()} editInvoice={editInvoice!} handleDeleteInvoice={() => handleDeleteInvoice(editInvoice?.id!)} setShowDeleteModal={() => setModals({ ...modals, confirmDelete: false })} />
      <Modified show={modals.addedOrModified} onHide={() => closeConfirmModal()} invoice={editInvoice?.invoiceNumber!} />
      <Deleted show={modals.deleted} onHide={() => closeConfirmModal()} invoice={editInvoice?.invoiceNumber}></Deleted>

      <Modal show={modals.form} onHide={handleCloseFormModal}>
        <Modal.Header closeButton closeVariant="white" className='bg-dark'>
          <Modal.Title>Facture N°{editInvoice?.invoiceNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark rounded-bottom'>
          <Loader loading={loading} />

          <div style={{ display: 'none' }}>
            <PrintInvoice
              ref={componentRef}
              invoice={editInvoice}
              products={products}
              payments={payments}
              date={date}
              time={time}
            />
          </div>

          <Form onSubmit={handleSubmit}>
            <h3 className="text-center">Total: {editInvoice?.total}€</h3>
            <p className="text-center">Le {date} à {time}</p>
            <p className="text-center">
              <ReactToPrint
                trigger={() => <Button variant="secondary"><i className="fa-solid fa-print"></i> Imprimer</Button>}
                content={() => componentRef.current}
              />
            </p>

            <FormErrors errors={formErrors} />

            <ProductList products={products} />

            <h5 className="text-decoration-underline">Paiements</h5>
            <ul>
              {payments.map((payment, index) => (
                <li className="position-relative" key={index}>{payment.paymentMethod}<span className="position-absolute end-0 me-2">{payment.amount} € <i className="fa-solid fa-trash text-danger m-1" onClick={() => { deletePaymentMethod(index) }}></i></span></li>
              ))}
              <hr />
            </ul>

            <PaymentForm 
              remainder={remainder} 
              newPaymentAmount={newPaymentAmount} 
              setNewPaymentAmount={setNewPaymentAmount} 
              newPaymentMethod={newPaymentMethod} 
              setNewPaymentMethod={setNewPaymentMethod} 
              addPaymentMethod={addPaymentMethod} 
            />

            {newPayments.length > 0 && (
              <>
                <h5>Nouveau payment</h5>
                <ul>
                  {newPayments.map((payment, index) => (
                    <li className="position-relative" key={index}>{payment.paymentMethod}<span className="position-absolute end-0 me-2">{payment.amount} € <i onClick={() => { cancelNewPaymentMethod(index) }} className="fa-solid fa-trash text-danger m-1"></i></span></li>
                  ))}
                </ul>
                <hr />
              </>
            )}

            <TotalDetails invoice={editInvoice} />

            <div className="d-flex justify-content-between">
              <Button className='mt-3' variant="danger" onClick={() => setModals({ ...modals, confirmDelete: true })}>
                Supprimer
              </Button>
              <Button className='mt-3' variant="primary" type="submit">
                Modifier
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default InvoiceForm;
