import React from "react";
import { InvoiceInterface, PaymentsInterface, ProductsInterface } from "../../../types";

interface PrintInvoiceProps {
    invoice: InvoiceInterface | null;
    products: ProductWithQuantity[];
    payments: PaymentsInterface[];
    date: string;
    time: string;
}

interface ProductWithQuantity extends ProductsInterface {
    quantity: number;
}

const PrintInvoice = React.forwardRef<HTMLDivElement, PrintInvoiceProps>(({
    invoice,
    products,
    payments,
    date,
    time
}, ref) => {
    return (
        <div ref={ref} className="m-4">
            <h1 className="text-center">Mealtin</h1>
            <ul>
                <li className="text-center">6 rue des Halles,</li>
                <li className="text-center">68100 Mulhouse</li>
                <li className="text-center">03.89.61.45.93</li>
            </ul>
            <p className="mt-2 mb-1">Facture N°{invoice?.invoiceNumber}</p>
            <p className="mb-1">Le {date} à {time}</p>
            <h4 className="text-decoration-underline">Articles</h4>
            <ul>
                {products.map((product, index) => (
                    <li className="position-relative" key={index}>{product.quantity} x {product.name}<span className="position-absolute end-0 me-2">{product.price} €</span></li>
                ))}
                <hr />
            </ul>
            <h5 className="text-decoration-underline">Paiements</h5>
            <ul>
                {payments.map((payment, index) => (
                    <li className="position-relative" key={index}>{payment.paymentMethod}<span className="position-absolute end-0 me-2">{payment.amount} €</span></li>
                ))}
                <hr />
            </ul>
            <ul>
                <li className="position-relative">Total HT <span className="position-absolute end-0 me-2">{invoice ? invoice.total - invoice.tva : 0}€</span></li>
                <li className="position-relative">Total TVA <span className="position-absolute end-0 me-2">{invoice?.tva}€</span></li>
                <li className="position-relative fw-bold">Total TTC <span className="position-absolute end-0 me-2">{invoice?.total}€</span></li>
            </ul>
        </div>
    );
});

export default PrintInvoice;
