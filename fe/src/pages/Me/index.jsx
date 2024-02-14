import {useEffect, useState, useContext} from 'react'
import { AuthContext } from '../../providers/AuthProvider'
import { myDocuments } from '../../services/documents';
import Folder from '../../components/Folder';
import { Col, Row } from 'antd';
import './index.scss'
import Thumbnail from '../../components/PDFViewer/Thumbnail';

function Me() {
const [documents, setDocuments] = useState()
const {authUser} = useContext(AuthContext);

useEffect(() => {
  const getDocs = async () => {
    const data = await myDocuments();
    console.log(data.data);
    setDocuments(data.data);
  }
  getDocs();
}, [authUser]);


  return (
    <div className='me'>
      <div className='folders'>
        <h3>Folders</h3>
        <Row gutter={[16, 16]} className="documents" style={{ marginLeft: '10%', marginRight: '10%'}}>
          {documents?.folders.map((folder) => (
            <Col span={4} key={folder.name}>
              <Folder folder={folder}/>
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
    </div>
  )
}

export default Me
