import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/auth';

export default function Login() {
  const [form, setForm] = useState({ company: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await login(form);
      // console.log(res);
      localStorage.setItem('company', res.user.company); // Optional, can be done in context
      navigate('/dashboard');
    } catch (err) {
      // console.log(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
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
      <button type="submit">Login</button>
      <p style={{ textAlign: 'center' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </form>
  );
}
