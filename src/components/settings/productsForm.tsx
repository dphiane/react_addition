import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

interface Products {
    id: number
    name: string;
    price: number;
    tva: number;
    category: string;
  }

interface ProductsFormProps {
  productsToUpdate: Products | null;
  onSubmit: (updatedProductsName: string) => void;
  onAddProducts: (newProductsName: string) => void; 
}

const ProductsForm: React.FC<ProductsFormProps> = ({ productsToUpdate, onSubmit, onAddProducts }) => {
  const [ProductsName, setProductsName] = useState<string>('');
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

  useEffect(() => {
    if (productsToUpdate) {
      setProductsName(productsToUpdate.name);
      setShowFormModal(true);
    }
  }, [productsToUpdate]);

  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setProductsName('');
  }

  const handleShowFormModal = () => setShowFormModal(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(ProductsName)
    if (ProductsName.trim() !== '') {
      if (productsToUpdate) {
        // Si un article est mise à jour, appeler la fonction onSubmit
        onSubmit(ProductsName);
        handleCloseFormModal();
        setShowConfirmationModal(true);
      } else {
        // Sinon, ajouter une nouvell article en appelant la fonction onAddProducts
        onAddProducts(ProductsName);
        handleCloseFormModal();
        setShowConfirmationModal(true);
      }
    }
  };

  return (
    <div className='d-flex justify-content-end'>
      <Button className='m-2' onClick={handleShowFormModal}>
        Ajouter un article
      </Button>

      <Modal show={showFormModal} onHide={handleCloseFormModal}>
        <Modal.Header closeButton closeVariant="white" className='bg-dark'>
          <Modal.Title>{productsToUpdate ? 'Modifier un article' : 'Ajouter un article'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark'>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="ProductsName">
              <Form.Control
                type="text"
                placeholder="Ajouter un article"
                value={ProductsName}
                onChange={(e) => setProductsName(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button className='m-2' variant="primary" type="submit">
                {productsToUpdate ? 'Modifier' : 'Ajouter'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
        <Modal.Header closeButton  closeVariant="white" className='bg-dark'>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark'>
          L'article {ProductsName} a été {productsToUpdate ? 'modifiée' : 'ajoutée'} avec succès.
        </Modal.Body>
        <Modal.Footer className='bg-dark'>
          <Button variant="secondary" onClick={handleCloseConfirmationModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductsForm;
