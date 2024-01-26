import React, { useState } from 'react'
import { Input, Row, Col, Typography} from 'antd';
import './index.scss'
import { searchDocument } from '../../services/Search';
import {toast} from 'react-toastify'
import Thumbnail from '../../components/PDFViewer/Thumbnail';
const { Search } = Input;
const { Title } = Typography

function Home() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [result, setResult] = useState([])

  const handleSearch = async (page, per_page, query, params) => {
    const response = await searchDocument(page, per_page, query, params);
    setResult(response.data.documents);
    console.log(response);
  }

  return (
    <div id="home">
      <Row className="search-bar">
        <Col span={8} offset={8} className="welcome">
          Tìm Kiếm Tài Liệu
        </Col>
      </Row>
      <Row className="search-bar">
        <Col span={10} offset={7}>
          <Search
            placeholder="Tìm kiếm"
            onSearch={(value) => {return handleSearch({page, perPage, query: value, params: {filter: {title: ''}}})}}
            enterButton
            allowClear
            size="large"
          />
        </Col>
      </Row>
      {result.length > 0 && <Row gutter={[16, 16]} className='result' style={{display: 'flex', justifyContent: 'center'}}>
        {result.map(document => (
          <Col span={4} key={document.id}>
              {<Thumbnail url={`http://localhost:8000/static/${document.meta.link}`} title={document.meta.title} key={document.meta.link}/>}
          </Col>)
        )}
      </Row>}
    </div>
  )
}

export default Home
