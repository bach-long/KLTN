import { useEffect, useRef, useState } from 'react'
import { InboxOutlined } from '@ant-design/icons';
import { Upload, Button, Modal, Select } from 'antd';
import './index.scss'
import PDFViewer from '../../components/PDFViewer';
import { storeDocument } from '../../services/documents';

const { Dragger } = Upload;

function UploadDocument({open, setOpen, parentId, fileType}) {
  console.log(fileType)
  const [file, setFile] = useState();
  const [method, setMethod] = useState('auto');
  const ref = useRef();

  const props = {
    name: 'file',
    multiple: false,
    beforeUpload: () => {
      return false;
    },
    onChange(info) {
      setFile(info.file)
    },
    onDrop() {
      setFile()
    },
    fileList: file ? [file] : []
  };

  const handleStore = async (file) => {
    const formData = new FormData()
    console.log(file)
    formData.append('file', file)
    if(parentId) formData.append('parent_id', parentId)
    formData.append('type', 'file')
    formData.append('method', method)
    await storeDocument(formData)
  }

  return (
    <Modal
      id='upload'
      centered
      open={open}
      onCancel={()=>{
        console.log("close")
        setOpen(false)
        setMethod("auto")
        setFile()
        ref.current.fileList = [];
      }}
      onOk={() => {
        if(file) {
          handleStore(file)
        }
      }}
      okText="Store"
      closable={false}
    >
      <Select
        value={method}
        style={{
          marginTop: 10,
          marginBottom: 10,
        }}
        onChange={
          (value) => {
            setMethod(value)
          }
        }
        options={[
          {
            value: 'auto',
            label: 'Văn bản thông thường',
          },
          {
            value: 'ocr',
            label: 'OCR',
            disabled: fileType !== ".pdf" ? true : false
          },
          {
            value: 'handWriten',
            label: 'OCR với chữ viết tay',
            disabled: fileType !== ".pdf" ? true : false
          },
        ]}
      />
      <Dragger {...props} maxCount={1} style={{
          height: 'fit-content',
          fontSize: '1rem',
          fontWeight: 800,
      }} ref={ref} accept={fileType}>
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
        Chọn File
      </Dragger>
    </Modal>
  )
}

export default UploadDocument
