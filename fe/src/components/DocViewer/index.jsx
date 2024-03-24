import React, { useEffect, useState } from 'react'
import {DocumentEditorContainerComponent, Toolbar, Inject} from '@syncfusion/ej2-react-documenteditor'
import './index.scss'
import axios from 'axios'

function DocViewer({url}) {
  let container;
  useEffect(() => {
    const handleUpload = async () => {
      const docx = await axios.get(url, {responseType: 'blob' })
      const formData = new FormData();
      formData.append('file', docx.data, {
        filename: 'file.docx', // Specify the desired file name
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // Set the content type for DOCX
      });

      const sfdt = await axios.post('https://services.syncfusion.com/react/production/api/documenteditor/Import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log(sfdt);
      container.documentEditor.open(sfdt.data)
    };
    handleUpload();
  }, [url]);

  return (
    <div>
      <DocumentEditorContainerComponent height='100vh' enableComment={true} ref={(scope) => { container = scope; }}
        serviceUrl='https://ej2services.syncfusion.com/production/web-services/api/documenteditor/'
      >
        <Inject services={[Toolbar]}/>
      </DocumentEditorContainerComponent>
    </div>
  )
}

export default DocViewer
