import React, { useContext, useState } from 'react'
import { Input, Row, Col, Typography} from 'antd';
import SpinLoading from '../../components/Loading/SpinLoading';
import './index.scss'
import { searchDocument } from '../../services/Search';
import {toast} from 'react-toastify'
import Thumbnail from '../../components/PDFViewer/Thumbnail';
import { AuthContext } from '../../providers/AuthProvider'
const { Search } = Input;
const { Title } = Typography

function Home() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [result, setResult] = useState([])
  const [loading, setLoading] = useState(false);
  const {authUser} = useContext(AuthContext)

  const handleSearch = async (page, per_page, query, params) => {
    try {
      setLoading(true); // Set loading to true before making the API call

      const response = await searchDocument(page, per_page, query, params);
      setResult(response.data.documents);
      console.log(response);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('An error occurred while fetching data.');
    } finally {
      setLoading(false); // Set loading to false after the API call completes, regardless of success or failure
    }
  };

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
            disabled={loading ? true : false}
          />
        </Col>
      </Row>
      {loading ? ( // Render a loading LoadingOutlinedner when loading is true
        <SpinLoading/>
      ) : (
        result.length > 0 && (
          <Row gutter={[16, 16]} className="result" style={{ marginLeft: '10%', marginRight: '10%'}}>
            {result.map((document) => (
              <Col span={6} key={document.id}>
                {<Thumbnail url={`https://storage.googleapis.com/kltn-1912/${authUser.id}/${document.meta.link}`} title={document.meta.title} key={document.meta.link} />}
              </Col>
            ))}
          </Row>
        )
      )}
    </div>
  )
}

export default Home
