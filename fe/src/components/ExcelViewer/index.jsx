import React, { useEffect } from 'react'
import './index.scss'
import {SpreadsheetComponent} from '@syncfusion/ej2-react-spreadsheet'
import axios from 'axios';

function ExcelViewer({url}) {
  let container;
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
      <SpreadsheetComponent ref={(scope) => {container = scope}} height='90vh'
        openUrl='https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open'
        saveUrl='https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save'
      ></SpreadsheetComponent>
    </div>
  )
}

export default ExcelViewer;
