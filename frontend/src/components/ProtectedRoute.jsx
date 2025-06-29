import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();

  // 1. Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // 2. Developer console warnings
  if (process.env.NODE_ENV === 'development') {
    if (roles && !Array.isArray(roles)) {
      console.warn(
        'ProtectedRoute: "roles" prop should be an array, got',
        typeof roles
      );
    }
    if (!user.role) {
      console.error('ProtectedRoute: user has no "role" field', user);
    }
  }

  // 3. Role mismatch → show 403 message
  if (roles && !roles.includes(user.role)) {
    return (
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          height: '50vh',
          textAlign: 'center'
        }}
      >
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>403</h1>
        <p>You are not authorised to view this page.</p>
      </div>
    );
  }

  // 4. Access granted → render nested routes
  return <Outlet />;
}

ProtectedRoute.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string)
};
