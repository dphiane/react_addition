import React, { useEffect, useState, useRef } from "react";
import { Form, Button, Modal } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from "axios";
import {InvoiceInterface, InvoiceProducts , ProductsInterface, PaymentsInterface } from "types";
import Modified from "./modals/modified";
import ConfirmDelete from "./modals/confirmDelete";
import Deleted from "./modals/deleted";
import Loader from "../../loader";
import { formatDate, formatTime } from "utils/formatDate";
import ReactToPrint from 'react-to-print';
import PrintInvoice from "./printInvoice";

interface InvoiceProps {
  editInvoice: InvoiceInterface | null;
  resetForm: () => void;
  refreshInvoices: () => void;
}

const InvoiceForm: React.FC<InvoiceProps> = ({ editInvoice, resetForm, refreshInvoices }) => {
  const [ modals, setModals ] = useState({
    addedOrModified: false,
    form: false,
    deleted: false,
    confirmDelete: false,
  });
  const [ formErrors, setFormErrors ] = useState<string[]>([]);
  const [ products, setProducts ] = useState<(ProductsInterface & { quantity: number })[]>([]);
  const [ loading, setLoading ] = useState(false);
  const [ payments, setPayments ] = useState<PaymentsInterface[]>([]);
  const [ deletedPayments, setDeletedPayments ] = useState<number[]>([]);
  const [ newPayments, setNewPayments ] = useState<PaymentsInterface[]>([]);
  const [ newPaymentMethod, setNewPaymentMethod ] = useState<string>('Espèce');
  const [ newPaymentAmount, setNewPaymentAmount ] = useState<string>('');
  const [ date, setDate ] = useState<string>('');
  const [ time, setTime ] = useState<string>('');
  const [ remainder, setRemainder ] = useState<number>(0);
  const [ dirty, setDirty ] = useState<boolean>(false);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editInvoice) {
      const invoiceProducts = editInvoice.invoiceProducts;
      setModals({ ...modals, form: true })
      setDirty(false);
      fetchPayments(editInvoice.payment);
      fetchProducts(invoiceProducts);
      const invoiceDate = new Date(editInvoice.date);
      setDate(formatDate(invoiceDate));
      setTime(formatTime(invoiceDate));
    }
  }, [ editInvoice ]);

  useEffect(() => {
    setNewPaymentAmount(remainder.toString())
  }, [ remainder ]);

  const fetchPayments = async (paymentsIRIs: string[]) => {
    setLoading(true);
    try {
      const paymentsData = await Promise.all(
        paymentsIRIs.map(async (iri) => {
          const response = await axios.get(`https://localhost:8000${iri}`);
          return response.data;
        })
      );
      setPayments(paymentsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements', error);
      setFormErrors(prevErrors => [ ...prevErrors, "Une erreur s'est produite lors du chargement des paiements" ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (invoiceProducts: InvoiceProducts[]) => {
    setLoading(true);
    try {
      const productsData = await Promise.all(
        invoiceProducts.map(async (invoiceProduct) => {
          const response = await axios.get(`https://localhost:8000${invoiceProduct.product[ "@id" ]}`);
          return { ...response.data, quantity: invoiceProduct.quantity };
        })
      );
      setProducts(productsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des articles', error);
      setFormErrors(prevErrors => [ ...prevErrors, "Une erreur s'est produite lors du chargement des articles" ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseFormModal = () => {
    setModals({ ...modals, form: false })
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
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (dirty === false) {
      setModals({ ...modals, form: false })
      return;
    }
    if (remainder === 0) {
      try {
        // Supprimer les paiements marqués pour suppression
        if (deletedPayments.length > 0) {
          await Promise.all(
            deletedPayments.map(async (id) => {
              await axios.delete(`https://localhost:8000/api/payments/${id}`,
                {
                  headers: {
                    'Content-Type': 'application/ld+json'
                  }
                });
            })
          );
        }

        // Ajouter les nouveaux paiements
        if (newPayments.length > 0) {
          await Promise.all(
            newPayments.map(async (payment) => {
              await axios.post('https://localhost:8000/api/payments',
                payment,
                {
                  headers: {
                    'Content-Type': 'application/ld+json'
                  }
                });
            })
          );
        }
        setModals({ ...modals, form: false, addedOrModified: true })
      } catch (error) {
        console.error('Erreur lors de la mise à jour des paiements', error);
        setFormErrors(prevErrors => [ ...prevErrors, "Une erreur s'est produite lors de la mise à jour des paiements" ]);
      } finally {
        setLoading(false);
      }
    } else {
      setFormErrors(prevErrors => [ ...prevErrors, "Le montant restant à payer doit être égal à 0 avant de soumettre." ]);
      setLoading(false);
    }
  };

  const deletePaymentMethod = (index: number) => {
    const paymentToDelete = payments[ index ];
    if (paymentToDelete.id) {
      setDeletedPayments([ ...deletedPayments, paymentToDelete.id ]);
      setPayments(payments.filter((_, i) => i !== index));
      setRemainder(remainder + paymentToDelete.amount);
      setDirty(true);
    } else {
      // Gérez le cas où paymentToDelete est undefined
      setFormErrors(previousError => [ ...previousError, 'Paiement à supprimer non trouvé' ])
    }
  };

  const addPaymentMethod = () => {
    setFormErrors([]);
    if (parseFloat(newPaymentAmount) <= remainder) {
      if (!editInvoice) {
        setFormErrors(previousError => [ ...previousError, 'Erreur: aucune facture à éditer' ]);
        return;
      }

      const newPayment = {
        amount: parseFloat(newPaymentAmount),
        paymentMethod: newPaymentMethod,
        invoice: `https://localhost:8000/api/invoices/${editInvoice.id}`
      };

      setNewPayments([ ...newPayments, newPayment ]);
      setNewPaymentMethod('Espèce');
      setNewPaymentAmount('0');
      setRemainder(remainder - parseFloat(newPaymentAmount));
      setDirty(true);
    } else {
      setFormErrors(previousError => [ ...previousError, 'Vous ne pouvez pas dépasser le montant total' ]);
    }
  };

  const cancelNewPaymentMethod = (index: number) => {
    setRemainder(remainder + newPayments[ index ].amount);
    setNewPayments(newPayments.filter((_, i) => i !== index));
  }

  const handleDeleteInvoice = async (invoiceId: number) => {
    setLoading(true);
    try {
      await axios.delete(`https://localhost:8000/api/invoices/${invoiceId}`);
      setModals({ ...modals, deleted: true, form: false })
    } catch {
      setFormErrors(previousError => [ ...previousError, 'Erreur lors de la suppression de la facture' ])
    } finally {
      setLoading(false);
    }
  }

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

          <Loader loading={loading}></Loader>
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

            {formErrors.length > 0 && (
              <div className="alert alert-danger">
                <ul>
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {products.length > 0 && (
              <>
                <h4 className="text-decoration-underline">Articles</h4>
                <ul>
                  {products.map((product, index) => (
                    <li className="position-relative" key={index}>{product.quantity} x {product.name}<span className="position-absolute end-0 me-2">{product.price} €</span></li>
                  ))}
                  <hr />
                </ul>
              </>
            )}

            {payments.length > 0 && (
              <>
                <h5 className="text-decoration-underline">Paiements</h5>
                <ul>
                  {payments.map((payment, index) => (
                    <li className="position-relative" key={index}>{payment.paymentMethod}<span className="position-absolute end-0 me-2">{payment.amount} € <i className="fa-solid fa-trash text-danger m-1" onClick={() => { deletePaymentMethod(index) }}></i></span></li>
                  ))}
                  <hr />
                </ul>
              </>
            )}

            {remainder > 0 && (
              <>
                <p className="position-relative fw-bold">Reste à payer <span className="position-absolute end-0 me-2">{remainder}€</span></p>
                <InputGroup className="mb-3">
                  <Form.Control type="text" placeholder="Montant payé" value={newPaymentAmount} onChange={(e) => setNewPaymentAmount(e.target.value)} />
                  <Form.Select aria-label="Sélectionner un moyen de paiement" value={newPaymentMethod} onChange={(e) => setNewPaymentMethod(e.target.value)} >
                    <option value="Espèce">Espèce</option>
                    <option value="Carte bancaire">Carte Bancaire</option>
                    <option value="Ticket restaurant">Ticket Restaurant</option>
                    <option value="Chèque">Chèque</option>
                  </Form.Select>
                  <Button variant="primary" id="button-addon1" onClick={addPaymentMethod}>
                    Ajouter
                  </Button>
                </InputGroup>
                <hr />
              </>
            )}

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

            <ul>
              <li className="position-relative">Total HT <span className="position-absolute end-0 me-2">{editInvoice ? editInvoice?.total - editInvoice?.tva : 0}€</span></li>
              <li className="position-relative">Total TVA <span className="position-absolute end-0 me-2">{editInvoice?.tva}€</span></li>
              <li className="position-relative fw-bold">Total TTC <span className="position-absolute end-0 me-2">{editInvoice?.total}€</span></li>
            </ul>

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
