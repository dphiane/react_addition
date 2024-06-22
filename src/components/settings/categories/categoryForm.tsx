import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

interface Category {
  id: number;
  name: string;
}

interface CategoryFormProps {
  categoryToUpdate: Category | null;
  onUpdateCategory: (updatedCategoryName: string) => void;
  onAddCategory: (newCategoryName: string) => void;
  setShowFormModal: (value: boolean) => void;
  showFormModal: boolean;
  resetCategoryToEdit: () => void;
  formErrors: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryToUpdate, onUpdateCategory, onAddCategory, showFormModal, setShowFormModal, resetCategoryToEdit, formErrors }) => {
  const [ categoryName, setCategoryName ] = useState<string>('');
  const [ isSubmitted,setIsSubmitted]= useState<boolean>(false);

  useEffect(() => {
    if (categoryToUpdate) {
      setCategoryName(categoryToUpdate.name);
      setShowFormModal(true);
    }
  }, [ categoryToUpdate ]);

  useEffect(()=>{
    if(isSubmitted && formErrors.length === 0 ){
      setCategoryName('');
      setIsSubmitted(false);
    } 
  },[isSubmitted,formErrors])

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    resetCategoryToEdit();
    setCategoryName('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (categoryName.trim() !== '') {
      if (categoryToUpdate) {
        onUpdateCategory(categoryName);
      } else {
        onAddCategory(categoryName);
      }
    }
  };

  return (
    <>
      <Modal show={showFormModal} onHide={handleCloseFormModal}>
        <Modal.Header closeButton closeVariant="white" className='bg-dark'>
          <Modal.Title>{categoryToUpdate ? 'Modifier une catégorie' : 'Ajouter une catégorie'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark rounded-bottom'>
          <Form onSubmit={handleSubmit}>
            {formErrors && (
              <p className="alert alert-danger" role="alert">
                {formErrors}
              </p>
            )}
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
    </>
  );
};

export default CategoryForm;
