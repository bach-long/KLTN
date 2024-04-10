import {useEffect, useState, useContext} from 'react'
import { AuthContext } from '../../providers/AuthProvider'
import { myDocuments } from '../../services/documents';
import Folder from '../../components/Folder';
import { Col, Row, Dropdown, Breadcrumb, Typography } from 'antd';
import { FileAddOutlined, FolderAddOutlined, FileWordOutlined, FilePdfOutlined, FilePptOutlined, FileExcelOutlined } from '@ant-design/icons'
import UploadDocument from '../UploadDocument';
import './index.scss'
import Thumbnail from '../../components/PDFViewer/Thumbnail';
import AddFolderModal from '../../components/AddFolderModal';
import { HomeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import SideBar from '../../components/SideBar';
import {toast} from 'react-toastify';
import SearchBar from '../../components/SearchBar';

function Me() {
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [documents, setDocuments] = useState()
  const {authUser} = useContext(AuthContext);
  const [open, setOpen] = useState();
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState();
  const navigate = useNavigate();
  const handleBackward = (e) => {
    setCurrent({parentId: e.target.getAttribute('folderid') ? parseInt(e.target.getAttribute('folderid')) : null, level: parseInt(e.target.getAttribute('level'))});
    setBreadcrum(prev => {return prev.slice(0, 1 + parseInt(e.target.getAttribute('level')))});
  }

  const [current, setCurrent] = useState({parentId: null, level: 0});
  const [breadcrum, setBreadcrum] = useState([{title: <Typography.Link style={{fontSize: 18}} folderid={null} level={0} onClick={handleBackward}><HomeOutlined /> Thư mục của bạn</Typography.Link>}])

  const handleOpenModal = (type) => {
    setOpen(true)
    setFileType(type)
  }

  const handleOpenFolderModal = () => {
    setNewFolderOpen(true);
  }

  const items=[
    {
      label:<span onClick={() => {handleOpenModal('.pdf')}}><FilePdfOutlined/> Tải lên file pdf</span>,
      key: 'upload file pdf'
    },
    {
      label:<span onClick={() => {handleOpenModal('.docx, .doc')}}><FileWordOutlined/> Tải lên file word</span>,
      key: 'upload file word'
    },
    {
      label:<span onClick={() => {handleOpenModal('.xlsx, .xls')}}><FileExcelOutlined/> Tải lên file excel</span>,
      key: 'upload file excel'
    },
    {
      label:<span onClick={() => {handleOpenModal('.pptx, .ppt')}}><FilePptOutlined/>Tải lên file powerpoint</span>,
      key: 'upload file powerpoint'
    },
    {
      label: <span onClick={handleOpenFolderModal}>Create folder</span>,
      key: 'create folder'
    }
  ]

  const handleFoward = (folderId, folderName)=>{
    setCurrent({parentId: parseInt(folderId), level: parseInt(current.level) + 1});
    setBreadcrum(prev =>
      {return [...prev, {title: <Typography.Link style={{fontSize: 18}} folderid={folderId} level={current.level + 1} onClick={handleBackward}>{folderName}</Typography.Link>}]}
    );
  }

  useEffect(() => {
    const getDocs = async () => {
      try {
        const data = await myDocuments(current.parentId, selectedMenu === 'marked' ? true : null, selectedMenu === 'deleted' ? true : null);
        setDocuments(data.data);
        if (data.success === 0) {
          throw new Error(data.message);
        }
      } catch (err) {
        toast.error(err.message);
      }
    }
    getDocs();
  }, [authUser, JSON.stringify(current)]);

  useEffect(() => {
    if(!authUser) {
      navigate('/auth/login')
    }
  }, [JSON.stringify(authUser)]);

  useEffect(() => {
    setBreadcrum([{title: <Typography.Link style={{fontSize: 18}} folderid={null} level={0} onClick={handleBackward}><HomeOutlined /> Thư mục của bạn</Typography.Link>}]);
    const getDocs = async () => {
      const data = await myDocuments(null, selectedMenu === 'marked' ? true : null, selectedMenu === 'deleted' ? true : null);
      setDocuments(data.data);
    }
    getDocs();
  }, [authUser, selectedMenu]);

  return (
    <div id="my-documents">
      <UploadDocument open={open} setOpen={setOpen} parentId={current.parentId} fileType={fileType}/>
      <AddFolderModal open={newFolderOpen} setOpen={setNewFolderOpen} parentId={current.parentId}/>
      <Dropdown trigger={["contextMenu"]} menu={{items}}>
      <Row className='me' gutter={0}>
        <Col className='sidebar' span={3}>
          <SideBar setSelectedMenu={setSelectedMenu} setBreadcrum={setBreadcrum} handleBackward={handleBackward}/>
        </Col>
        <Col className='documents' span={21} style={{borderRadius: 10}}>
          <div style={{marginLeft: 10}}>
          <Breadcrumb style={{marginBottom: 50}} items={breadcrum}/>
          <SearchBar loading={loading} setLoading={setLoading} setDocuments={setDocuments} documents={documents}/>
          <div className='folders'>
            <h2>Folders</h2>
            <Row gutter={[16, 16]} className="result">
              {documents?.folders.map((folder) => (
                <Col span={4} key={folder.id}>
                  <div onDoubleClick={()=>{
                    handleFoward(folder.id, folder.name)
                  }}>
                    <Folder folder={folder}/>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          <div className='files'>
          <h2>Files</h2>
          <Row gutter={[16, 16]} className="result">
              {documents?.files.map((document) => (
                <Col span={4} key={document.id}>
                  <div>
                  {<Thumbnail file={document}/>}
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          </div>
        </Col>
      </Row>
      </Dropdown>
    </div>
  )
}

export default Me
