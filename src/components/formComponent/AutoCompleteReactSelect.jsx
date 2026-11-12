import React, { useEffect, useState } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { useTranslation } from 'react-i18next';

export default function CustomAutoCompleteReactSelect({
  list = [],
  label = '',
  id = '',
  className = 'w-100',
  respclass,
  name,
  selectedvalue,
  handleChange
}) {
  const [filteredItems, setFilteredItems] = useState([]);
  const [value, setValue] = useState('');
  const [t] = useTranslation();

  useEffect(()=>{
    if(selectedvalue){
      const data  = list?.find((item) => item.value === selectedvalue?.value);
      setValue(data)
    }
  },[])


  const search = (event) => {
    if (event?.query?.length > 0) {
      const filtered = list.filter((item) => item.label?.toLowerCase().includes(event.query.toLowerCase()))
      setFilteredItems(filtered);
    } else {
      setFilteredItems(list);
    }
  };

  // Optional custom item template
  const itemTemplate = (item) => (
    <div style={{ fontSize: '13px' }}>{item.label}</div>
  );

  return (
       <div className={respclass}>
    <div className="form-group">
      <AutoComplete
        id={id}
        value={value?.label?value?.label:value}
        suggestions={filteredItems}
        completeMethod={search}
        onChange={(e) => {setValue(e.value);handleChange(name,e.value)}}
        itemTemplate={itemTemplate}
        className={className}
        // placeholder={placeholder}
      />
      <label
        className="label lable truncate ml-3 p-1"
        style={{ fontSize: "5px !important" }}
      >
        {t(label)}
      </label>
    </div>
    </div>
  );
}
