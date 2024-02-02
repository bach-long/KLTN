import React from 'react'
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

function SpinLoading() {
  return (
    <Spin
      style={{display: 'flex', justifyContent: 'center', marginTop: '5%'}}
      indicator={
        <LoadingOutlined
          style={{
            fontSize: '10rem',
          }}
          spin
        />
      }
    />
  )
}

export default SpinLoading
