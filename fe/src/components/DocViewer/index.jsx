import React, { useEffect, useState } from 'react'
import {DocumentEditorContainerComponent, Toolbar, Inject} from '@syncfusion/ej2-react-documenteditor'
import {SaveOutlined} from '@ant-design/icons'
import './index.scss'
import axios from 'axios'
import { saveDocument } from '../../services/documents'

function DocViewer({id, url, name}) {
  let container;
  const [initFile, setInitFile] = useState();
  useEffect(() => {
    const handleUpload = async () => {
      const docx = await axios.get(url, {responseType: 'blob' })
      const formData = new FormData();
      formData.append('file', docx.data, {
        filename: name, // Specify the desired file name
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // Set the content type for DOCX
      });

      const sfdt = await axios.post('https://services.syncfusion.com/react/production/api/documenteditor/Import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      container.documentEditor.open(sfdt.data)
      const blob = await container.documentEditor.saveAsBlob('Docx')
      setInitFile(new File([blob], name, { type: blob.type }))
    };
    handleUpload();
  }, [id, url, name]);

  let toolItem = {
    prefixIcon: "e-de-ctnr-lock",
    tooltipText: "Save",
    text: "Save",
    id: "Save"
  };

  let items = [
    toolItem,
    "Undo",
    "Redo",
    "Separator",
    "Image",
    "Table",
    "Hyperlink",
    "Bookmark",
    "Comments",
    "TableOfContents",
    "Separator",
    "Header",
    "Footer",
    "PageSetup",
    "PageNumber",
    "Break",
    "Separator",
    "Find",
    "Separator",
  ];

  const onToolbarClick = async (args) => {
    if(args.item.id === "Save") {
        const savedDocument = await container.documentEditor.saveAsBlob('Docx');
        const newFile = new File([savedDocument], name, { type: savedDocument.type })
        console.log(newFile)
        const check = await compareFiles(initFile, newFile)
        if(!check) {
          const formData = new FormData()
          formData.append("file", newFile)
          await saveDocument(id, formData)
        } else {
          alert("File không có thay đổi")
        }
        console.log(savedDocument)
    }
  };

  function compareFiles(file1, file2) {
    const CHUNK_SIZE = 1024 * 1024; // Kích thước chunk, ví dụ: 1MB

    // Đọc và so sánh nội dung theo chunks
    function compareChunks(offset) {
        return Promise.all([
            readChunk(file1, offset, CHUNK_SIZE),
            readChunk(file2, offset, CHUNK_SIZE)
        ]).then(([chunk1, chunk2]) => {
            // So sánh nội dung của hai chunks
            if (chunk1 === null && chunk2 === null) {
                return true; // Đã đọc hết file và không tìm thấy sự khác biệt
            } else if (chunk1 === null || chunk2 === null) {
                return false; // Một trong hai chunk null, chỉ một file đã đọc hết
            } else if (chunk1.byteLength !== chunk2.byteLength) {
                return false; // Độ dài của hai chunk khác nhau
            } else {
                // So sánh từng byte của hai chunk
                const arr1 = new Uint8Array(chunk1);
                const arr2 = new Uint8Array(chunk2);
                for (let i = 0; i < arr1.length; i++) {
                    if (arr1[i] !== arr2[i]) {
                        return false; // Tìm thấy byte khác nhau
                    }
                }
                // Tiếp tục so sánh với chunk tiếp theo
                return compareChunks(offset + CHUNK_SIZE);
            }
        });
      }

      // Bắt đầu so sánh từ offset = 0
      return compareChunks(0);
  }

  // Đọc một phần (chunk) của tệp từ offset cho đến khi kết thúc hoặc đọc đủ CHUNK_SIZE
  function readChunk(file, offset, length) {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
              const chunk = event.target.result;
              resolve(chunk);
          };
          reader.onerror = (error) => {
              reject(error);
          };
          const blob = file.slice(offset, offset + length);
          reader.readAsArrayBuffer(blob);
      });
  }

  return (
    <div>
      <DocumentEditorContainerComponent height='100vh' enableComment={true} ref={(scope) => { container = scope; }}
        serviceUrl='https://ej2services.syncfusion.com/production/web-services/api/documenteditor/'
        toolbarItems={items}
        toolbarClick={async (args) => {await onToolbarClick(args)}}
      >
        <Inject services={[Toolbar]}/>
      </DocumentEditorContainerComponent>
    </div>
  )
}

export default DocViewer
