import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
  ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject} from '@syncfusion/ej2-react-pdfviewer';
import './index.scss'
import TitleHeader from '../TitleHeader';

  PdfViewerComponent.Inject(Toolbar)
function PdfViewer({url, id, name}) {
  return (
    <div className='pdf-viewer'>
      <TitleHeader name={name} type={'pdf'}/>
      <PdfViewerComponent
        height='95%'
        id="container"
        documentPath={url}
        resourceUrl="https://cdn.syncfusion.com/ej2/23.1.40/dist/ej2-pdfviewer-lib"
        style={{ 'height': '640px' }}>

         <Inject services={[ Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView,
                             ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner ]}/>

      </PdfViewerComponent>
    </div>
  )
}

export default PdfViewer
