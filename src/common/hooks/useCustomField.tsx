import { useContext } from "react";
import { CustomFieldExtensionContext, CustomFieldExtensionContextType } from "../contexts/customFieldExtensionContext";

/**
 * Getter and setter hook for custom field data
 * @return Array of [fieldData, setFieldDataFn, loadingState]
 *
 * const [data, setData, loading] = useCustomFieldData();
 */
export const useCustomField = () => {
  const { customField, setFieldData, loading } = useContext(
    CustomFieldExtensionContext
  ) as CustomFieldExtensionContextType;

  return { customField, setFieldData, loading };
};
