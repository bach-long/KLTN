import { FolderFilled, MoreOutlined } from "@ant-design/icons";
import "./index.scss";
import { Dropdown, Popover, Tooltip } from "antd";
import Options from "../Options";
import { useState } from "react";
import Info from "../Info";
import MovingMenu from "../MovingMenu";
import TrashOptions from "../TrashOptions";
import ChangeNameModal from "../../components/ChangeNameModal";

const More = ({ openInfo, setOpenInfo, folder, setFolder }) => {
  return (
    <Popover
      onContextMenu={(e) => {
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
      }}
      overlayInnerStyle={{ padding: "0%" }}
      placement="right"
      content={
        <Options
          openInfo={openInfo}
          setOpenInfo={setOpenInfo}
          document={folder}
          setDocument={setFolder}
        />
      }
      trigger="click"
      zIndex={20}
    >
      <MoreOutlined />
    </Popover>
  );
};

function Folder({ folder, setDocuments, selectedMenu, current }) {
  const [openInfo, setOpenInfo] = useState(false);
  const [openMove, setOpenMove] = useState(false);
  const [document, setDocument] = useState(folder);
  const [changeNameOpen, setChangeNameOpen] = useState(false);
  return (
    <div>
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
          <Info open={openInfo} setOpen={setOpenInfo} id={document.id} />
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
          className="folder"
          overlayInnerStyle={{ padding: "0%" }}
          placement="rightTop"
          content={
            folder.deleted_at ? (
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
            <p>
              <FolderFilled /> {document.name}
            </p>
            <div
              onContextMenu={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div
                onClick={(e) => {
                  let parentElement =
                    e.target.parentNode.parentNode.parentNode.parentNode;
                  const newEvent = new MouseEvent("contextmenu", {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                  });
                  parentElement.dispatchEvent(newEvent);
                }}
              >
                <MoreOutlined style={{ fontSize: 25, fontWeight: 600 }} />
              </div>
            </div>
          </Tooltip>
        </Popover>
      </div>
    </div>
  );
}

export default Folder;
