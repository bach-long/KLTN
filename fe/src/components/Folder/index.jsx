import {FolderFilled, MoreOutlined} from '@ant-design/icons'
import './index.scss'
import { Dropdown, Popover } from 'antd'
import Options from '../Options'
import { useState } from 'react'
import Info from '../Info'
import MovingMenu from '../MovingMenu'
import TrashOptions from '../TrashOptions'

const More = ({openInfo, setOpenInfo, folder, setFolder}) => {
  return (
  <Popover onContextMenu={e => {e.stopPropagation()}} onClick={(e)=>{e.stopPropagation()}} onDoubleClick={(e)=>{e.stopPropagation()}}
    overlayInnerStyle={{padding: "0%"}}
    placement="right"
    content={<Options openInfo={openInfo} setOpenInfo={setOpenInfo} document={folder} setDocument={setFolder}/>}
    trigger="click" zIndex={20}><MoreOutlined />
  </Popover>)
}

function Folder({folder}) {
  const [openInfo, setOpenInfo] = useState(false);
  const [openMove, setOpenMove] = useState(false);
  const [document, setDocument] = useState(folder);
  return (
    <div>
    <div onContextMenu={e => {e.stopPropagation()}} onClick={(e)=>{e.stopPropagation()}}>
      <div onContextMenu={e => {e.stopPropagation()}} onClick={(e)=>{e.stopPropagation()}} onDoubleClick={(e)=>{e.stopPropagation()}}>
        <Info open={openInfo} setOpen={setOpenInfo} id={document.id}/>
        <MovingMenu open={openMove} setOpen={setOpenMove} parentId={document.parent_id} id={document.id}/>
      </div>
      <Popover className='folder'
        overlayInnerStyle={{padding: "0%"}}
        placement='rightTop'
        content={folder.deleted_at ? <TrashOptions openInfo={openInfo} setOpenInfo={setOpenInfo} openMove={openMove} setOpenMove={setOpenMove} document={document} setDocument={setDocument}/> :
        <Options openInfo={openInfo} setOpenInfo={setOpenInfo} openMove={openMove} setOpenMove={setOpenMove} document={document} setDocument={setDocument}/>}
        style={{cursor: "pointer"}} trigger={['contextMenu']}
        zIndex={100}
      >
        <p><FolderFilled /> {document.name}</p>
        <div onContextMenu={e => {e.stopPropagation(); e.preventDefault();}} onClick={(e)=>{e.stopPropagation();}} onDoubleClick={(e)=>{e.stopPropagation()}}>
          <div onClick={(e) => {
          let parentElement = e.target.parentNode.parentNode.parentNode.parentNode;
          const newEvent = new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          parentElement.dispatchEvent(newEvent);}}><MoreOutlined style={{fontSize: 25, fontWeight: 600}}/></div>
        </div>
      </Popover>
    </div>
  </div>
  )
}

export default Folder
