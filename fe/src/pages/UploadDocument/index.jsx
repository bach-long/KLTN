import { useEffect, useState } from 'react'
import { InboxOutlined } from '@ant-design/icons';
import { Upload, Button, Modal } from 'antd';
import './index.scss'
import PDFViewer from '../../components/PDFViewer';
import { storeDocument } from '../../services/documents';

const { Dragger } = Upload;

function UploadDocument({open, setOpen, parentId}) {
  const [file, setFile] = useState();
  const [url, setUrl] = useState();

  useEffect(() => {
    if (file) {
      console.log(file);
      const url = URL.createObjectURL(file);
      setUrl(url);
      return () => {
        URL.revokeObjectURL(url); // Release the object URL when the component unmounts
      };
    }
  }, [JSON.stringify(file)]);

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
    const data = await storeDocument(formData)
    console.log(data);
  }

  return (
    <Modal
      id='upload'
      centered
      open={open}
      onCancel={()=>{
        setOpen(false)
        setFile()
        setUrl()
      }}
      width={'90vw'}
    >
      <Dragger {...props} maxCount={1} accept='.pdf' style={{
          width: '15vw',
          height: 'fit-content',
          fontSize: '1rem',
          fontWeight: 800,
          }}>
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
        Chọn File
      </Dragger>
      {
        file && url &&
        <>
          <PDFViewer url={url}/>
          <Button onClick={() => {handleStore(file)}} type='primary' style={{fontSize: '1rem', fontWeight: 600, marginTop: '10px'}}>Lưu Tài liệu</Button>
        </>
      }
    </Modal>
  )
}

export default UploadDocument
