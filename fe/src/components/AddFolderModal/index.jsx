import { Input, Modal } from 'antd'
import React from 'react'
import { Form } from 'antd'
import { storeDocument } from '../../services/documents'

function AddFolderModal({open, setOpen, parentId}) {
  const [form] = Form.useForm()

  const handleAddFolder = async () => {
    console.log({parent_id: parentId, folder_name: form.getFieldValue('folderName'), type: 'folder'});
    const formData = new FormData()
    formData.append('type', 'folder')
    if(parentId) formData.append('parent_id', parentId)
    console.log(parentId);
    formData.append('folder_name', form.getFieldValue('folderName'))
    const data = await storeDocument(formData)
  }

  return (
    <Modal
      centered
      open={open}
      onCancel={()=>{
        setOpen(false)
      }}
      width={'20vw'}
      onOk={handleAddFolder}
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
          marginRight: 20
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
              message: 'Nhập tên thư mục',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddFolderModal;
