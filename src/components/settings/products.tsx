import React, { useState, useEffect } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ProductsForm from "./productsForm";

interface Products {
  id: number
  name: string;
  price: number;
  tva: number;
  category: string;
}

function Products() {
  const [Products, setProducts] = useState<Products[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [ProductsToDelete, setProductsToDelete] = useState<Products | null>(null);
  const [ProductsToEdit, setProductsToEdit] = useState<Products | null>(null);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Products.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://localhost:8000/api/Products');
      const sortedCategories = response.data["hydra:member"].sort((a: Products, b: Products) => a.name.localeCompare(b.name));
      setProducts(sortedCategories);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  };

  const handleDeleteProducts = async (ProductsId: number) => {
    try {
      await axios.delete(`https://localhost:8000/api/Products/${ProductsId}`);
      setProducts(Products.filter(Products => Products.id !== ProductsId));
      setShowModal(false);
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
    }
  };

  const handleEditProducts = (ProductsId: number) => {
    const ProductsToEdit = Products.find(Products => Products.id === ProductsId);
    if (ProductsToEdit) {
      setProductsToEdit(ProductsToEdit);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProductsToDelete(null);
  };

  const handleUpdateProducts = async (updatedProductsName: string) => {
    if (ProductsToEdit) {
      try {
        const response = await axios.put(
          `https://localhost:8000/api/Products/${ProductsToEdit.id}`,
          { name: updatedProductsName },
          { headers: { 'Content-Type': 'application/ld+json' } }
        );
        const updatedProducts = response.data;
        setProducts(Products.map(Products =>
          Products.id === updatedProducts.id ? updatedProducts : Products
        ));
        console.log(`Catégorie mise à jour avec succès:`, updatedProducts);
        handleCloseModal(); // Ferme la modal après la modification réussie
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la catégorie:', error);
      }
    }
  };

  const handleAddProducts = async (newProductsName: string) => {
    try {
      const response = await axios.post(
        'https://localhost:8000/api/Products',
        { name: newProductsName },
        { headers: { 'Content-Type': 'application/ld+json' } }
      );
      setProducts([...Products, response.data]); // Ajoute la nouvelle catégorie à la liste actuelle
      handleCloseModal(); // Ferme la modal après l'ajout réussi
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
    }
  };
  
  return (
    <div className="bg-dark">
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Noms</th>
            <th>Catégories</th>
            <th>TVA</th>
            <th>Prix</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((Products, index) => (
            <tr key={index}>
              <td className="d-flex justify-content-between">{Products.name}
                <span>
                  <i className="fa-solid fa-pen-to-square m-2 text-warning"
                     onClick={() => handleEditProducts(Products.id)}></i>
                  <i className="fa-solid fa-trash m-2 text-danger"
                     onClick={() => { setProductsToDelete(Products); setShowModal(true);}}></i>
                </span>
              </td>
              <td>{Products.category}</td>
              <td>{Products.tva}</td>
              <td>{Products.price}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ProductsForm onAddProducts={handleAddProducts} productsToUpdate={ProductsToEdit} onSubmit={handleUpdateProducts} />

      <nav>
        <div className="d-flex justify-content-center">
          {Products.length > 10 && (
            <ul className="pagination">
              {Array.from({ length: Math.ceil(Products.length / itemsPerPage) }, (_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button onClick={() => paginate(index + 1)} className="page-link">
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="bg-dark" closeVariant="white">
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          Êtes-vous sûr de vouloir supprimer la catégorie {ProductsToDelete?.name} ?
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={() => handleDeleteProducts(ProductsToDelete?.id!)}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Products;