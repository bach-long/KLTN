import { useEffect, useRef, useState } from 'react'
import { InboxOutlined } from '@ant-design/icons';
import { Upload, Button, Modal, Select, Spin } from 'antd';
import './index.scss'
import PDFViewer from '../../components/PDFViewer';
import { storeDocument } from '../../services/documents';
import { toast } from 'react-toastify';
import { LoadingOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

function UploadDocument({open, setOpen, parentId, fileType, setRefresh}) {
  const [file, setFile] = useState();
  const [method, setMethod] = useState('auto');
  const [loading, setLoading] = useState(false);
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

  const reset = () => {
    setOpen(false)
    setMethod("auto")
    setFile()
    ref.current.fileList = [];
  }

  const handleStore = async (file) => {
    try {
      const formData = new FormData()
      console.log(file)
      formData.append('file', file)
      if(parentId) formData.append('parent_id', parentId)
      formData.append('type', 'file')
      formData.append('method', method)
      setLoading(true);
      const response = await storeDocument(formData)
      if (response.success) {
        setLoading(false);
        setRefresh(prev => {return -1 * prev});
        toast.success("Tạo thành công");
        reset();
      } else {
        throw new Error("Khởi tạo tài liệu thất bại")
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <Modal
      id='upload'
      centered
      open={open}
      onCancel={()=>{
        console.log("close")
        reset();
      }}
      onOk={() => {
        if(file) {
          handleStore(file)
        }
      }}
      okButtonProps={{disabled: loading ? true : false}}
      cancelButtonProps={{disabled: loading ? true : false}}
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
        {loading ?
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 24,
              }}
              spin
            />
          }
        /> :
        <span>Chọn File</span>}
      </Dragger>
    </Modal>
  )
}

export default UploadDocument
