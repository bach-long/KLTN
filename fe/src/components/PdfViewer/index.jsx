import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
  ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject} from '@syncfusion/ej2-react-pdfviewer';

  PdfViewerComponent.Inject(Toolbar)
function PdfViewer({url}) {
  return (
    <PdfViewerComponent
        height='100vh'
        id="container"
        documentPath={'https://cloud.bachnguyencoder.id.vn/s/B8rHcKsTbfMjkk3/download'}
        resourceUrl="https://cdn.syncfusion.com/ej2/23.1.40/dist/ej2-pdfviewer-lib"
        style={{ 'height': '640px' }}>

         <Inject services={[ Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView,
                             ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner ]}/>

      </PdfViewerComponent>
  )
}

export default PdfViewer
