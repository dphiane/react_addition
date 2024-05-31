import React, { useState, useEffect } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ProductsForm from "./productsForm";
import { Link } from "react-router-dom";

export interface Products {
  id?: number;
  name: string;
  price: number;
  tva: string; // iri "tva": "/api/tvas/1"
  category: string; // iri "category": "/api/categories/1"
}

export interface Tva {
  id: number;
  tva: number;
}

export interface CategoryInterface {
  id: number;
  name: string;
}

function Products() {
  const [ tvas, setTvas ] = useState<Tva[]>([]);
  const [ categories, setCategories ] = useState<CategoryInterface[]>([]);
  const [ products, setProducts ] = useState<Products[]>([]);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ showModal, setShowModal ] = useState(false);
  const [ showFormModal, setShowFormModal ] = useState<boolean>(false);
  const [ productToDelete, setProductsToDelete ] = useState<Products | null>(null);
  const [ productToEdit, setProductsToEdit ] = useState<Products | null>(null);
  const [ searchTerm, setSearchTerm ] = useState<string>('');
  const [ errors, setErrors ] = useState<string | null>(null);
  const [ loading, setLoading ] = useState<boolean>(false);

  const itemsPerPage = 15;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchTva();
  }, []);

  const fetchTva = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://localhost:8000/api/tvas');
      setTvas(response.data[ "hydra:member" ]);
    } catch (error) {
      console.error('Erreur lors de la récupération des taxes:', error);
      setErrors('Une erreur s\'est produite lors du chargement des taxes');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://localhost:8000/api/categories');
      setCategories(response.data[ "hydra:member" ]);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      setErrors('Erreur lors de la récupération des catégories');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://localhost:8000/api/products');
      const products: Products[] = response.data[ "hydra:member" ].reverse(); // Reverse the array to display in descending order
      setProducts(products);
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      setErrors('Erreur lors de la récupération des articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProducts = async (productId: number) => {
    setLoading(true);
    try {
      await axios.delete(`https://localhost:8000/api/products/${productId}`);
      setProducts(products.filter(products => products.id !== productId));
      setShowModal(false);
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      setErrors('Erreur lors de la suppression de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  const resetProductToUpdate = () => {
    setProductsToEdit(null);
  };

  const handleEditProducts = (productId: number) => {
    const productToEdit = products.find(products => products.id === productId);
    if (productToEdit) {
      setProductsToEdit(productToEdit);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProductsToDelete(null);
  };

  const handleUpdateProducts = async (updatedProduct: Products) => {
    if (productToEdit) {
      setLoading(true);
      try {
        const response = await axios.get(`https://localhost:8000/api/products/${productToEdit.id}`);
        if (!response.data) {
          console.error("Le produit à mettre à jour n'existe pas.");
          return;
        }

        const responseUpdate = await axios.put(
          `https://localhost:8000/api/products/${productToEdit.id}`,
          updatedProduct,
          { headers: { 'Content-Type': 'application/ld+json' } }
        );

        const updatedProductData = responseUpdate.data;
        setProducts(products.map(product =>
          product.id === updatedProductData.id ? updatedProductData : product
        ));
        console.log(`L'article mis à jour avec succès:`, updatedProductData);
        setProductsToEdit(null);
        handleCloseModal();
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'article:", error);
        setErrors('Erreur lors de la mise à jour de l\'article');
      } finally {
        setLoading(false);
      }
    }
  };


  const handleAddProducts = async (newProduct: Products) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://localhost:8000/api/products',
        newProduct,
        { headers: { 'Content-Type': 'application/ld+json' } } // Utilisez application/json au lieu de application/ld+json si le serveur l'attend
      );
      const addedProduct = response.data;
      setProducts([ addedProduct, ...products ]); // Ajouter le produit retourné par le serveur
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'article:", error);
      setErrors("Erreur lors de l'ajout de l'article:");
    } finally {
      setLoading(false);
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
      return 'TVA inconnue';
    }
    const tvaId = tvaIRI.split('/').pop()!;
    const tva = tvas.find(tva => tva.id === parseInt(tvaId, 10));
    return tva ? tva.tva : 'Tva inconnue';
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset current page when search term changes
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
            {currentItems.map((products) => (
              <tr key={products.id}>
                <td className="align-middle">{products.name}</td>
                <td className="align-middle text-center">{getCategoryNameFromIRI(products.category)}</td>
                <td className="text-center align-middle">{getTvaFromIri(products.tva)}%</td>
                <td className="text-center align-middle">{products.price}€</td>
                <td className="text-center align-middle">
                  <i className="fa-solid fa-pen-to-square m-1 text-warning"
                    onClick={() => handleEditProducts(products.id!)}></i>
                  <i className="fa-solid fa-trash text-danger m-1 "
                    onClick={() => { setProductsToDelete(products); setShowModal(true); }}></i>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <nav>

        <ProductsForm
          onAddProducts={handleAddProducts}
          productsToUpdate={productToEdit}
          editProduct={handleUpdateProducts}
          tvas={tvas} categories={categories}
          resetProductToUpdate={resetProductToUpdate}
          showFormModal={showFormModal}
          setShowFormModal={setShowFormModal}
        />
        <div className="d-flex justify-content-between ms-2 me-2">
          <Link to={"/"}><button className="btn btn-secondary">Retour</button></Link>
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
          <Button onClick={()=>setShowFormModal(true)}>Ajouter un article</Button>
        </div>
      </nav>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="bg-dark" closeVariant="white">
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          Êtes-vous sûr de vouloir supprimer la catégorie {productToDelete?.name} ?
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={() => handleDeleteProducts(productToDelete?.id!)}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Products;
