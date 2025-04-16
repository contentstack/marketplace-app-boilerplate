import React, { useCallback, useState } from "react";
import "../index.css";
import "./CustomField.css";
import { useAppSdk } from "../../common/hooks/useAppSdk";
import { GenericObjectType } from "@contentstack/app-sdk/dist/src/types/common.types";

const CustomFieldExtension = () => {
  const appSdk = useAppSdk();
  const [draftData, setDraftData] = useState<GenericObjectType | undefined>();

  const handleFetchDraft = useCallback(async () => {
    const data = await appSdk?.location?.CustomField?.entry.getDraftData();
    setDraftData(data);
  }, [appSdk]);

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}>
      <h2 style={{ margin: 0 }}>Entry Draft Fetcher</h2>

      <button
        onClick={handleFetchDraft}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
          cursor: "pointer",
          backgroundColor: "#f8f8f8",
        }}>
        Get Draft Entry
      </button>

      {draftData && (
        <pre
          style={{
            textAlign: "left",
            padding: "6px",
            background: "#f4f4f4",
            borderRadius: "8px",
            maxHeight: "400px",
            overflowY: "auto",
            width: "100%",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontSize: "9px",
          }}>
          {JSON.stringify(draftData, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default CustomFieldExtension;
