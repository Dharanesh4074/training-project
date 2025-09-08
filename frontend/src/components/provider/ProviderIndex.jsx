import React from 'react';
import { useNavigate } from 'react-router-dom';
import bus_logo from '../../assets/bus.svg';
import flight_logo from '../../assets/flight.svg';
import train_logo from '../../assets/train.svg';

const options = [
  {
    label: 'Add Train',
    image: train_logo,
    description: 'Add new train details and schedules.',
    path: '/add-train',
  },
  {
    label: 'Add Bus',
    image: bus_logo,
    description: 'Add new bus details and routes.',
    path: '/add-bus',
  },
  {
    label: 'Add Flight',
    image: flight_logo,
    description: 'Add new flight details and timings.',
    path: '/add-flight',
  },
  {
    label: 'Get Train',
    image: train_logo,
    description: 'Get train details and schedules.',
    path: '/get-train',
  },
  {
    label: 'Get Bus',
    image: bus_logo,
    description: 'Get bus details and routes.',
    path: '/get-bus',
  },
  {
    label: 'Get Flight',
    image: flight_logo,
    description: 'Get flight details and timings.',
    path: '/get-flight',
  },
];

function ProviderIndex() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
      {options.map(({ label, image, description, path }) => (
        <div
          key={label}
          onClick={() => navigate(path)}
          style={{
            cursor: 'pointer',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '1rem',
            width: '200px',
            textAlign: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img src={image} alt={label} style={{ width: '80px', marginBottom: '1rem' }} />
          <h3>{label}</h3>
          <p style={{ fontSize: '0.9rem', color: '#555' }}>{description}</p>
        </div>
      ))}
    </div>
  );
}

export default ProviderIndex;
