import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';

const Auth = () => {
  // const navigate = useNavigate();
  // const { authUser } = useContext(AuthContext);
  // if (authUser) {
  //   navigate('/');
  //   return;
  // }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default Auth;
