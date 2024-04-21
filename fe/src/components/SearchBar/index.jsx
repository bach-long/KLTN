import React, { useContext, useState } from 'react'
import { Input, Row, Col, Typography, Modal, Button} from 'antd';
import SpinLoading from '../Loading/SpinLoading';
import './index.scss'
import { searchDocument } from '../../services/Search';
import {toast} from 'react-toastify'
import Thumbnail from '../PDFViewer/Thumbnail';
import { AuthContext } from '../../providers/AuthProvider'
import { SearchOutlined } from '@ant-design/icons';
import TypeSelector from '../TypeSelector';
import DateSelector from '../DateSelector';
const { Search } = Input;
const { Title } = Typography

function SearchBar() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [result, setResult] = useState([])
  const [loading, setLoading] = useState(false);
  const {authUser} = useContext(AuthContext);
  const [openSearch, setOpenSearch] = useState(false);
  const [date, setDate] = useState()
  const [type, setType] = useState();

  const handleSearchClick = async (query) => {
    const check = await handleSearch(page, perPage, query, {filter: {title: ''}, type: type,
      start: date && date.dateString[0] ? date.dateString[0] : null, end: date && date.dateString[1] ? date.dateString[1] : null});
    if (check) {
      if (!openSearch) {
        setOpenSearch(true);
      }
    }
  }

  const handleSearch = async (page, per_page, query, params) => {
    try {
      if(!query || query.trim() === '') {
        throw new Error("Hãy điền từ khóa")
      }
      setLoading(true); // Set loading to true before making the API call
      const response = await searchDocument(page, per_page, query, params);
      setResult(response.data.documents);
      toast.success("Tìm kiếm thành công");
      return true;
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false); // Set loading to false after the API call completes, regardless of success or failure
    }
  };

  return (
    <div id="home">
      <Row className="search-bar">
        <Button type='primary' onClick={() => {setOpenSearch(true)}}><SearchOutlined />Tìm kiếm </Button>
      </Row>
      <Modal
        centered
        open={openSearch}
        onCancel={()=>{
          setOpenSearch(false);
          setType();
          setDate();
          setResult([]);
        }}
        width={"90vw"}
        footer={null}
        zIndex={100}
      >
        <div id="search-modal">
        <Row className="search-bar" style={{marginBottom: 40}}>
          <Col span={10} offset={7}>
            <Search
              placeholder="Tìm kiếm"
              onSearch={handleSearchClick}
              enterButton
              allowClear
              size="large"
              disabled={loading ? true : false}
            />
            <TypeSelector type={type} setType={setType}/>
            <DateSelector date={date} setDate={setDate}/>
          </Col>
        </Row>
        {loading ? ( // Render a loading LoadingOutlinedner when loading is true
          <SpinLoading/>
        ) : (
          result.length > 0 && (
            <div id="search-result">
              <Row gutter={[16, 16]} className="result" style={{ marginLeft: '2%', marginRight: '2%'}}>
                {result.map((document) => (
                  <Col span={4} key={document.id}>
                    {<Thumbnail file={document}/>}
                  </Col>
                ))}
              </Row>
            </div>
          )
        )}
        </div>
      </Modal>
    </div>
  )
}

export default SearchBar
