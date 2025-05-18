import { Navigate, useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    // console.log(decoded);
    const now = Date.now() / 1000;
    return decoded.exp && decoded.exp > now;
  } catch (err) {
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token || !isTokenValid(token)) {
    localStorage.removeItem('token'); // clean invalid token
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
