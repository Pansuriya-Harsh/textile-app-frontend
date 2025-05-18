import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import FinancialYear from './pages/dashboard/FinancialYear';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Parties from './pages/dashboard/Parties';
import Records from './pages/dashboard/Records';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes wrapped in Layout */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<FinancialYear />} />
          <Route path="financial-year/:yearId" element={<Parties />} />
          <Route path=":yearId/parties/:partyId" element={<Records />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
