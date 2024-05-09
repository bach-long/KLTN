import React, { useEffect, useState } from 'react'
import {Button, Menu, Modal, Typography} from 'antd'
import {FolderFilled} from '@ant-design/icons'
import { getMovingMenu, updateDocument } from '../../services/documents';
import { toast } from 'react-toastify';
import { ArrowLeftOutlined } from '@ant-design/icons';

function MovingMenu({open, setOpen, parentId, id, document, setCurrentDocuments, selectedMenu, currentPosition}) {
  const [documents, setDocuments] = useState([]);
  const [parentFolder, setParentFolder] = useState();
  const [folderId, setFolderId] = useState(parentId);
  const [current, setCurrent] = useState()
  const [checkCurrent, setCheckCurrent] = useState(false)
  console.log(currentPosition)
  useEffect(() => {
    if(open) {
      console.log(checkCurrent)
      const getFolders = async () => {
        try {
          const data = await getMovingMenu(folderId);
          setDocuments(data.data.documents.filter((item) => {return item.id != id}));
          setParentFolder(data.data.parentFolder)
          if(!checkCurrent) {
            setCurrent(data.data.parentFolder)
            setCheckCurrent(true)
          }
          if (data.success === 0) {
            throw new Error(data.message);
          }
        } catch (err) {
          toast.error(err.message);
        }
      }
      getFolders()
    }
  }, [open, parentId, folderId, id, checkCurrent])

  const handleMove = async (id, data) => {
    try {
      const result = await updateDocument(id, data)
      console.log(result.success === 0)
      if (result.success === 0) {
        throw new Error(data.message);
      } else {
        toast.success("Đã di chuyển tài liệu");
        if(selectedMenu === 'home' || currentPosition.parentId) {
          setCurrentDocuments((prev) => {
            return {
              folders: document.type === "folder" ? prev.folders.filter(element => {return element.id != document.id}) : [...prev.folders],
              files: document.type === "file" ? prev.files.filter(element => {return element.id != document.id}) : [...prev.files]
            }
          });
        }
      }
    } catch (err) {
      toast.error("Lỗi khi di chuyển tài liệu")
    }
  }

  return (
    <Modal
      centered
      open={open}
      onCancel={()=>{
        setOpen(false);
        setDocuments([]);
        setFolderId(parentId)
      }}
      width={'30vw'}
      footer={[
        <Button disabled={(folderId == parentId) || (!folderId && !parentId)} key="Ok" type='primary' onClick={async () => {await handleMove(id, {parent_id: folderId})}}>
          Di chuyển
        </Button>
      ]}
      zIndex={100}
    >
      <div className="modal-content">
        <h2>Vị trí hiện tại: <Button onClick={() => {setFolderId(current ? current.id : null)}}><FolderFilled /> {current ? current.name : "Tài liệu của tôi"}</Button></h2>
        <h3><ArrowLeftOutlined onClick={() => { if(parentFolder) {setFolderId(parentFolder.parent_id)} }}/> {parentFolder ? parentFolder.name : ' Tài liệu của tôi'}</h3>
        <hr className="modal-divider" /> {/* Đường kẻ ngang */}
        <div className="content-section">
      {open && documents.length > 0 ?
          (<>
            <Menu style={{height: 500, overflow: 'auto'}}>
                {documents.map((item) => (
                  <Menu.Item key={item.id} onClick={() => {setFolderId(item.id)}}>
                    <Typography.Text key={item.id} style={{fontSize : 16}}> <FolderFilled /> {item.name} </Typography.Text>
                  </Menu.Item>
                ))}
            </Menu>
          </>
          ) : (
            <div style={{height: 500, overflow: 'auto'}}>
              <Typography.Text>Không có thư mục thích hợp</Typography.Text>
            </div>
          )
      }
        </div>
      </div>
      </Modal>
  )
}

export default MovingMenu
