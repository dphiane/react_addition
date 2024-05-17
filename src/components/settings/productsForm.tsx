import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, FormControl } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Products, Tva, CategoryInterface } from './products';

interface ProductsFormProps {
  productsToUpdate: Products | null;
  editProduct: (updatedProduct: Products) => void;
  onAddProducts: (newProduct: Products) => Promise<void>;
  tvas: Tva[];
  categories: CategoryInterface[];
  resetProductToUpdate: () => void;
}

const ProductsForm: React.FC<ProductsFormProps> = ({ productsToUpdate, editProduct, onAddProducts, tvas, categories, resetProductToUpdate }) => {

  const [ productName, setProductsName ] = useState<string>('');
  const [ selectedTva, setSelectedTva ] = useState<string | undefined>("1");
  const [ selectedCategory, setSelectedCategory ] = useState<string | undefined>('1');
  const [ price, setPrice ] = useState<string>('');
  const [ showFormModal, setShowFormModal ] = useState<boolean>(false);
  const [ showConfirmationModal, setShowConfirmationModal ] = useState<boolean>(false);
  const [ formErrors, setFormErrors ] = useState<string[]>([]);

  useEffect(() => {
    if (productsToUpdate) {
      let tva = productsToUpdate.tva.split('/').pop()!;
      let category = productsToUpdate.category.split('/').pop()!;
      setProductsName(productsToUpdate.name);
      setPrice(productsToUpdate.price.toString());
      setSelectedCategory(category);
      setSelectedTva(tva);
      setShowFormModal(true);
    }
  }, [ productsToUpdate ]);

  function resetAll() {
    setProductsName("");
    setPrice("");
    setSelectedCategory("1");
    setSelectedTva("1");
  }

  const validateForm = () => {
    const errors: string[] = [];

    if (productName.trim() === '') {
      errors.push('Le nom de l\'article est requis');
    }
    if (!selectedTva || selectedTva.trim() === '') {
      errors.push('Veuillez sélectionner une TVA');
    }
    if (!selectedCategory || selectedCategory.trim() === '') {
      errors.push('Veuillez sélectionner une catégorie');
    }
    if (price.trim() === '') {
      errors.push('Le prix est requis');
    } else if (isNaN(parseFloat(price))) {
      errors.push('Le prix doit être un nombre valide');
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    resetProductToUpdate();
    resetAll();
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  }

  const handleShowFormModal = () => setShowFormModal(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      const newProduct: Products = {
        id: productsToUpdate?.id,
        name: productName,
        tva: '/api/tvas/' + selectedTva,
        category: '/api/categories/' + selectedCategory,
        price: parseFloat(price),
      };
      if (productsToUpdate) {
        editProduct(newProduct);
      } else {
        onAddProducts(newProduct);
      }
      handleCloseFormModal();
      setShowConfirmationModal(true);
    } else {
      console.log("Formulaire incomplet"); // Ajout d'une indication si le formulaire est incomplet
    }
  };


  return (
    <div className='position-absolute bottom-0 end-0 m-2'>
      <Button onClick={handleShowFormModal}>
        Ajouter un article
      </Button>

      <Modal show={showFormModal} onHide={handleCloseFormModal}>
        <Modal.Header closeButton closeVariant="white" className='bg-dark'>
          <Modal.Title>{productsToUpdate ? 'Modifier un article' : 'Ajouter un article'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark'>
          <Form onSubmit={handleSubmit}>
            {formErrors.length > 0 && (
              <div className="alert alert-danger">
                <ul>
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <Form.Group controlId="productName">
              <FloatingLabel
                controlId="floatingInput"
                label="Nom de votre article"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  value={productName}
                  onChange={(e) => setProductsName(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <FloatingLabel controlId='floatingTva' label="Choisir une TVA">
              <Form.Select
                aria-label="selection tva"
                className='mb-3'
                value={selectedTva}
                onChange={(e) => setSelectedTva((e.target.value))}
              >
                {tvas.map((tva, index) => (
                  <option key={index} value={tva.id}>{tva.tva}%</option>
                ))}
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel controlId='floatingCategory' label="Choisir une catégorie">
              <Form.Select
                aria-label="selection catégorie"
                className='mb-3'
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category.id}>{category.name}</option>
                ))}
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel controlId='floatingPrice' label="Prix TTC">
              <FormControl
                type='text'
                step="0.01"
                aria-label='ajouter un prix TTC'
                className='mb-3'
                min={0}
                value={price}
                onChange={(e) => { setPrice((e.target.value)) }}>
              </FormControl>
            </FloatingLabel>
            <div className="d-flex justify-content-end">
              <Button className='m-2' variant="primary" type="submit">
                {productsToUpdate ? 'Modifier' : 'Ajouter'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
        <Modal.Header closeButton closeVariant="white" className='bg-dark'>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark'>
          L'article {productName} a été {productsToUpdate ? 'modifiée' : 'ajoutée'} avec succès.
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
