import { useDispatch, useSelector } from "react-redux";
import DeleteButton from "../common/DeleteButton";
import DownloadButton from "../common/DownloadButton";
import DeleteIcon from "../icons/DeleteIcon";
import PdfIcon from "../icons/PdfIcon";
import { deleteLeadDocument } from "../../features/lead-documents/leadDocumentsThunks";
import { useState } from "react";
import moment from "moment";

function DocumentCard({ document, setOpenToast }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { lead } = useSelector((state) => state.leads);
  const [showTooltip, setShowTooltip] = useState(false);

  function handleDocumentDelete(documentId, document) {
    try {
      setOpenToast(true);
      dispatch(
        deleteLeadDocument({
          lead_document_id: documentId,
          file: document,
          userId: user.user.id,
          lead_name: lead.name,
        })
      );
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  }

  return (
    <div className="w-full h-[116px] relative">
      <div className="w-[220px] h-[116px] left-0 top-0 absolute bg-[#E9F3FF] rounded-2xl border border-[#464646]" />
      <div className="w-[140.27px] h-[46px] left-[40px] top-[10px] absolute">
        <PdfIcon />
        <div 
          className="w-[91px] h-[46px] left-[49.27px] top-0 absolute"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="left-0 top-[29px] absolute text-[#464646] text-[10px] font-medium poppins-thin leading-tight">
            {moment(document.createdAt)
              .utcOffset(330)
              .format("DD/MM/YY hh:mm a")}
          </div>
          <div 
            className="left-0 top-[3px] absolute text-[#214768] text-[10px] font-semibold poppins-thin leading-tight"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '91px',
              height: '28px',
              lineHeight: '14px'
            }}
          >
            {document.document_name}
          </div>
          {showTooltip && (
            <div 
              style={{
                position: 'absolute',
                top: '30px',
                left: '0',
                backgroundColor: '#F4EBFF',
                border: '1px solid #32086D',
                borderRadius: '10px',
                padding: '6px 8px',
                zIndex: 10,
                width: 'max-content',
                // maxWidth: '200px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              <span style={{
                color: '#4300A0',
                fontSize: '10px',
                fontWeight: '500'
              }}>
                {document.document_name}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="w-[139px] h-[30px] left-[20px] top-[76px] absolute">
        <DownloadButton
          onClick={() => window.open(document.document_url, "_blank")}
        />
      </div>
      <div
        className="w-[30px] h-[30px] left-[170px] top-[76px] absolute flex items-center justify-center rounded-[5px] cursor-pointer"
        onClick={() => handleDocumentDelete(document.id, document)}
      >
        <DeleteIcon color="#464646" />
      </div>
    </div>
  );
}

export default DocumentCard;