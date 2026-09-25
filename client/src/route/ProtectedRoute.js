import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  console.log(isAuthenticated)

  useEffect(() => {
    if (isAuthenticated !== null) {
      // provera da li je autentfikacija odradjena
      setIsChecked(true);
    }
  }, [isAuthenticated]);

// ako se proverava pise loading
  if (!isChecked) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
