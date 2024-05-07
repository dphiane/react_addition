import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

interface Category {
  id: number;
  name: string;
}

interface CategoryFormProps {
  categoryToUpdate: Category | null;
  onSubmit: (updatedCategoryName: string) => void;
  onAddCategory: (newCategoryName: string) => void; // Ajouter la fonction de mise à jour des catégories comme prop
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryToUpdate, onSubmit, onAddCategory }) => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

  useEffect(() => {
    if (categoryToUpdate) {
      setCategoryName(categoryToUpdate.name);
      setShowFormModal(true);
    }
  }, [categoryToUpdate]);

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setCategoryName('');
  };

  const handleCloseConfirmationModal = () => setShowConfirmationModal(false);

  const handleShowFormModal = () => setShowFormModal(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (categoryName.trim() !== '') {
      if (categoryToUpdate) {
        // Si une catégorie est mise à jour, appeler la fonction onSubmit
        onSubmit(categoryName);
        handleCloseFormModal();
      } else {
        // Sinon, ajouter une nouvelle catégorie en appelant la fonction onAddCategory
        onAddCategory(categoryName);
        handleCloseFormModal();
      }
    }
  };

  return (
    <div className='d-flex justify-content-end'>
      <Button className='m-2' onClick={handleShowFormModal}>
        Ajouter une catégorie
      </Button>

      <Modal show={showFormModal} onHide={handleCloseFormModal}>
        <Modal.Header closeButton closeVariant="white" className='bg-dark'>
          <Modal.Title>{categoryToUpdate ? 'Modifier une catégorie' : 'Ajouter une catégorie'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark'>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="categoryName">
              <Form.Control
                type="text"
                placeholder="Ajouter une catégorie"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button className='m-2' variant="primary" type="submit">
                {categoryToUpdate ? 'Modifier' : 'Ajouter'}
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
          La catégorie {categoryName} a été {categoryToUpdate ? 'modifiée' : 'ajoutée'} avec succès.
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

export default CategoryForm;
