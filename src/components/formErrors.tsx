import React from 'react';

interface FormErrorsProps {
  errors: string[];
}

const FormErrors: React.FC<FormErrorsProps> = ({ errors }) => {
  return (
    <>
      {errors.length > 0 && (
        <div className="alert alert-danger">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default FormErrors;
