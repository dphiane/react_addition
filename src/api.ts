import axios from 'axios';
import { Category,ProductsInterface, TvaInterface, CategoryInterface, InvoiceInterface, PaymentsInterface } from 'types';

const API_URL = 'https://localhost:8000/api';
const API_URL_FORGOT_PASSWORD= 'https://localhost:8000/forgot_password/';

export const fetchInvoices = async () => {
      const response = await axios.get(`${API_URL}/invoices`);
      return response.data;
};
export const fetchInvoiceByID = async (id:number) => {
  const response = await axios.get(`${API_URL}/invoices/${id}`);
  return response.data;
};
export const register = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
}
export const forgotPassword = async (token: string , password:string)=>{
  const response = await axios.post(`${API_URL_FORGOT_PASSWORD}${token}`, {
    password:password,
});
return response;
}

export const resetPasswordRequest = async (email: string) => {
    const response = await axios.post(`${API_URL_FORGOT_PASSWORD}`, { email },{
      headers: {
        'Content-Type': 'application/json',
      }})

    return response.data;
}

export const changePassword = async (email: string, currentPassword: string, newPassword: string, token: string) => {
    const response = await axios.post(`${API_URL}/change_password`, {
      email: email,
      currentPassword: currentPassword,
      newPassword: newPassword,
    }, {
      headers: {
        'Content-Type': 'application/json',
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

export const fetchCategories = async (): Promise<CategoryInterface[]> => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data[ "hydra:member" ];
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  await axios.delete(`${API_URL}/categories/${categoryId}`);
};

export const updateCategory = async (categoryId: number, updatedCategoryName: string): Promise<Category> => {
  const response = await axios.put(
    `${API_URL}/categories/${categoryId}`,
    { name: updatedCategoryName },
    { headers: { 'Content-Type': 'application/ld+json' } }
  );
  return response.data;
};

export const addCategory = async (newCategoryName: string): Promise<Category> => {
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
        const response = await axios.get(`https://localhost:8000${iri}`);
        return response.data;
      })
    );
    return paymentsData;
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements', error);
    return [];
  }
}