import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import PdfViewer from '../../components/PdfViewer';
import DocViewer from '../../components/DocViewer';
import ExcelViewer from '../../components/ExcelViewer';


function Detail() {
  const {id} = useParams();
  const {state} = useLocation();
  console.log(id, state.url);
  let content = null
  switch (id.split('.').pop()) {
    case "pdf":
      content = <PdfViewer url={state.url}/>
      break;
    case "docx":
    case "doc":
      content = <DocViewer url={state.url}/>
      break;
    case "xlsx":
    case "xls":
      content = <ExcelViewer url={state.url}/>
      break;
    default:
      content = null
  }
  return (
    <div>
      {content}
    </div>
  )
}

export default Detail
