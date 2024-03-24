import pageThumbnailPlugin from './pageThumbnailPlugin';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import PropTypes from 'prop-types';
import { Viewer } from '@react-pdf-viewer/core';
import { Popover } from 'antd';
import './thumbnail.scss'
import { FilePdfTwoTone, FilePptTwoTone, FileWordTwoTone, FileExcelTwoTone, FolderTwoTone } from '@ant-design/icons'
import Options from '../Options';
import { useState } from 'react';
import Info from '../Info';

const Thumbnail = ({file}) => {
  // const thumbnailPluginInstance = thumbnailPlugin();
  // const { Cover } = thumbnailPluginInstance;

  const [openInfo, setOpenInfo] = useState(false);
  const {url, name, id} = file;
  // const pageThumbnailPluginInstance = pageThumbnailPlugin({
  //     PageThumbnail: <Cover getPageIndex={() => 0} width={250} />,
  // });
  const style = {fontSize: '1150%', marginTop: 15};

  let thumbnail = <FolderTwoTone style = {style}/>

  const type = name.split('.').pop();
  if (type === 'pdf') {
    thumbnail = <FilePdfTwoTone style = {style}/>
  } else if (type === 'ppt' || type === 'pptx' ) {
    thumbnail = <FilePptTwoTone style = {style}/>
  } else if (type === 'docx' || type === 'doc') {
    thumbnail = <FileWordTwoTone style = {style}/>
  } else if (type === 'xlsx' || type === 'xls') {
    thumbnail = <FileExcelTwoTone style = {style}/>
  }

  return (
    <div className='thumbnail'>
      <div onContextMenu={e => {e.stopPropagation()}} onClick={(e)=>{e.stopPropagation()}}>
        <div onContextMenu={e => {e.stopPropagation()}} onClick={(e)=>{e.stopPropagation()}} onDoubleClick={(e)=>{e.stopPropagation()}}>
          <Info open={openInfo} setOpen={setOpenInfo} id={id} url={url}/>
        </div>
        <Popover
          overlayInnerStyle={{padding: "0%"}}
          className='item' placement='rightTop'
          content={<Options openInfo={openInfo} setOpenInfo={setOpenInfo} document={file}/>}
          style={{cursor: "pointer"}} trigger={['contextMenu']}
          zIndex={20}
        >
          {/* <Viewer fileUrl={url} plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]}/> */}
          {thumbnail}
          <p>{name}</p>
        </Popover>
      </div>
    </div>)
}

// Thumbnail.propTypes = {
//   url: PropTypes.string.isRequired,
//   name: PropTypes.string.isRequired,
//   id: PropTypes.number.isRequired
// }

export default Thumbnail;
