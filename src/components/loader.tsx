import React from "react";

interface LoaderProps {
  loading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ loading }) => {
  if (!loading) return null; // Ne rien afficher si loading est false

  return (
    <div className="d-flex justify-content-center my-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Chargement</span>
      </div>
    </div>
  );
};

export default Loader;
