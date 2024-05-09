import { Popover, Tooltip } from "antd";
import "./thumbnail.scss";
import {
  FilePdfTwoTone,
  FilePptTwoTone,
  FileWordTwoTone,
  FileExcelTwoTone,
  FolderTwoTone,
} from "@ant-design/icons";
import Options from "../Options";
import { useState } from "react";
import Info from "../Info";
import MovingMenu from "../MovingMenu";
import TrashOptions from "../TrashOptions";
import { Link } from "react-router-dom";
import ChangeNameModal from "../ChangeNameModal";

const Thumbnail = ({ file, setDocuments, selectedMenu, current }) => {
  const [openInfo, setOpenInfo] = useState(false);
  const [openMove, setOpenMove] = useState(false);
  const [document, setDocument] = useState(file);
  const [changeNameOpen, setChangeNameOpen] = useState(false);
  const { url, name, id, title } = document;
  const style = { fontSize: "1150%", marginTop: 15 };

  let thumbnail = <FolderTwoTone style={style} />;

  const type = name ? name.split(".").pop() : title.split(".").pop();
  if (type === "pdf") {
    thumbnail = <FilePdfTwoTone style={style} />;
  } else if (type === "ppt" || type === "pptx") {
    thumbnail = <FilePptTwoTone style={style} />;
  } else if (type === "docx" || type === "doc") {
    thumbnail = <FileWordTwoTone style={style} />;
  } else if (type === "xlsx" || type === "xls") {
    thumbnail = <FileExcelTwoTone style={style} />;
  }
  return (
    <Link
      className="thumbnail"
      to={document.deleted_at ? "#" : `/document/${document.id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div
        onContextMenu={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          onContextMenu={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Info open={openInfo} setOpen={setOpenInfo} id={id} url={url} />
          <MovingMenu
            open={openMove}
            setOpen={setOpenMove}
            parentId={document.parent_id}
            id={document.id}
            document={document}
            setCurrentDocuments={setDocuments}
            selectedMenu={selectedMenu}
            currentPosition={current}
          />
          <ChangeNameModal
            open={changeNameOpen}
            setOpen={setChangeNameOpen}
            document={document}
            setDocument={setDocument}
          />
        </div>
        <Popover
          overlayInnerStyle={{ padding: "0%" }}
          className="item"
          placement="rightTop"
          content={
            file.deleted_at ? (
              <TrashOptions
                document={document}
                setDocument={setDocument}
                setDocuments={setDocuments}
              />
            ) : (
              <Options
                setOpenInfo={setOpenInfo}
                setOpenMove={setOpenMove}
                setChangeNameOpen={setChangeNameOpen}
                document={document}
                setDocument={setDocument}
                setDocuments={setDocuments}
              />
            )
          }
          style={{ cursor: "pointer" }}
          trigger={["contextMenu"]}
          zIndex={100}
        >
          <Tooltip title={document.name}>
            {thumbnail}
            <p>{name ?? title}</p>
          </Tooltip>
        </Popover>
      </div>
    </Link>
  );
};

// Thumbnail.propTypes = {
//   url: PropTypes.string.isRequired,
//   name: PropTypes.string.isRequired,
//   id: PropTypes.number.isRequired
// }

export default Thumbnail;
