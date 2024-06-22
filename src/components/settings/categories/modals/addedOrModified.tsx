import { CategoryInterface } from "types";
import React from "react";
import { Modal, Button } from "react-bootstrap";

interface AddedOrModified {
    show: boolean;
    onHide: () => void;
    categoryName: string;
    categoryToUpdate: CategoryInterface | null;
}

const AddedOrModified = ({show,onHide,categoryName,categoryToUpdate}:AddedOrModified) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton closeVariant="white" className='bg-dark'>
                <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-dark'>
                La catégorie {categoryName} a été {categoryToUpdate ? 'modifiée' : 'ajoutée'} avec succès.
            </Modal.Body>
            <Modal.Footer className='bg-dark'>
                <Button variant="secondary" onClick={onHide}>
                    Fermer
                </Button>
            </Modal.Footer>
        </Modal>)
}
export default AddedOrModified;