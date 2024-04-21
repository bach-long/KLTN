import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getUserByToken } from '../../services/Auth';
import { Button } from 'antd';

function Active() {
  const { token } = useParams();
  const [check, setCheck] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    const getByToken = async () => {
      const response = await getUserByToken(token);
      if(response.success) {
        setCheck(true)
      }
    }
    getByToken();
  })
  const handleClick = () => {
    navigate('/auth/login');
  }
  return (
    <div>
      {check &&
        <>
          <p>Tài khoản của bạn đã được kích hoạt</p>
          <Button onClick={handleClick} type='primary'>Login</Button>
        </>
      }
    </div>
  )
}

export default Active
