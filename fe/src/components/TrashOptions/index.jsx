import React from "react";
import { DeleteOutlined, UndoOutlined } from "@ant-design/icons";
import { Menu, Typography } from "antd";
import { permanentDelete, toggleTrash } from "../../services/documents";
import { toast } from "react-toastify";

function TrashOptions({ document, setDocuments }) {
  const handleTrash = async () => {
    try {
      const type = "restore";
      const response = await toggleTrash(document.id, { type: type });
      if (!response.success) {
        throw new Error(response.message);
      } else {
        setDocuments((prev) => {
          return {
            folders:
              document.type === "folder"
                ? prev.folders.filter((element) => {
                    return element.id != document.id;
                  })
                : [...prev.folders],
            files:
              document.type === "file"
                ? prev.files.filter((element) => {
                    return element.id != document.id;
                  })
                : [...prev.files],
          };
        });
      }
    } catch (err) {
      toast.error(`Có lỗi xảy ra khi cập nhật tài liệu${err.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await permanentDelete(document.id);
      if (!response.success) {
        throw new Error(response.message);
      } else {
        setDocuments((prev) => {
          return {
            folders:
              document.type === "folder"
                ? prev.folders.filter((element) => {
                    return element.id != document.id;
                  })
                : [...prev.folders],
            files:
              document.type === "file"
                ? prev.files.filter((element) => {
                    return element.id != document.id;
                  })
                : [...prev.files],
          };
        });
      }
    } catch (err) {
      toast.error(`Có lỗi xảy ra khi cập nhật tài liệu${err.message}`);
    }
  };
  const items = [
    {
      label: (
        <Typography.Text
          onClick={async () => {
            await handleDelete();
          }}
          style={{ color: "red" }}
        >
          <DeleteOutlined /> Xóa Vĩnh Viễn
        </Typography.Text>
      ),
      key: "delete",
    },
    {
      label: (
        <Typography.Text
          onClick={async () => {
            await handleTrash();
          }}
        >
          <UndoOutlined /> Khôi Phục
        </Typography.Text>
      ),
      key: "restore",
    },
  ];
  return (
    <div
      onContextMenu={(e) => {
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Menu className="trash-options" items={items} />
    </div>
  );
}

export default TrashOptions;
