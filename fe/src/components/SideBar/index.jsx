import React from "react";
import { Menu, Typography } from "antd";
import "./index.scss";
import { HomeOutlined } from "@ant-design/icons";

function SideBar({ setSelectedMenu, setBreadcrum, handleBackward }) {
  const items = [
    {
      label: <Typography.Link strong>Tài liệu của tôi</Typography.Link>,
      key: "home",
    },
    {
      label: <Typography.Link strong>Tài liệu quan trọng</Typography.Link>,
      key: "marked",
    },
    {
      label: <Typography.Link strong>Thùng rác</Typography.Link>,
      key: "deleted",
    },
  ];

  return (
    <Menu
      style={{
        height: "100%",
        backgroundColor: "var(--background)",
        borderRadius: 10,
      }}
      defaultSelectedKeys={["home"]}
      onClick={({ key }) => {
        setSelectedMenu(key);
      }}
    >
      {items.map((item) => (
        <Menu.Item key={item.key}>
          <Typography.Text>{item.label}</Typography.Text>
        </Menu.Item>
      ))}
    </Menu>
  );
}

export default SideBar;
