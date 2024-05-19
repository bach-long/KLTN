import { Button, Modal, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { FolderOutlined } from "@ant-design/icons";
import { getMetadata } from "../../services/documents";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
import SpinLoading from "../Loading/SpinLoading";

function Info({ open, setOpen, id, url }) {
  const [info, setInfo] = useState();
  const [loading, setLoading] = useState(false)
  async function getFileSize(url) {
    try {
      const response = await axios.head(url);
      const contentLength = response.headers["content-length"];
      if (contentLength) {
        const sizeInBytes = parseInt(contentLength, 10);
        // Chuyển đổi kích thước từ byte sang kilobyte hoặc megabyte nếu cần
        const sizeInKB = sizeInBytes / 1024;
        const sizeInMB = sizeInKB / 1024;
        return {
          bytes: sizeInBytes.toFixed(2),
          kilobytes: sizeInKB.toFixed(2),
          megabytes: sizeInMB.toFixed(2),
        };
      } else {
        throw new Error("Không thể lấy kích thước tệp tin từ URL.");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  }
  useEffect(() => {
    if (open && id) {
      const fetchInfo = async () => {
        try {
          let data = await getMetadata(id);
          const size = url ? await getFileSize(url) : null;
          data = data.data;
          const lastItem = data.slice(-1)[0];
          const extractInfo = {
            path:
              data.length > 1
                ? `/${data
                    .slice(0, data.length - 1)
                    .map((item) => item.name)
                    .join("/")}`
                : "/",
            name: lastItem.name,
            type: url ? lastItem.name.split(".").slice(-1)[0] : "folder",
            marked: data.marked,
            createdAt: moment(lastItem.created_at).format("YYYY-MM-DD HH:mm:ss"),
            updatedAt: moment(lastItem.updated_at).format("YYYY-MM-DD HH:mm:ss"),
            size: size,
          };
          setInfo(extractInfo);
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      };
      setLoading(true)
      fetchInfo();
    }
  }, [open, id, url]);
  return (
    <Modal
      centered
      open={open}
      onCancel={() => {
        setOpen(false);
        setInfo(null);
      }}
      width={"20vw"}
      footer={[
        <Button
          key="Ok"
          type="primary"
          onClick={() => {
            setOpen(false);
          }}
        >
          Ok
        </Button>,
      ]}
      zIndex={100}
      title={<Typography.Title level={4}>Thông tin chi tiết</Typography.Title>}
    >
      {open && id && !loading && (
        <div>
          <Typography.Title level={5}>Vị trí</Typography.Title>
          <Typography.Link>
            <FolderOutlined /> {info?.path}
          </Typography.Link>
          <Typography.Title level={5}>Tên</Typography.Title>
          <Typography.Text>{info?.name}</Typography.Text>
          <Typography.Title level={5}>Loại tài nguyên</Typography.Title>
          <Typography.Text>{info?.type}</Typography.Text>
          {info?.type !== "folder" && (
            <>
              <Typography.Title level={5}>Kích thước</Typography.Title>
              <Typography.Text>{`${info?.size.megabytes} MB`}</Typography.Text>
            </>
          )}
          <Typography.Title level={5}>Thời gian tải lên</Typography.Title>
          <Typography.Text>{info?.createdAt}</Typography.Text>
          <Typography.Title level={5}>Lần sửa đổi gần nhất</Typography.Title>
          <Typography.Text>{info?.updatedAt}</Typography.Text>
        </div>
      )}

      {open && id && loading && (
        <SpinLoading size={"2rem"} />
      )}
    </Modal>
  );
}

export default Info;
