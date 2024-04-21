import { Select } from "antd";
import "./index.scss";
import { useState } from "react";

function TypeSelector({ type, setType }) {
  const items = [
    {
      label: "Thư mục",
      value: 1,
    },
    {
      label: "Pdf",
      value: 2,
    },
    {
      label: "Văn bản",
      value: 3,
    },
    {
      label: "Bảng tính",
      value: 4,
    },
  ];
  return (
    <Select
      onClear={() => {
        setType(null);
      }}
      value={type ? type : "Loại"}
      allowClear
      placeholder="Loại"
      className="type-selector"
      style={{ width: 115 }}
      onChange={(value) => {
        setType(value);
      }}
      options={items}
    />
  );
}

export default TypeSelector;
