import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function Breadcrumb({path}) {
  const location = useLocation();
  const { GetMenuList } = useSelector((state) => state?.CommonSlice);
  const [name, setName] = useState('');
  const findChildByUrl = (menuArray, url) => {
    for (let menu of menuArray) {
      for (let child of menu.children) {
        if (child.url === url) {
          return child;
        }
      }
    }
    return null;
  };
  useEffect(() => {
    const result = findChildByUrl(GetMenuList, location?.pathname);
    setName(result?.breadcrumb)
  }, [GetMenuList?.length])

  return (
    <div className="pb-1 cursor-pointer font-weight-bold ml-1 mt-2 text-nowrap">
      <i className="fa fa-home" aria-hidden="true"></i>
     
      {path?path:name}
    </div>
  );
}
