import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, FormLabel, FormControl } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import {Products, Tva, Category} from './products';


interface ProductsFormProps {
  productsToUpdate: Products | null;
  onSubmit: (updatedProductsName: string) => void;
  onAddProducts: (newProduct: Products) => Promise<void>;
  tvas : Tva[];
  categories: Category[];
}

const ProductsForm: React.FC<ProductsFormProps> = ({ productsToUpdate, onSubmit, onAddProducts, tvas, categories }) => {

  const [ productName, setProductsName ] = useState<string>('');
  const [ selectedTva, setSelectedTva ] = useState<string | undefined>();
  const [ selectedCategory, setSelectedCategory ] = useState<string | undefined>();
  const [ price, setPrice ] = useState<number | undefined>();
  const [ showFormModal, setShowFormModal ] = useState<boolean>(false);
  const [ showConfirmationModal, setShowConfirmationModal ] = useState<boolean>(false);

  useEffect(() => {
    if (productsToUpdate) {
      let tva = productsToUpdate.tva.split('/').pop()!;
      let category = productsToUpdate.category.split('/').pop()!;
      setProductsName(productsToUpdate.name);
      setPrice(productsToUpdate.price);
      setSelectedCategory(category);
      setSelectedTva(tva);
      setShowFormModal(true);
    }else{
      setProductsName("");
      setPrice(undefined);
      setSelectedCategory(undefined);
      setSelectedTva(undefined);
    }
  }, [ productsToUpdate ]);

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
    
    if (productName.trim() !== '' && selectedTva !== undefined && selectedCategory !== undefined) {
      const newProduct: Products = {
        name: productName,
        tva: '/api/tvas/'+ selectedTva,
        category: '/api/categories/'+ selectedCategory,
        price: price!, // Assurez-vous de récupérer la valeur du prix depuis le formulaire
      };
      if (productsToUpdate) {
        onSubmit(newProduct.name);
      } else {
        onAddProducts(newProduct);
      }
      handleCloseFormModal();
      setShowConfirmationModal(true);
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
              onChange={(e) => setSelectedTva((e.target.value)) }
              >
                <option value=""></option>
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
                <option value=""></option>
                {categories.map((category, index) => (
                  <option key={index} value={category.id}>{category.name}</option>
                ))}
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel controlId='floatingPrice' label="Prix TTC">
              <FormControl 
                type='number' 
                aria-label='ajouter un prix TTC' 
                className='mb-3' 
                min={0}
                value={price}
                onChange={(e)=>setPrice(Number(e.target.value))}>
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
