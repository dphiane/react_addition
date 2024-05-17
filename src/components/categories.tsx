import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { Products,Tva } from './settings/products';

interface CartItemType {
  quantity: number;
  price: number;
  tva: number
}

interface CategoryProps {
  addToCart: (name: string, quantity: number, price: number, tva: number) => void;
  cart: { [ key: string ]: CartItemType };
}
interface CategoryInterface {
  id: number;
  name: string;
  products: Products[]; // Si vous recevez également des produits dans la réponse JSON
}

const Categories: React.FC<CategoryProps> = ({ addToCart, cart }) => {
  const [ categories, setCategories ] = useState<CategoryInterface[]>([]);
  const [ selectedCategory, setSelectedCategory ] = useState<string>('Apéritifs');
  const [ categoryProducts, setCategoryProducts ] = useState<Products[]>([]);
  const [ products, setProducts ] = useState<Products[]>([]);
  const [tvas, setTvas] = useState<Tva[]>([]);

  const [ currentPage, setCurrentPage ] = useState(1);
  const productsPerPage = 10;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = categoryProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(categoryProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchTva();
  }, []);

  useEffect(() => {
    const filteredProducts = products.filter(product => getCategoryNameFromIRI(product.category) === selectedCategory,);
    setCategoryProducts(filteredProducts);
  }, [ selectedCategory, products ]);

  const fetchTva = async () => {
    try {
      const response = await axios.get('https://localhost:8000/api/tvas');
      setTvas(response.data["hydra:member"]);
    } catch (error) {
      console.error('Erreur lors de la récupération des taxes:', error);
    } 
  };

  function getCategoryNameFromIRI(categoryIRI: string | undefined) {
    if (!categoryIRI) {
      return 'Catégorie inconnue';
    }
    const categoryId = categoryIRI.split('/').pop()!;
    const category = categories.find(cat => cat.id === parseInt(categoryId, 10));
    return category ? category.name : 'Catégorie inconnue';
  }

  function getTvaFromIri(tvaIRI: string | undefined) {
    if (!tvaIRI) {
      return 0;
    }
    const tvaId = tvaIRI.split('/').pop()!;
    const tva = tvas.find(tva => tva.id === parseInt(tvaId, 10));
    return tva ? tva.tva : 0;
  }

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://localhost:8000/api/products');
      setProducts(response.data[ "hydra:member" ]);
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://localhost:8000/api/categories');
      const sortedCategories = response.data[ "hydra:member" ].sort((a: CategoryInterface, b: CategoryInterface) => a.name.localeCompare(b.name));
      setCategories(sortedCategories);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  };

  const handleOpenCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const handleProductSelection = (product: Products) => {
    addToCart(product.name, 1, product.price, getTvaFromIri(product.tva));
  };

  return (
    <div className="container-fluid bg-dark d-flex">
      <nav className="navbar navbar-dark flex-column m-2">
          <ul className="navbar-nav navbar-expand-lg flex-column">
            {categories.map((category) => (
              <li key={category.id} className={`nav-item fw-bold ${selectedCategory === category.name ? 'nav-selected' : ''}`}>
                <button className="nav-link bg-dark border-0 text-white" onClick={() => handleOpenCategory(category.name)}>{category.name}</button>
              </li>
            ))}
          </ul>
      </nav>
      {selectedCategory && (
        <div className="mt-3">
          <div className="d-flex justify-content-center flex-wrap">
            {currentProducts.map((product, index) => (
              <Button key={index} className='m-2 btn-select-product' variant="primary" onClick={() => handleProductSelection(product)}>{product.name}</Button>
            ))}
          </div>

          {totalPages > 1 && (
            <div className='d-flex justify-content-center m-2'>
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Categories;

