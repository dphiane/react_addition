import React from "react";
import { Modal, Button } from "react-bootstrap";
import {Tva} from "../tva";

interface AddedOrModifiedInterface{
show: boolean;
onHide: ()=>void;
tva: Tva | null;
updated: boolean;
}

const AddedOrModified = ({show,onHide,tva, updated}:AddedOrModifiedInterface) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton closeVariant="white" className='bg-dark'>
                <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-dark'>
                La tva de {tva?.tva} a été {updated ? 'ajoutée' :'modifiée'} avec succès.
            </Modal.Body>
            <Modal.Footer className='bg-dark'>
                <Button variant="secondary" onClick={() => onHide()}>
                    Fermer
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default AddedOrModified;