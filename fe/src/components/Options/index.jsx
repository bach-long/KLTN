import {
  FileOutlined,
  DeleteOutlined,
  StarOutlined,
  FolderOpenOutlined,
  StarFilled,
  EditOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Info from "../Info";
import { Typography } from "antd";
import { toggleTrash, updateDocument } from "../../services/documents";
import { toast } from "react-toastify";

const Options = ({
  setOpenInfo,
  setOpenMove,
  setChangeNameOpen,
  document,
  setDocument,
  setDocuments,
}) => {
  const handleMark = async () => {
    try {
      const setMark = document.marked ? 0 : 1;
      const response = await updateDocument(document.id, { marked: setMark });
      if (!response.success) {
        throw new Error(response.message);
      }
      setDocument({ ...document, marked: setMark });
    } catch (err) {
      print(err.message);
      toast.error(`Có lỗi xảy ra khi đánh dấu tài liệu`);
    }
  };

  const handleTrash = async () => {
    try {
      const type = "delete";
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

  const items = [
    {
      label: (
        <Typography.Text
          onClick={() => {
            setOpenInfo(true);
          }}
        >
          <FileOutlined /> Xem chi tiết
        </Typography.Text>
      ),
      key: "detail",
    },
    {
      label: (
        <Typography.Text
          onClick={() => {
            setChangeNameOpen(true);
          }}
        >
          <EditOutlined /> Đổi tên
        </Typography.Text>
      ),
      key: "rename",
    },
    {
      label: (
        <Typography.Text
          onClick={async () => {
            await handleTrash();
          }}
        >
          <DeleteOutlined /> Xóa
        </Typography.Text>
      ),
      key: "delete",
    },
    {
      label: (
        <Typography.Text
          onClick={async () => {
            await handleMark();
          }}
        >
          {document.marked ? (
            <span>
              <StarFilled /> Hủy đánh dấu
            </span>
          ) : (
            <span>
              <StarOutlined /> Đánh dấu
            </span>
          )}
        </Typography.Text>
      ),
      key: "mark",
    },
    {
      label: (
        <Typography.Text
          onClick={() => {
            setOpenMove(true);
          }}
        >
          <FolderOpenOutlined /> Di chuyển
        </Typography.Text>
      ),
      key: "move",
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
      <Menu className="options" items={items} />
    </div>
  );
};

export default Options;
