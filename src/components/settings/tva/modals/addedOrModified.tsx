import React from "react";
import { Modal, Button } from "react-bootstrap";
import {TvaInterface} from "types";

interface AddedOrModifiedInterface{
show: boolean;
onHide: ()=>void;
tva: TvaInterface | null;
updated: boolean;
}

const AddedOrModified = ({show,onHide,tva, updated}:AddedOrModifiedInterface) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton closeVariant="white" className='bg-dark'>
                <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-dark'>
                La tva de {tva?.tva} a été {updated ? 'modifiée' :'ajoutée'} avec succès.
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