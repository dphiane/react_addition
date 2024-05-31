import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import InvoiceForm from "./invoiceForm";

export interface Invoice {
    id: number,
    date: string,
    tva: number,
    total: number,
    payment: string[];
    invoiceProducts: InvoiceProducts[];
    invoiceNumber: string;
}

export interface InvoiceProducts {
    "@id": string;
    id: number;
    invoice: string;
    product: {
        "@id": string;
        id: number;
        name: string;
        price: number;
        tva: string;
    };
    quantity: number;
}

// @ts-ignore
registerLocale("fr", fr);

const Invoices = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState<Date | null>(null);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const resetForm = () => {
        setInvoiceToEdit(null);
    };

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://localhost:8000/api/invoices');
            setInvoices(response.data['hydra:member'].reverse());
        } catch (error) {
            console.error('Erreur lors de la récupération des factures', error);
            setErrors('Une erreur s\'est produite lors du chargement des factures');
            setTimeout(() => setErrors(null), 5000);  // Clear error after 5 seconds
        } finally {
            setLoading(false);
        }
    };

    const handleEditInvoice = (invoiceId: number) => {
        const invoiceToEdit = invoices.find(invoice => invoice.id === invoiceId);
        if (invoiceToEdit) {
            setInvoiceToEdit(invoiceToEdit);
        }
    };

    const filteredInvoices = invoices.filter(invoice => {
        if (searchTerm) {
            const invoiceDate = new Date(invoice.date);
            return invoiceDate.toDateString() === searchTerm.toDateString();
        }
        return true;
    });

    const refreshInvoices = () => {
        fetchInvoices();
    };

    const itemsPerPage = 15;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <>
            {errors && (
                <div className="alert alert-danger" role="alert">
                    {errors}
                </div>
            )}

            {loading ? (
                <div className="d-flex justify-content-center my-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement</span>
                    </div>
                </div>
            ) : (
                <div className="bg-dark pb-5 position-relative">
                    <div className="d-flex justify-content-center mb-2">
                        <DatePicker
                            selected={searchTerm}
                            onChange={(date: Date) => setSearchTerm(date)}
                            dateFormat="dd/MM/yyyy"
                            className="form-control text-center mt-3"
                            placeholderText="Chercher une date"
                            locale="fr"
                        />
                    </div>
                    {searchTerm && (
                        <div className="d-flex justify-content-center mb-3">
                            <button className="btn btn-secondary" onClick={() => setSearchTerm(null)}>
                                Voir toutes les factures
                            </button>
                        </div>
                    )}
                    <Table hover variant="dark">
                        <thead>
                            <tr>
                                <th className="text-center">Numéro de facture</th>
                                <th className="text-center">Date</th>
                                <th className="text-center">Heure</th>
                                <th className="text-center">Total</th>
                                <th className="text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(invoice => {
                                const invoiceDate = new Date(invoice.date);

                                const day = invoiceDate.getUTCDate().toString().padStart(2, '0');
                                const month = (invoiceDate.getUTCMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à partir de 0, donc nous ajoutons 1
                                const year = invoiceDate.getUTCFullYear();
                                const formattedDate = `${day}/${month}/${year}`;

                                const hours = invoiceDate.getUTCHours().toString().padStart(2, '0');
                                const minutes = invoiceDate.getUTCMinutes().toString().padStart(2, '0');
                                const formattedTime = `${hours}h${minutes}`;

                                return (
                                    <tr key={invoice.id}>
                                        <td className="align-middle text-center">{invoice.invoiceNumber}</td>
                                        <td className="align-middle text-center">{formattedDate}</td>
                                        <td className="align-middle text-center">{formattedTime}</td>
                                        <td className="align-middle text-center">{invoice.total} €</td>
                                        <td className="text-center align-middle">
                                            <i className="fa-solid fa-pen-to-square text-warning"
                                                onClick={() => handleEditInvoice(invoice.id)}></i>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                    <InvoiceForm editInvoice={invoiceToEdit} resetForm={resetForm} refreshInvoices={refreshInvoices} />
                    {filteredInvoices.length > itemsPerPage && (
                        <ul className="pagination">
                            {Array.from({ length: Math.ceil(filteredInvoices.length / itemsPerPage) }, (_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <button onClick={() => paginate(index + 1)} className="page-link">
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </>
    );
};

export default Invoices;
