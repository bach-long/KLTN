import { createContext, useEffect, useState } from 'react';
import { me } from '../../services/Auth';
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

  const handlerGetMe = async () => {
    const res = await me();
    if (res.success === 1 && res.data) {
      setAuthUser(res.data);
      localStorage.setItem('authUser', JSON.stringify(res.data));
    } else {
      navigate('/auth/login')
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userLocal = JSON.parse(localStorage.getItem('authUser'));

    if (userLocal) {
      setAuthUser(userLocal);
    }

    if (!userLocal && token) {
      handlerGetMe();
    }
  }, []);

  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
    // other prop types...
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
