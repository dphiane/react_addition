export interface ProductsInterface {
    id?: number;
    name: string;
    price: number;
    tva: string; // iri "tva": "/api/tvas/1"
    category: string; // iri "category": "/api/categories/1"
  }
  
  export interface TvaInterface {
    id: number;
    tva: number;
  }
  
  export interface CategoryInterface {
    id: number;
    name: string;
  }

  export interface InvoiceInterface {
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
export interface PaymentsInterface {
  id?: number;
  invoice: string;//iri
  amount: number;
  paymentMethod: string;
}

export interface CartItem {
  quantity: number;
  price: number;
  tva: number;
  id: number;
}
export interface CartProps {
  cart: { [key: string]: { quantity: number; price: number; tva: number; id: number } };
  updateQuantity: (product: string, quantity: number, price: number) => void;
  initialQuantity: number;
  onTableSelect: (selectedTable: number | null) => void;
}

export interface Category {
  id: number;
  name: string;
}