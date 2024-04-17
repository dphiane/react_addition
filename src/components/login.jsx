import { useState } from "react";
import axios from "axios";
import Image from "../assets/caisse-restaurant.png";
import { Link } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Appel à l'API pour authentifier l'utilisateur et obtenir le token JWT
      const response = await axios.post("http://example.com/api/login", {
        email: email,
        password: password,
      });

      // Stockage du token JWT dans le localStorage
      localStorage.setItem("token", response.data.token);

      // Redirection vers la page d'accueil
      window.location.href = "/";
    } catch (error) {
      // Affichage d'un message d'erreur si les informations de connexion sont incorrectes
      alert("Identifiant ou mot de passe incorrect");
    }
  };

  return (
    <div className="container d-flex flex-column flex-lg-row align-items-center">
      <div className="col-md-8 position-relative">
        <img
          className="img-fluid rounded-3"
          src={Image}
          alt="illustration d'une caisse enregistreuse"
        />
      </div>
      <div className="container col-lg-4 d-flex flex-column justify-content-center">
        <h2 className="text-center">Connexion</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Mot de passe
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Se connecter
          </button>
          <small className="ms-2"><Link to={'/forgot-password'}>Mot de passe oublié ?</Link></small>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
