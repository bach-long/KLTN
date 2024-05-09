import { Input, Modal } from 'antd'
import React, { useState } from 'react'
import { Form } from 'antd'
import { storeDocument, updateDocument } from '../../services/documents'
import { toast } from 'react-toastify'

function ChangeNameModal({open, setOpen, document, setDocument}) {
  const [form] = Form.useForm()

  const handleChangeName = async () => {
    try {
      let newName = form.getFieldValue('newName')
      if (document.type == "file") {
        newName = newName + "." + document.name.split(".").pop()
      }
      const response = await updateDocument(document.id, {name: newName})
      if (response.success) {
        setDocument(prev => { return {...prev, name: newName} })
        toast.success("Đổi tên thành công");
        setOpen(false)
      } else {
        throw new Error("Thao tác thất bại")
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      form.resetFields(['newName']);
    }
  }

  return (
    <Modal
      centered
      open={open}
      onCancel={()=>{
        setOpen(false)
      }}
      width={'20vw'}
      onOk={handleChangeName}
      title={document.name}
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
          label="Tên mới"
          name="newName"
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

export default ChangeNameModal;
