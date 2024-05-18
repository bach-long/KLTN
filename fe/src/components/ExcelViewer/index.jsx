import React, { useEffect, useState } from "react";
import "./index.scss";
import {
  RangeDirective,
  RangesDirective,
  SheetDirective,
  SheetsDirective,
  SpreadsheetComponent,
} from "@syncfusion/ej2-react-spreadsheet";
import axios from "axios";
import { saveDocument } from "../../services/documents";
import { SaveOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import TitleHeader from "../TitleHeader";

function ExcelViewer({ id, url, name }) {
  const [loading, setLoading] = useState(false);
  let container;
  let savedAsBlob = false;
  const onCreated = () => {
    container.addToolbarItems(
      "Home",
      [
        { type: "Separator" },
        {
          text: "Save",
          tooltipText: "Save",
          prefixIcon: "e-de-ctnr-lock",
          click: () => {
            savedAsBlob = true;
            container.save();
          },
          disabled: loading ? true : false,
        },
      ],
      0
    );
  };

  const beforeSave = (args) => {
    if (savedAsBlob) {
      args.needBlobData = true; // To trigger the saveComplete event.
      args.isFullPost = false; // Get the spreadsheet data as blob data in the saveComplete event.
    }
  };

  const saveComplete = async (args) => {
    try {
      //This blob can be uploaded to your required server, database, or file path.
      console.log(args.blobData);
      const savedDocument = args.blobData;
      const newFile = new File([savedDocument], name, {
        type: savedDocument.type,
      });
      console.log(newFile);
      const formData = new FormData();
      formData.append("file", newFile);
      const response = await saveDocument(id, formData);
      setLoading(true);
      if (response.success) {
        toast.success("Lưu thành công");
      } else {
        throw new Error("Lưu thất bại");
      }
      savedAsBlob = false;
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFile = async () => {
      const excel = await axios.get(url, { responseType: "blob" });
      const formData = new FormData();
      formData.append("file", excel.data, {
        filename: "file.xlxs", // Specify the desired file name
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Set the content type for excel
      });

      container.open({ file: new File([excel.data], "Sample.xlsx") });
    };

    fetchFile();
  }, [url]);

  return (
    <div className="sheet-viewer">
      <TitleHeader name={name} type={"sheet"} />
      <SpreadsheetComponent
        ref={(scope) => {
          container = scope;
        }}
        created={onCreated}
        height="95%"
        beforeSave={beforeSave}
        saveComplete={async (args) => {
          await saveComplete(args);
        }}
        openUrl="https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open"
        saveUrl="https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save"
      >
        <SheetsDirective>
          <SheetDirective>
            <RangesDirective>
              <RangeDirective></RangeDirective>
            </RangesDirective>
          </SheetDirective>
        </SheetsDirective>
      </SpreadsheetComponent>
    </div>
  );
}

export default ExcelViewer;
