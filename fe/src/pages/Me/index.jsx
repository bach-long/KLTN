import {useEffect, useState, useContext} from 'react'
import { AuthContext } from '../../providers/AuthProvider'
import { myDocuments } from '../../services/documents';
import Folder from '../../components/Folder';
import { Col, Row, Dropdown, Menu, Modal, Breadcrumb } from 'antd';
import { FileAddOutlined, FolderAddOutlined } from '@ant-design/icons'
import UploadDocument from '../UploadDocument';
import './index.scss'
import Thumbnail from '../../components/PDFViewer/Thumbnail';
import AddFolderModal from '../../components/AddFolderModal';
import { HomeOutlined } from '@ant-design/icons'

function Me() {
  const [documents, setDocuments] = useState()
  const {authUser} = useContext(AuthContext);
  const [open, setOpen] = useState();
  const [newFolderOpen, setNewFolderOpen] = useState(false);

  const handleBackward = (e) => {
    setCurrent({parentId: e.target.getAttribute('folderid'), level: e.target.getAttribute('level')});
    setBreadcrum(prev => {return prev.slice(0, e.target.getAttribute('level') + 1)});
  }

  const [current, setCurrent] = useState({parentId: null, level: 0});
  const [breadcrum, setBreadcrum] = useState([{title: <span folderid={null} level={0} onClick={handleBackward}><HomeOutlined /> Thư mục của bạn</span>}])

  const handleOpenModal = () => {
    setOpen(true)
  }

  const handleOpenFolderModal = () => {
    setNewFolderOpen(true)
  }

  const items=[
    {
      label:<span onClick={handleOpenModal}><FileAddOutlined/> Tải lên file mới</span>,
      key: 'upload file'
    },
    {
      label: <span><FolderAddOutlined /> Tải folder</span>,
      key: 'upload folder'
    },
    {
      label: <span onClick={handleOpenFolderModal}>Create folder</span>,
      key: 'create folder'
    }
  ]

  const handleFoward = (folderId, folderName)=>{
    setCurrent({parentId: folderId, level: current.level + 1});
    setBreadcrum(prev =>
      {return [...prev, {title: <span folderid={folderId} level={current.level + 1} onClick={handleBackward}>{folderName}</span>}]}
    );
  }

  console.log(current)

  useEffect(() => {
    const getDocs = async () => {
      const data = await myDocuments(current.parentId);
      console.log(data.data);
      setDocuments(data.data);
    }
    getDocs();
  }, [authUser, JSON.stringify(current)]);

  return (
    <div id="my-documents">
      <UploadDocument open={open} setOpen={setOpen} parentId={current.parentId}/>
      <AddFolderModal open={newFolderOpen} setOpen={setNewFolderOpen} parentId={current.parentId}/>
      <Dropdown trigger={["contextMenu"]} menu={{items}}>
      <Row className='me'>
        <Col className='sidebar' span={3}>
          SideBar
        </Col>
        <Col className='documents' span={21}>
          <Breadcrumb items={breadcrum}/>
          <div className='folders'>
            <h3>Folders</h3>
            <Row gutter={[16, 16]} className="documents" style={{ marginLeft: '10%', marginRight: '10%'}}>
              {documents?.folders.map((folder) => (
                <Col span={4} key={folder.name}>
                  <div onClick={()=>{
                    handleFoward(folder.id, folder.name)
                  }}>
                    <Folder folder={folder}/>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          <div className='files'>
          <h3>Files</h3>
          `<Row gutter={[16, 16]} className="result" style={{ marginLeft: '10%', marginRight: '10%'}}>
              {documents?.files.map((document) => (
                <Col span={4} key={document.name}>
                  {<Thumbnail url={document.url} title={document.name}/>}
                </Col>
              ))}
            </Row>
          </div>
        </Col>
      </Row>
      </Dropdown>
    </div>
  )
}

export default Me
