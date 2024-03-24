import {FolderFilled, MoreOutlined} from '@ant-design/icons'
import './index.scss'
import { Dropdown, Popover } from 'antd'
import Options from '../Options'
import { useState } from 'react'
import Info from '../Info'

const More = ({openInfo, setOpenInfo, folder}) => (
  <Popover onContextMenu={e => {e.stopPropagation()}} onClick={(e)=>{e.stopPropagation()}} onDoubleClick={(e)=>{e.stopPropagation()}}
    overlayInnerStyle={{padding: "0%"}}
    placement="right"
    content={<Options openInfo={openInfo} setOpenInfo={setOpenInfo} document={folder}/>}
    trigger="click" zIndex={20}><MoreOutlined />
  </Popover>
)

const Item = ({openInfo, setOpenInfo, folder}) =>(
  <Popover className='folder'
    overlayInnerStyle={{padding: "0%"}}
    placement='rightTop'
    content={<Options openInfo={openInfo} setOpenInfo={setOpenInfo} document={folder}/>}
    style={{cursor: "pointer"}}
    trigger={['contextMenu']}
    zIndex={20}>
    <p><FolderFilled /> {folder.name}</p>
    <div onContextMenu={e => {e.stopPropagation()}} onClick={(e)=>{e.stopPropagation()}} onDoubleClick={(e)=>{e.stopPropagation()}}>
      {<More openInfo={openInfo} setOpenInfo={setOpenInfo} folder={folder}/>}
    </div>
  </Popover>
)

function Folder({folder}) {
  const [openInfo, setOpenInfo] = useState(false);
  return (
    <div>
        <div onContextMenu={e => {e.stopPropagation()}} onClick={(e)=>{e.stopPropagation()}}>
          <div onContextMenu={e => {e.stopPropagation()}} onClick={(e)=>{e.stopPropagation()}} onDoubleClick={(e)=>{e.stopPropagation()}}>
            <Info open={openInfo} setOpen={setOpenInfo} id={folder.id}/>
          </div>
          <Item openInfo={openInfo} setOpenInfo={setOpenInfo} folder={folder}/>
        </div>
    </div>
  )
}

export default Folder
