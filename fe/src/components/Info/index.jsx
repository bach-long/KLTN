import { Button, Modal, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { FolderOutlined } from '@ant-design/icons';
import { getMetadata } from '../../services/documents';
import moment from 'moment';
import axios from 'axios';

function Info({open, setOpen, id, url}) {
  const [info, setInfo] = useState();
  async function getFileSize(url) {
    try {
      const response = await axios.head(url);
      const contentLength = response.headers['content-length'];
      if (contentLength) {
        const sizeInBytes = parseInt(contentLength, 10);
        // Chuyển đổi kích thước từ byte sang kilobyte hoặc megabyte nếu cần
        const sizeInKB = Math.round(sizeInBytes / 1024);
        const sizeInMB = Math.round(sizeInKB / 1024);
        return { bytes: sizeInBytes, kilobytes: sizeInKB, megabytes: sizeInMB };
      } else {
        throw new Error('Không thể lấy kích thước tệp tin từ URL.');
      }
    } catch (error) {
      console.error('Lỗi:', error);
    }
  }
  useEffect(() => {
    if(open && id) {
      const fetchInfo = async () => {
        let data = await getMetadata(id);
        const size = url ? await getFileSize(url) : null;
        data = data.data;
        const lastItem = data.slice(-1)[0];
        const extractInfo = {
          path: data.length > 1 ? `/${data.slice(0, data.length - 1).map(item => item.name).join('/')}` : '/',
          name: lastItem.name,
          type: url ? lastItem.name.split('.').slice(-1)[0] : 'folder',
          marked: data.marked,
          createdAt: moment(lastItem.created_at).format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: moment(lastItem.updated_at).format('YYYY-MM-DD HH:mm:ss'),
          size: size,
        }
        console.log(extractInfo)
        setInfo(extractInfo)
      }
      fetchInfo();
    }
  }, [open, id, url])
  return (
    <Modal
      centered
      open={open}
      onCancel={()=>{
        setOpen(false);
        setInfo(null);
      }}
      width={'20vw'}
      footer={[
        <Button key="Ok" type='primary' onClick={() => {setOpen(false)}}>
          Ok
        </Button>
      ]}
      zIndex={100}
      title={<Typography.Title level={4}>Thông tin chi tiết</Typography.Title>}
    >
      {open && id &&
        <div>
          <Typography.Title level={5}>Vị trí</Typography.Title>
          <Typography.Link ><FolderOutlined /> {info?.path}</Typography.Link>
          <Typography.Title level={5}>Tên</Typography.Title>
          <Typography.Text>{info?.name}</Typography.Text>
          <Typography.Title level={5}>Loại tài nguyên</Typography.Title>
          <Typography.Text>{info?.type}</Typography.Text>
          {info?.type !== 'folder' &&
          <>
            <Typography.Title level={5}>Kích thước</Typography.Title>
            <Typography.Text>{`${info?.size.megabytes} MB`}</Typography.Text>
          </>
          }
          <Typography.Title level={5}>Thời gian tải lên</Typography.Title>
          <Typography.Text>{info?.createdAt}</Typography.Text>
          <Typography.Title level={5}>Lần sửa đổi gần nhất</Typography.Title>
          <Typography.Text>{info?.updatedAt}</Typography.Text>
        </div>
      }
    </Modal>
  )
}

export default Info
