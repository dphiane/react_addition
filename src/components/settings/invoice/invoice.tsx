import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fr from "date-fns/locale/fr";
import { fetchInvoices } from "api";
import InvoiceForm from "./invoiceForm";
import { InvoiceInterface } from "types";
import Loader from "../../loader";
import { formatDate, formatTime } from "utils/formatDate";
import Pagination from "components/pagination";

// @ts-ignore
registerLocale("fr", fr);

const Invoices = () => {
    const [ invoices, setInvoices ] = useState<InvoiceInterface[]>([]);
    const [ invoiceToEdit, setInvoiceToEdit ] = useState<InvoiceInterface | null>(null);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ errors, setErrors ] = useState<string | null>(null);
    const [ searchTerm, setSearchTerm ] = useState<Date | null>(null);
    const itemsPerPage = 20;
    const [ currentPage, setCurrentPage ] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    useEffect(() => {
        getInvoices();
    }, []);

    const resetForm = () => {
        setInvoiceToEdit(null);
    };

    const getInvoices = async () => {
        setLoading(true);
        try {
            const response = await fetchInvoices();
            setInvoices(response[ 'hydra:member' ].reverse());
        } catch (error) {
            console.error('Erreur lors de la récupération des factures', error);
            setErrors('Une erreur s\'est produite lors du chargement des factures');
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

    const refreshInvoices = () => {
        getInvoices();
    };

    const filteredInvoices = invoices.filter(invoice => {
        if (searchTerm) {
            const invoiceDate = new Date(invoice.date);
            return invoiceDate.toDateString() === searchTerm.toDateString();
        }
        return true;
    });

    const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <>
            {errors && (
                <div className="alert alert-danger" role="alert">
                    {errors}
                </div>
            )}
            <Loader loading={loading} />

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
                            const formattedDate = formatDate(invoiceDate)
                            const formattedTime = formatTime(invoiceDate);

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

                <div className="d-flex justify-content-center position-relative">
                    <Link to={"/"}><button className="btn btn-secondary position-absolute start-0 ms-2">Retour</button></Link>

                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={invoices.length}
                        currentPage={currentPage}
                        paginate={paginate}
                    />
                </div>
            </div>

        </>
    );
};

export default Invoices;
