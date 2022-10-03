import { useCallback, useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import { isEmpty, isNull } from "lodash";
import { useAppLocation } from "./useAppLocation";

/**
 * Getter and setter hook for custom field data
 * @return Array of [fieldData, setFieldDataFn, loadingState]
 *
 * const [data, setData, loading] = useCustomFieldData();
 */

export const customFieldAtom = atom<unknown>(null);

export const useCustomField = (defaultValue: unknown): [typeof defaultValue, Function, boolean] => {
  const [loading, setLoading] = useState<boolean>(false);
  const [customField, setCustomField] = useAtom(customFieldAtom);
  const { locationName, location } = useAppLocation();

  if (locationName !== "CustomField") {
    throw new Error(`useCustomField hook cannot be called inside ${locationName} location`);
  }

  useEffect(() => {
    (async () => {
      // check if the data was loaded earlier or not
      if (isEmpty(customField)) {
        setLoading(true);
        let fieldData = await (location.field.getData() as Promise<typeof defaultValue>);
        setCustomField(fieldData);
        setLoading(false);
      }
    })();
  }, [setLoading, setCustomField, location, customField]);

  const setFieldData = useCallback(
    async (data: typeof defaultValue) => {
      setLoading(true);
      await location.field.setData(data);
      setCustomField(data);
      setLoading(false);
    },
    [location, setLoading, setCustomField]
  );

  return [isNull(customField) ? defaultValue : customField, setFieldData, loading];
};
