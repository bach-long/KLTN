import pageThumbnailPlugin from './pageThumbnailPlugin';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import PropTypes from 'prop-types';
import { Viewer } from '@react-pdf-viewer/core';
import './thumbnail.scss'

const Thumbnail = ({url, title}) => {
  const thumbnailPluginInstance = thumbnailPlugin();
  const { Cover } = thumbnailPluginInstance;

  const pageThumbnailPluginInstance = pageThumbnailPlugin({
      PageThumbnail: <Cover getPageIndex={() => 0} width={220} />,
  });

  return (
    <div className='item'>
      <Viewer fileUrl={url} plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]} />
      <p>{title}</p>
    </div>)
}

Thumbnail.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

export default Thumbnail;
