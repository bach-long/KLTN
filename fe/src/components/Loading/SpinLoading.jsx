import React from 'react'
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

function SpinLoading({size}) {
  return (
    <Spin
      style={{display: 'flex', justifyContent: 'center', marginTop: '5%'}}
      indicator={
        <LoadingOutlined
          style={{
            fontSize: size ? size : '10rem',
          }}
          spin
        />
      }
    />
  )
}

export default SpinLoading
