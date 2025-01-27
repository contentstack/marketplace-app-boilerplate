import React, { useCallback, useEffect, useState } from "react";
// import localeTexts from "../../common/locales/en-us/index";
// import parse from "html-react-parser";
import { useAppConfig } from "../../common/hooks/useAppConfig";
import "../index.css";
import "./CustomField.css";
import PortableTextEditor from "../../components/PortableTextEditor";
import { useAppSdk } from "../../common/hooks/useAppSdk";
// import Icon from "../../assets/Custom-Field-Logo.svg";
// import ReadOnly from "../../assets/lock.svg";
// import JsonView from "../../assets/JsonView.svg";
// import ConfigModal from "../../components/ConfigModal/ConfigModal";
// import PortableTextEditor from "../../components/PortableTextEditor";

const CustomFieldExtension = () => {
  const appSdk = useAppSdk();

  return (
    <div>
      <PortableTextEditor
        initialValue={appSdk.location.CustomField.entry.getData().rich_content || "{}"}
        onChange={(value) => {
          appSdk.location.CustomField.field.setData(value);
        }}
      />
    </div>
  );
};

export default CustomFieldExtension;
