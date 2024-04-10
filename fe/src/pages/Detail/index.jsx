import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import PdfViewer from "../../components/PdfViewer";
import DocViewer from "../../components/DocViewer";
import ExcelViewer from "../../components/ExcelViewer";
import { getContent, } from "../../services/documents";

function Detail() {
  const { id } = useParams();
  const [document, setDocument] = useState();
  console.log(id);
  useEffect(() => {
    const getData = async () => {
      const response = await getContent(id);
      const data = response.data;
      setDocument({ url: data.url, name: data.name });
    };
    getData();
  }, [id]);
  let content = null;
  if (document) {
    switch (document.name.split(".").pop()) {
      case "pdf":
        content = <PdfViewer id={id} url={document.url} name={document.name} />;
        break;
      case "docx":
      case "doc":
        content = <DocViewer id={id} url={document.url} name={document.name} />;
        break;
      case "xlsx":
      case "xls":
        content = <ExcelViewer id={id} url={document.url} name={document.name} />;
        break;
      default:
        content = null;
    }
  }
  return <div>{content}</div>;
}

export default Detail;
