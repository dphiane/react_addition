import React, { useEffect, useState } from "react";
import { Form, Button, Modal } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from "axios";
import { Invoice, InvoiceProducts } from "./invoice";
import { Products } from "./products";

interface InvoiceProps {
  editInvoice: Invoice | null;
  resetForm: () => void;
  refreshInvoices:()=> void;
}

interface Payments {
  id?: number;
  invoice: string;//iri
  amount: number;
  paymentMethod: string;
}

const InvoiceForm: React.FC<InvoiceProps> = ({ editInvoice, resetForm, refreshInvoices }) => {
  const [ showFormModal, setShowFormModal ] = useState<boolean>(false);
  const [ showConfirmationModal, setShowConfirmationModal ] = useState<boolean>(false);
  const [ formErrors, setFormErrors ] = useState<string[]>([]);
  const [ products, setProducts ] = useState<(Products & { quantity: number })[]>([]);
  const [ loading, setLoading ] = useState(false);
  const [ payments, setPayments ] = useState<Payments[]>([]);
  const [ deletedPayments, setDeletedPayments ] = useState<number[]>([]);
  const [ newPayments, setNewPayments ] = useState<Payments[]>([]);
  const [ newPaymentMethod, setNewPaymentMethod ] = useState<string>('Espèce');
  const [ newPaymentAmount, setNewPaymentAmount ] = useState<string>('');
  const [ date, setDate ] = useState<string>('');
  const [ time, setTime ] = useState<string>('');
  const [ remainder, setRemainder ] = useState<number>(0);
  const [ dirty, setDirty ] = useState<boolean>(false);

  useEffect(() => {
    if (editInvoice) {
      console.log(editInvoice)
      const invoiceProducts = editInvoice.invoiceProducts;
      setShowFormModal(true);
      setDirty(false);
      fetchPayments(editInvoice.payment);
      fetchProducts(invoiceProducts);
      const invoiceDate = new Date(editInvoice.date);

      const day = invoiceDate.getUTCDate().toString().padStart(2, '0');
      const month = (invoiceDate.getUTCMonth() + 1).toString().padStart(2, '0');
      const year = invoiceDate.getUTCFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      const hours = invoiceDate.getUTCHours().toString().padStart(2, '0');
      const minutes = invoiceDate.getUTCMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}h${minutes}`;
      setDate(formattedDate);
      setTime(formattedTime);
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
    setShowFormModal(false);
    setRemainder(0);
    setNewPayments([]);
    setFormErrors([]);
    setDeletedPayments([]);
    resetForm()
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (dirty === false) {
      setShowFormModal(false);
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
        handleCloseFormModal();
        refreshInvoices();
        setShowConfirmationModal(true);
      } catch (error) {
        console.error('Erreur lors de la mise à jour des paiements', error);
        setFormErrors(prevErrors => [ ...prevErrors, "Une erreur s'est produite lors de la mise à jour des paiements" ]);
      } finally {
        setLoading(false);
        resetForm();
      }
    } else {
      setFormErrors(prevErrors => [ ...prevErrors, "Le montant restant à payer doit être égal à 0 avant de soumettre." ]);
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
      // Gérez le cas où paymentToDelete est undefined
      setFormErrors(previousError=>[...previousError,'Paiement à supprimer non trouvé'])
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
        invoice: `https://localhost:8000/api/invoices/${editInvoice.id}`
      };
  
      setNewPayments([...newPayments, newPayment]);
      setNewPaymentMethod('Espèce');
      setNewPaymentAmount('0');
      setRemainder(remainder - parseFloat(newPaymentAmount));
      setDirty(true); // Marquer le formulaire comme modifié
    } else {
      setFormErrors(previousError => [...previousError, 'Vous ne pouvez pas dépasser le montant total']);
    }
  };
  

  const cancelNewPaymentMethod = (index: number) => {
    setRemainder(remainder + newPayments[ index ].amount);
    setNewPayments(newPayments.filter((_, i) => i !== index));
  }

  return (
    <>
      <Modal show={showFormModal} onHide={handleCloseFormModal}>
        <Modal.Header closeButton closeVariant="white" className='bg-dark'>
          <Modal.Title>Facture N°{editInvoice?.invoiceNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark rounded-bottom'>
          <Form onSubmit={handleSubmit}>
            <h3 className="text-center">Total: {editInvoice?.total}€</h3>
            <p className="text-center">Le {date} à {time}</p>

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

            <div className="d-flex justify-content-end">
              <Button className='mt-3' variant="primary" type="submit" disabled={loading}>
                Modifier
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showConfirmationModal}>
        <Modal.Header closeButton closeVariant="white" className='bg-dark'>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark'>
          La facture modifiée avec succès.
        </Modal.Body>
        <Modal.Footer className='bg-dark'>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InvoiceForm;
