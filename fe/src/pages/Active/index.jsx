import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getUserByToken } from "../../services/Auth";
import { Button } from "antd";
import "./index.scss";

function Active() {
  const { token } = useParams();
  const [check, setCheck] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const getByToken = async () => {
      const response = await getUserByToken(token);
      if (response.success) {
        setCheck(true);
      }
    };
    getByToken();
  });
  const handleClick = () => {
    navigate("/auth/login");
  };
  return (
    <div>
      {check && (
        <>
          <div className="active">Tài khoản của bạn đã được kích hoạt</div>
          <div className="active-button">
            <Button onClick={handleClick} type="primary">
              Login
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Active;
