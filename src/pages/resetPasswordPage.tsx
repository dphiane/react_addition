import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { forgotPassword } from "../api";
import ResetPasswordSuccess from "../components/modals/resetPasswordSuccess";
// @ts-ignore
import Image from "../assets/forgot-password.jpg";

const ResetPasswordPage: React.FC = () => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ error, setError ] = useState('');
    const [modal ,setModal]=useState<boolean>(false);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if(password.trim().length < 6){
            setError('Votre mot de passe doit faire 6 caractères minimum');
            return;
        }
        if (password.trim() !== confirmPassword.trim()) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            const response = await forgotPassword(token!, password)
            console.log(response)
            setModal(true);
        } catch (error) {
            setError('Une erreur est survenue lors de la réinitialisation du mot de passe.');
        }
    };

    return (
        <div className="container d-flex flex-column flex-lg-row align-items-center vh-100 mt-2">
            <ResetPasswordSuccess show={modal} onHide={()=>setModal(false)}></ResetPasswordSuccess>
            <div className="col-md-8 position-relative">
                <img
                    className="img-fluid rounded-3"
                    src={Image}
                    alt="illustration d'une caisse enregistreuse"
                />
            </div>
            <div className="text-light container col-lg-4 col-md-6 col-10 d-flex flex-column justify-content-center m-2">
                <h2>Réinitialisation du mot de passe</h2>
                <Form onSubmit={handleResetPassword}>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Nouveau mot de passe:</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirmer le mot de passe:</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <div className="d-flex flex-column">
                        <Button variant="primary" type="submit">
                            Réinitialiser le mot de passe
                        </Button>
                        <small className="text-light btn btn-link">
                            <Link to={'/login'}>Page de connection</Link>
                        </small>
                    </div>
                </Form>
                {error && <p className="text-danger">{error}</p>}
            </div>
        </div>
    );
}

export default ResetPasswordPage;
