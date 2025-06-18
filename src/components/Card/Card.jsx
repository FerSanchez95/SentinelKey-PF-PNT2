import React from 'react';

const ServiceCard = ({ serviceName, serviceInfo }) => {
  const handleCardClick = () => {
    navigator.clipboard.writeText(serviceInfo)
      .then(() => {
        alert(`Information for "${serviceName}" copied to clipboard!`);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy information. Please try again.');
      });
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        margin: '10px',
        cursor: 'pointer',
        boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100px'
      }}
    >
      <h3>{serviceName}</h3>
    </div>
  );
};

export default ServiceCard;
