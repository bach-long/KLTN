import { Input, Modal } from "antd";
import { useState } from "react";
import { Form } from "antd";
import { storeDocument } from "../../services/documents";
import { toast } from "react-toastify";
import SpinLoading from "../Loading/SpinLoading";

function AddFolderModal({ open, setOpen, parentId, setRefresh }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleAddFolder = async () => {
    try {
      const formData = new FormData();
      formData.append("type", "folder");
      if (parentId) formData.append("parent_id", parentId);
      formData.append("folder_name", form.getFieldValue("folderName"));
      const response = await storeDocument(formData);
      if (response.success) {
        setRefresh((prev) => {
          return -1 * prev;
        });
        toast.success("Tạo thành công");
        setOpen(false);
      } else {
        throw new Error("Khởi tạo tài liệu thất bại");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      form.resetFields(["folderName"]);
      setLoading(false);
    }
  };

  return (
    <Modal
      centered
      open={open}
      onCancel={() => {
        setOpen(false);
      }}
      width={"20vw"}
      onOk={async () => {
        setLoading(true);
        await handleAddFolder();
      }}
      okButtonProps={{ disabled: loading ? true : false }}
    >
      <Form
        form={form}
        name="addFolder"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
          marginTop: 20,
          marginRight: 20,
        }}
        initialValues={{
          remember: true,
        }}
        autoComplete="off"
      >
        <Form.Item
          label="Folder Name"
          name="folderName"
          rules={[
            {
              required: true,
              message: "Nhập tên thư mục",
            },
          ]}
        >
          <Input />
        </Form.Item>
        {loading && <SpinLoading size={"2rem"} />}
      </Form>
    </Modal>
  );
}

export default AddFolderModal;
