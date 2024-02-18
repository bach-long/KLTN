import {FolderFilled, MoreOutlined} from '@ant-design/icons'
import './index.scss'
import { Dropdown, Popover } from 'antd'
import Options from '../Options'

function Folder({folder}) {
  return (
      <Popover className='folder'
        onContextMenu={e => {e.stopPropagation()}}
        placement='rightTop'
        title={<div>Tùy chọn</div>}
        content={Options}
        style={{cursor: "pointer"}}
        trigger={['contextMenu']}>
        <p><FolderFilled /> {folder.name}</p>
        <Popover onContextMenu={e => {e.stopPropagation()}} placement="right" title="tùy chọn" content={Options} trigger="click"><MoreOutlined /></Popover>
      </Popover>
  )
}

export default Folder
