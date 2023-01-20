import { useCallback, useEffect, useState } from "react";
import { useAppLocation } from "../hooks/useAppLocation";
import { isEmpty } from "lodash";
import { CustomFieldExtensionContext } from "../contexts/customFieldExtensionContext";

export const CustomFieldExtensionProvider = ({ children }: any) => {
  const [customField, setCustomField] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { locationName, location } = useAppLocation();

  if (locationName !== "CustomField") {
    throw new Error(`useCustomField hook cannot be called inside ${locationName} location`);
  }

  useEffect(() => {
    (async () => {
      // check if the data was loaded earlier or not
      if (isEmpty(customField)) {
        setLoading(true);
        let fieldData = await location.field.getData();
        setCustomField(fieldData);
        setLoading(false);
      }
    })();
  }, [setLoading, setCustomField, location, customField]);

  const setFieldData = useCallback(
    async (data: any) => {
      setLoading(true);
      await location.field.setData(data);
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
