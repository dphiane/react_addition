import React from 'react';
import { Modal, Button } from 'react-bootstrap';


interface AddedOrModifiedInterface {
    show: boolean;
    onHide: () => void;
    articleName: string;
    updated: boolean
}
const AddedOrModified = ({ show, onHide, articleName, updated }: AddedOrModifiedInterface) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton closeVariant="white" className='bg-dark'>
                <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-dark'>
                L'article {articleName} a été {updated ? 'modifiée': 'ajoutée' } avec succès.
            </Modal.Body>
            <Modal.Footer className='bg-dark'>
                <Button variant="secondary" onClick={onHide}>
                    Fermer
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default AddedOrModified;