import pageThumbnailPlugin from './pageThumbnailPlugin';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import PropTypes from 'prop-types';
import { Viewer } from '@react-pdf-viewer/core';
import { Popover } from 'antd';
import './thumbnail.scss'
import Options from '../Options';

const Thumbnail = ({url, title}) => {
  const thumbnailPluginInstance = thumbnailPlugin();
  const { Cover } = thumbnailPluginInstance;

  const pageThumbnailPluginInstance = pageThumbnailPlugin({
      PageThumbnail: <Cover getPageIndex={() => 0} width={250} />,
  });

  return (
    <Popover onContextMenu={e => {e.stopPropagation()}} className='item' placement='rightTop' title={<div>Tùy chọn</div>} content={Options} style={{cursor: "pointer"}} trigger={['contextMenu']}>
      <Viewer fileUrl={url} plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]}/>
      <p>{title}</p>
    </Popover>)
}

Thumbnail.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

export default Thumbnail;
