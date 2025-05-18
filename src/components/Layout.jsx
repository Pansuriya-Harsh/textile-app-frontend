import { Outlet, useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <UserProfile onLogout={handleLogout} />
      </header>
      <hr />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
