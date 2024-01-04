import React, { useCallback, useEffect, useState } from "react";
import { isEmpty } from "lodash";

import { useAppLocation } from "../hooks/useAppLocation";
import { CustomFieldExtensionContext } from "../contexts/customFieldExtensionContext";
import { ChildProp } from "../types/types";

export const CustomFieldExtensionProvider = ({ children }: ChildProp) => {
  const [customField, setCustomField] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { location } = useAppLocation();

  useEffect(() => {
    (async () => {
      // check if the data was loaded earlier or not
      if (isEmpty(customField) && location && 'field' in location) {
        setLoading(true);
        const fieldData = await location?.field.getData();
        setCustomField(fieldData);
        setLoading(false);
      }
    })();
  }, [setLoading, setCustomField, location, customField]);

  const setFieldData = useCallback(
    async (data: unknown) => {
      setLoading(true);
      if (location && 'field' in location) {
        location?.field.setData(data);
      }
      setCustomField(data);
      setLoading(false);
    },
    [location, setLoading, setCustomField]
  );

  return (
    <CustomFieldExtensionContext.Provider value={{ customField, setFieldData, loading }}>
      {children}
    </CustomFieldExtensionContext.Provider>
  );
};
