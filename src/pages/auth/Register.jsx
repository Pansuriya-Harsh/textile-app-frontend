import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/auth';

export default function Register() {
  const [form, setForm] = useState({ company: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await register(form);
      alert('Registered successfully');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        name="company"
        onChange={handleChange}
        placeholder="Company"
        required
      />
      <input
        name="password"
        type="password"
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
      <p style={{ textAlign: 'center' }}>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </form>
  );
}
