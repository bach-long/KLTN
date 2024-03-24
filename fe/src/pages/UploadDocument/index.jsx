import { useEffect, useRef, useState } from 'react'
import { InboxOutlined } from '@ant-design/icons';
import { Upload, Button, Modal } from 'antd';
import './index.scss'
import PDFViewer from '../../components/PDFViewer';
import { storeDocument } from '../../services/documents';

const { Dragger } = Upload;

function UploadDocument({open, setOpen, parentId, fileType}) {
  console.log(fileType)
  const [file, setFile] = useState();
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
  };

  const handleStore = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    if(parentId) formData.append('parent_id', parentId)
    formData.append('type', 'file')
    await storeDocument(formData)
  }

  return (
    <Modal
      id='upload'
      centered
      open={open}
      onCancel={()=>{
        setOpen(false)
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
      <Dragger {...props} maxCount={1} style={{
          height: 'fit-content',
          fontSize: '1rem',
          fontWeight: 800,
      }} ref={ref} showUploadList={ref?.current?.fileList.length > 0 ? true : false} accept={fileType}>
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
        Chọn File
      </Dragger>
    </Modal>
  )
}

export default UploadDocument
