import React from 'react'
import Navbar from '../../components/Navbar'
import PropTypes from 'prop-types'

function HomeLayout(props) {
  return (
    <div>
      <Navbar items={props.items}/>
      <div>{props.children}</div>
    </div>
  )
}

HomeLayout.propTypes = {
  children: PropTypes.node.isRequired,
  items: PropTypes.array.isRequired,
  // other prop types...
};

export default HomeLayout
