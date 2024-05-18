import React, { useEffect, useState } from "react";
import {
  DocumentEditorContainerComponent,
  Toolbar,
  Inject,
} from "@syncfusion/ej2-react-documenteditor";
import "./index.scss";
import axios from "axios";
import { saveDocument } from "../../services/documents";
import { AuthContext } from "../../providers/AuthProvider";
import { useContext } from "react";
import { toast } from "react-toastify";
import {
  showSpinner,
  hideSpinner,
  createSpinner,
} from "@syncfusion/ej2-popups";
import TitleHeader from "../TitleHeader";

function DocViewer({ id, url, name }) {
  const { authUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  let container;

  useEffect(() => {
    const handleUpload = async () => {
      const docx = await axios.get(url, { responseType: "blob" });
      const formData = new FormData();
      formData.append("file", docx.data, {
        filename: name, // Specify the desired file name
        contentType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Set the content type for DOCX
      });

      const sfdt = await axios.post(
        "https://services.syncfusion.com/react/production/api/documenteditor/Import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      container.documentEditor.open(sfdt.data);
      hideSpinner(document.getElementById("container"));
    };
    createSpinner({
      // Specify the target for the spinner to show
      target: document.getElementById("container"),
    });
    showSpinner(document.getElementById("container"));
    handleUpload();
  }, [id, url, name]);

  let toolItem = {
    prefixIcon: "e-de-ctnr-lock",
    tooltipText: "Save",
    text: "Save",
    id: "Save",
    disabled: loading ? true : false,
  };

  let items = [
    toolItem,
    "New",
    "Open",
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
    "Comments",
    "Separator",
  ];

  const onToolbarClick = async (args) => {
    try {
      if (args.item.id === "Save") {
        const savedDocument = await container.documentEditor.saveAsBlob("Docx");
        const newFile = new File([savedDocument], name, {
          type: savedDocument.type,
        });
        const formData = new FormData();
        formData.append("file", newFile);
        const response = await saveDocument(id, formData);
        setLoading(true);
        if (response.success) {
          toast.success("Lưu thành công");
        } else {
          throw new Error("Lưu thất bại");
        }
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  console.log(name);
  return (
    <div className="doc-viewer">
      <TitleHeader name={name} type={"doc"} />
      <DocumentEditorContainerComponent
        id="container"
        width="100vw"
        height="95%"
        title={name}
        enableComment={true}
        ref={(scope) => {
          container = scope;
        }}
        currentUser={authUser.username}
        serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
        toolbarItems={items}
        toolbarClick={async (args) => {
          await onToolbarClick(args);
        }}
      >
        <Inject services={[Toolbar]} />
      </DocumentEditorContainerComponent>
    </div>
  );
}

export default DocViewer;
