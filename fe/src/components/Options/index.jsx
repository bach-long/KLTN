import { FileOutlined, DeleteOutlined, StarOutlined, FolderOpenOutlined, StarFilled  } from '@ant-design/icons'
import { Menu } from 'antd'
import Info from '../Info'
import {Typography} from 'antd'

const Options = ({openInfo, setOpenInfo, document}) => {
  console.log(openInfo)
  const items = [
    {
     label: <Typography.Link onClick={() => {setOpenInfo(true);}}><FileOutlined/> Xem chi tiết</Typography.Link>,
     key: "detail"
    },
    {
     label: <Typography.Link><DeleteOutlined/> Xóa</Typography.Link>,
     key: "delete"
    },
    {
     label: document.marked ? <Typography.Link><StarFilled /> Hủy đánh dấu</Typography.Link> : <Typography.Link><StarOutlined /> Đánh dấu</Typography.Link>,
     key: "mark"
    },
    {
     label: <Typography.Link><FolderOpenOutlined /> Di chuyển</Typography.Link>,
     key: "move"
    },
  ]
  return (
    <div onContextMenu={e => {e.stopPropagation()}} onClick={(e)=>{e.stopPropagation()}} onDoubleClick={(e)=>{e.stopPropagation()}}>
      <Menu className='options' items={items}/>
    </div>
  )
}

export default Options
