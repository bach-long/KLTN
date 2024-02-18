import { FileTwoTone, DeleteTwoTone, StarTwoTone, FolderOpenTwoTone } from '@ant-design/icons'
import { Menu } from 'antd'

const Options = () => {
  const items = [
    {
     label: <span><FileTwoTone/> Xem chi tiết</span>,
     key: "detail"
    },
    {
     label: <span><DeleteTwoTone/> Xóa</span>,
     key: "delete"
    },
    {
     label: <span><StarTwoTone /> Tài liệu quan trọng</span>,
     key: "mark"
    },
    {
     label: <span><FolderOpenTwoTone /> Di chuyển</span>,
     key: "move"
    },
  ]
  return (
    <Menu className='options' items={items}/>
  )
}

export default Options
