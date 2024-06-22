import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ProductsForm from "./productsForm";
import { Link } from "react-router-dom";
import Deleted from "./modals/deleted";
import ConfirmDelete from "./modals/confirmDelete";
import AddedOrModified from "./modals/addedOrModified";
import { fetchTvas, fetchCategories, fetchProducts, deleteProduct, addProduct, updateProduct } from '../../../api';
import { ProductsInterface, TvaInterface, CategoryInterface } from '../../../types';
import { getCategoryNameFromIRI, getTvaFromIri } from '../../../utils/getFromIri';

function Products() {
  const [tvas, setTvas] = useState<TvaInterface[]>([]);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [products, setProducts] = useState<ProductsInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modals, setModals] = useState({
    addedOrModified: false,
    form: false,
    deleted: false,
    confirmDelete: false,
  });
  const [productToDelete, setProductToDelete] = useState<ProductsInterface | null>(null);
  const [productToEdit, setProductToEdit] = useState<ProductsInterface | null>(null);
  const [update, setUpdate] = useState<boolean>(false);
  const [articleName, setArticleName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const itemsPerPage = 15;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tvas, categories, products] = await Promise.all([fetchTvas(), fetchCategories(), fetchProducts()]);
        setTvas(tvas);
        setCategories(categories);
        setProducts(products.reverse());
      } catch (error) {
        setErrors('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteProducts = async (productId: number) => {
    setLoading(true);
    try {
      await deleteProduct(productId);
      setProducts(products.filter(product => product.id !== productId));
      setModals({ ...modals, deleted: true, confirmDelete:false });
    } catch (error) {
      setErrors('Erreur lors de la suppression du produit');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProducts = (productId: number) => {
    const productToEdit = products.find(product => product.id === productId);
    if (productToEdit) {
      setProductToEdit(productToEdit);
      setModals({ ...modals, form: true });
    }
  };

  const handleCloseModal = () => {
    setModals({ addedOrModified: false, form: false, deleted: false, confirmDelete: false });
    setProductToDelete(null);
    setProductToEdit(null);
  };

  const handleUpdateProducts = async (updatedProduct: ProductsInterface) => {
    setLoading(true);
    setUpdate(true);
    try {
      const updatedProductData = await updateProduct(productToEdit!.id!, updatedProduct);
      setProducts(products.map(product =>
        product.id === updatedProductData.id ? updatedProductData : product
      ));
      setArticleName(productToEdit!.name);
      setModals({ ...modals, addedOrModified: true,form:false });
      setProductToEdit(null);
    } catch (error) {
      setErrors('Erreur lors de la mise à jour du produit');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProducts = async (newProduct: ProductsInterface) => {
    setLoading(true);
    setUpdate(false);
    try {
      const addedProduct = await addProduct(newProduct);
      setProducts([addedProduct, ...products]);
      setArticleName(newProduct.name);
      setModals({ ...modals, addedOrModified: true, form: false });
    } catch (error) {
      setErrors('Erreur lors de l\'ajout du produit');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-dark pb-2">
      {errors && (
        <div className="alert alert-danger" role="alert">
          {errors}
        </div>
      )}
      <div className="d-flex justify-content-center">
        <input
          type="text"
          placeholder="Rechercher un article"
          value={searchTerm}
          onChange={handleSearchChange}
          className="form-control m-2 w-50 text-center"
        />
      </div>
      {loading ? (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement</span>
          </div>
        </div>
      ) : (
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Noms</th>
              <th className="text-center">Catégories</th>
              <th className="text-center">TVA</th>
              <th className="text-center">Prix</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product) => (
              <tr key={product.id}>
                <td className="align-middle">{product.name}</td>
                <td className="align-middle text-center">{getCategoryNameFromIRI(product.category, categories)}</td>
                <td className="text-center align-middle">{getTvaFromIri(product.tva, tvas)}%</td>
                <td className="text-center align-middle">{product.price}€</td>
                <td className="text-center align-middle">
                  <i className="fa-solid fa-pen-to-square m-1 text-warning"
                    onClick={() => handleEditProducts(product.id!)}></i>
                  <i className="fa-solid fa-trash text-danger m-1"
                    onClick={() => { setProductToDelete(product); setModals({ ...modals, confirmDelete: true }) }}></i>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ProductsForm
        onAddProducts={handleAddProducts}
        productsToUpdate={productToEdit}
        editProduct={handleUpdateProducts}
        tvas={tvas}
        categories={categories}
        resetProductToUpdate={handleCloseModal}
        showFormModal={modals.form}
        setShowFormModal={(show) => setModals({ ...modals, form: show })}
      />
      <ConfirmDelete
        show={modals.confirmDelete}
        onHide={handleCloseModal}
        productToDelete={productToDelete}
        handleDeleteProducts={handleDeleteProducts}
      />
      <Deleted
        handleShow={modals.deleted}
        handleClose={() => setModals({ ...modals, deleted: false })}
        articleName={productToDelete?.name}
      />
      <AddedOrModified
        show={modals.addedOrModified}
        onHide={handleCloseModal}
        articleName={articleName}
        updated={update}
      />

      <div className="container-pagination">
        <Link to={"/"}><button className="btn btn-secondary ms-2">Retour</button></Link>
        {filteredProducts.length > itemsPerPage && (
          <ul className="pagination">
            {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }, (product, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button onClick={() => paginate(index + 1)} className="page-link">
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        )}
        <Button className="me-2" onClick={() => setModals({ ...modals, form: true })}>Ajouter un article</Button>
      </div>
    </div>
  );
}

export default Products;
