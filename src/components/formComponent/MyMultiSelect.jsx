import { MultiSelect } from "primereact/multiselect";

const MyMultiSelect = () => {
  const items = Array.from({ length: 100000 }, (_, i) => ({
    label: `Item ${i + 1}`,
    value: i + 1,
  }));

  return (
    <MultiSelect
      value={[]}
      options={items}
      onChange={(e) => console.log(e.value)}
      virtualScroll
      virtualScrollItemSize={34}
      placeholder="Select Items"
    />
  );
};
export default MyMultiSelect;