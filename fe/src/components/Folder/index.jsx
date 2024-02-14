import {FolderFilled, MoreOutlined} from '@ant-design/icons'
import './index.scss'
import { Popover } from 'antd'
import Options from '../Options'

function Folder({folder}) {
  return (
    <div className='folder' style={{cursor: "pointer"}}>
      <p><FolderFilled /> {folder.name}</p>
      <Popover placement="right" title="tùy chọn" content={Options} trigger="click"><MoreOutlined /></Popover>
    </div>
  )
}

export default Folder
