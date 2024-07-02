import axios from 'axios';
import { ProductsInterface, TvaInterface, CategoryInterface, InvoiceInterface, PaymentsInterface, InvoiceProducts, InvoiceData } from 'types';

//dev
export const API_URL = 'https://localhost:8000/api';
const API_URL_FORGOT_PASSWORD = 'https://localhost:8000/forgot_password/';
const URL ='https://localhost:8000';
// prod
/* export const API_URL = 'https://api.addition-dphiane.fr/api';
const API_URL_FORGOT_PASSWORD = 'https://api.addition-dphiane.fr/forgot_password/';
const URL ='https://api.addition-dphiane.fr'; */

export const fetchInvoices = async () => {
  const response = await axios.get(`${API_URL}/invoices`);
  return response.data;
};
export const fetchInvoiceByID = async (id: number) => {
  const response = await axios.get(`${API_URL}/invoices/${id}`);
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, { email, password },{
    headers: {
      'Content-Type': 'application/ld+json',
    }
  }
  );
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
}
export const forgotPassword = async (token: string, password: string) => {
  const response = await axios.post(`${API_URL_FORGOT_PASSWORD}${token}`, {
    password: password,
  });
  return response;
}

export const resetPasswordRequest = async (email: string) => {
  const response = await axios.post(`${API_URL_FORGOT_PASSWORD}`, { email }, {
    headers: {
      'Content-Type': 'application/json',
    }
  })

  return response.data;
}

export const changePassword = async (email: string, currentPassword: string, newPassword: string, token: string) => {
  const response = await axios.post(`${API_URL}/change_password`, {
    email: email,
    currentPassword: currentPassword,
    newPassword: newPassword,
  }, {
    headers: {
      'Content-Type': 'application/ld+json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
}

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login_check`, {
      email: email,
      password: password
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  return localStorage.getItem('token');
};

export const fetchProducts = async (): Promise<ProductsInterface[]> => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data[ "hydra:member" ];
};

export const fetchInvoiceProducts = async (invoiceProducts: InvoiceProducts[]) => {
  const productsData = await Promise.all(
    invoiceProducts.map(async (invoiceProduct) => {
      const response = await axios.get(`${URL}${invoiceProduct.product[ "@id" ]}`);
      return { ...response.data, quantity: invoiceProduct.quantity };
    })
  );
  return productsData;
}

export const deleteProduct = async (productId: number): Promise<void> => {
  await axios.delete(`${API_URL}/products/${productId}`);
};

export const addProduct = async (newProduct: ProductsInterface): Promise<ProductsInterface> => {
  const response = await axios.post(`${API_URL}/products`, newProduct, {
    headers: { 'Content-Type': 'application/ld+json' },
  });
  return response.data;
};

export const updateProduct = async (productId: number, updatedProduct: ProductsInterface): Promise<ProductsInterface> => {
  const response = await axios.put(`${API_URL}/products/${productId}`, updatedProduct, {
    headers: { 'Content-Type': 'application/ld+json' },
  });
  return response.data;
};

export const fetchTvas = async (): Promise<TvaInterface[]> => {
  const response = await axios.get(`${API_URL}/tvas`);
  return response.data[ "hydra:member" ];
};

export const updateTva = async (updatedTva: number, tvaToEditId: number): Promise<TvaInterface> => {
  const response = await axios.put(
    `${API_URL}/tvas/${tvaToEditId}`,
    { tva: updatedTva },
    { headers: { 'Content-Type': 'application/ld+json' } }
  );
  return response.data;
}

export const deleteTva = async (tvaID: number): Promise<void> => {
  await axios.delete(`${API_URL}/tvas/${tvaID}`);
}

export const addTva = async (newTva: number): Promise<TvaInterface> => {
  const response = await axios.post(
    `${API_URL}/tvas`,
    { tva: newTva },
    { headers: { 'Content-Type': 'application/ld+json' } }
  );
  return response.data;
}

export const fetchCategories = async (): Promise<CategoryInterface[]> => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data[ "hydra:member" ];
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  await axios.delete(`${API_URL}/categories/${categoryId}`);
};

export const updateCategory = async (categoryId: number, updatedCategoryName: string): Promise<CategoryInterface> => {
  const response = await axios.put(
    `${API_URL}/categories/${categoryId}`,
    { name: updatedCategoryName },
    { headers: { 'Content-Type': 'application/ld+json' } }
  );
  return response.data;
};

export const addCategory = async (newCategoryName: string): Promise<CategoryInterface> => {
  const response = await axios.post(
    `${API_URL}/categories`,
    { name: newCategoryName },
    { headers: { 'Content-Type': 'application/ld+json' } }
  );
  return response.data;
};

export const fetchInvoicesByDate = async (startDate?: string, endDate?: string): Promise<InvoiceInterface[]> => {
  try {
    const params: Record<string, string> = {};
    if (startDate) params[ 'date[after]' ] = startDate;
    if (endDate) {
      // Append time to endDate to ensure the end of the day is included
      const endDateWithTime = `${endDate}T23:59:59`;
      params[ 'date[before]' ] = endDateWithTime;
    }
    const response = await axios.get(`${API_URL}/invoices`, { params });
    return response.data[ 'hydra:member' ] ?? [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error message: ', error.message);
    } else {
      console.error('Unexpected error: ', error);
    }
    throw error;
  }
};

export const fetchPaymentsByIri = async (paymentsIRI: string[]): Promise<PaymentsInterface[]> => {
  try {
    const paymentsData = await Promise.all(
      paymentsIRI.map(async (iri) => {
        const response = await axios.get(`${URL}${iri}`);
        return response.data;
      })
    );
    return paymentsData;
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements', error);
    return [];
  }
}

export const deleteMarkedPayments = async (paymentIds: number[]) => {
  await Promise.all(
    paymentIds.map(async (id) => {
      await axios.delete(`${API_URL}/payments/${id}`, {
        headers: {
          'Content-Type': 'application/ld+json',
        },
      });
    })
  );
}

export const addNewPayments= async (newPayments:PaymentsInterface[])=>{
 await Promise.all(
    newPayments.map(async (payment) => {
      await axios.post(`${API_URL}/payments`, payment, {
        headers: {
          'Content-Type': 'application/ld+json'
        }
      });
    })
  );
}

export const getMultipleProducts = async (productIds: number[])=>{
 const response = await axios.get(`${API_URL}/multiple`, {
    params: {
      ids: productIds.join(',')
    }
  });
  return response;
}

export const createInvoice = async (invoiceData: InvoiceData)=> {
  await axios.post(`${API_URL}/create_invoice`, invoiceData,{
    headers: {
      'Content-Type': 'application/ld+json'
    }
  });
};