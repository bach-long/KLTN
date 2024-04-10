import React, { useEffect } from 'react'
import './index.scss'
import {SpreadsheetComponent} from '@syncfusion/ej2-react-spreadsheet'
import axios from 'axios';
import { saveDocument } from '../../services/documents';
import {SaveOutlined} from '@ant-design/icons'

function ExcelViewer({id, url, name}) {
  let container;

  const onToolbarClick = async (args) => {
    console.log(await container.saveAsJson())
    // const savedDocument = await container.documentEditor.saveAsBlob('Docx');
    // const newFile = new File([savedDocument], name, { type: savedDocument.type })
    // console.log(newFile)
    // const check = true // await compareFiles(initFile, newFile)
    // if(!check) {
    //   const formData = new FormData()
    //   formData.append("file", newFile)
    //   await saveDocument(id, formData)
    // } else {
    //   alert("File không có thay đổi")
    // }
    // console.log(savedDocument)
  };

  const onCreated = () => {
    container?.addToolbarItems("Home", [
      { type: "Separator" },
      { text: "Save", tooltipText: "Save", prefixIcon: "e-de-ctnr-lock", click: async () => {await onToolbarClick()}},
    ], 0)
  };

  useEffect(() => {
    const fetchFile= async () =>{
      const excel = await axios.get(url, { responseType: 'blob' })
        const formData = new FormData();
        formData.append('file', excel.data, {
          filename: 'file.xlxs', // Specify the desired file name
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // Set the content type for excel
        });

      container.open({file: new File([excel.data], "Sample.xlsx")});
    };

    fetchFile()
  }, [url]);


  return (
    <div>
      <SpreadsheetComponent ref={(scope) => {container = scope}} created={onCreated} height='90vh'
        openUrl='https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open'
        saveUrl='https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save'

      ></SpreadsheetComponent>
    </div>
  )
}

export default ExcelViewer;
