import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './index.scss'
import {Row, Col, Button} from 'antd'
import { AuthContext } from '../../providers/AuthProvider'
import { useContext } from 'react'

function Navbar({items}) {
  const {authUser, setAuthUser} = useContext(AuthContext)
  const handleLogout = () => {
    setAuthUser(null)
    localStorage.clear();
  }

  return (
    <Row className='navbar'>
      <Col className='link' span={16}>
        {items.map((element) => {
          return (<Link to={element.path} key={element.name}>{element.name}</Link>)
        })}
      </Col>
      <Col className='auth' span={8}>
        {
          authUser ?
          (<Link to="/">
            <Button className='button' type='primary' onClick={handleLogout}>
              Log out
            </Button>
          </Link>) : (
            <>
              <Link to="/auth/login">
                <Button className='button' type='primary'>
                  Login
                </Button>
              </Link>
              <Link to="/auth/signup">
                <Button className='button'>
                  Signup
                </Button>
              </Link>
            </>
          )
        }
      </Col>
    </Row>
  )
}

Navbar.propTypes = {
  items: PropTypes.array.isRequired,
};

export default Navbar
