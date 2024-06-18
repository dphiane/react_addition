import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { register } from './api';
import { Link } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ error, setError ] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      await register(email, password);
      setError('');
      navigate("/");
    } catch (err) {
      setError('Une erreur est survenue lors de la création du compte');
    }
  };

  const validatePassword = (password: string): string => {
    if (password.length < 6) {
      return 'Votre mot de passe doit faire 6 caractères minimum';
    }
    if (password.length > 50) {
      return 'Votre mot de passe doit faire 50 caractères maximum';
    }
    return '';
  };

  return (
    <div className='d-flex justify-content-center mt-3 flex-column align-items-center'>
      <h2 className='text-light mb-2'>Créer un nouvelle utilisateur</h2>
      <div className='card-form w-100'>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 text-light">
            <Form.Label>Adresse Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ajouter votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 text-light">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Créer un mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          {error && <p className='text-danger'>{error}</p>}
          <Button variant="primary" type="submit">
            S'enregistrer
          </Button>
        </Form>
      </div>
      <Link to={"/"}><button className="btn btn-secondary m-3">Page de connection</button></Link>

    </div>
  );
};

export default RegisterForm;
