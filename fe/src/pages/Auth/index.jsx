import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';

const Auth = () => {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default Auth;
