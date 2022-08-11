import { useCustomField } from "../hooks/useCustomField";

const CustomFieldExtension = () => {
  const [data, setData] = useCustomField("");
  return (
    <div className="custom-field">
      <input
        placeholder={"Enter custom field"}
        type="text"
        value={data as string}
        onChange={({ target: { value } }) => setData(value)}
      />
    </div>
  );
};

export default CustomFieldExtension;
