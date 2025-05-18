import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import '../styles/UserProfile.css';

const UserProfile = ({ onLogout }) => {
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('company');
    setCompanyName(name || 'Company');
  }, []);

  return (
    <div className="user-profile-container">
      <div className="user-profile-info">
        <FaUser className="user-profile-icon" />
        <span className="user-profile-name">{companyName}</span>
      </div>
      <button className="user-profile-logout" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
