import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import {
  BindStoreGroup,
  BindStoreItems,
  BindStoreSubCategory,
  SaveDepartmentWiseRack,
} from "../../../networkServices/InventoryApi";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { notify } from "../../../utils/utils";

const SetLowStock = () => {
  const [t] = useTranslation();
  const ip = useLocalStorage("ip", "get");
  const localData = useLocalStorage("userData", "get");
  const [payload, setPayload] = useState({
    categoryId: "",
    groupId: "",
    itemId: "",
    minLavel: "",
    maxLavel: "",
    Reorder: "",
    ReorderQty: "",
    rackname: "",
    selfname: "",
    subcategoryId: "",
    itemname: "",
  });

  useEffect(() => {
    console.log("Payload after", payload);
  }, [payload]);

  const [dropDownList, setDropDownList] = useState({
    bindcategory: [],
    bindgroup: [],
    binditem: [],
  });
  // const handleReactSelect = (name, value) => {
  //   console.log("Name", name, "Value", value);
  //   if (name === "groupId") {
  //     setPayload((prev) => {
  //       return {
  //         ...prev,
  //         itemname: value?.label,
  //         subcategoryId: value?.value,
  //       };
  //     });
  //   }
  //   setPayload((prev) => ({
  //     ...prev,
  //     [name]: value?.value,
  //   }));

  //   switch (name) {
  //     case "categoryId":
  //       getBindStoreSubCategory(value?.value);
  //       break;
  //     case "groupId":
  //       getBindStoreItems(value?.value);
  //       break;

  //     default:
  //       break;
  //   }
  // };

  const handleReactSelect = async (name, value) => {
    console.log("Selected:", name, value);

    let updatedPayload = { ...payload, [name]: value?.value };

    if (name === "groupId") {
      updatedPayload = {
        ...updatedPayload,
        itemname: value?.label, // Set itemname correctly
        subcategoryId: value?.value,
      };
    }

    setPayload(updatedPayload); // Update the state

    if (name === "categoryId") {
      getBindStoreSubCategory(value?.value);
    } else if (name === "groupId") {
      await getBindStoreItems(value?.value, updatedPayload.itemname); // Use updatedPayload.itemname
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };
  const getBindGroup = async () => {
    const DeptLedgerNo = localData?.deptLedgerNo;
    try {
      const response = await BindStoreGroup(DeptLedgerNo);
      setDropDownList((prevState) => ({
        ...prevState,
        bindcategory: response.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };
  const getBindStoreSubCategory = async (item) => {
    const CategoryID = item;
    try {
      const response = await BindStoreSubCategory(CategoryID);
      setDropDownList((prevState) => ({
        ...prevState,
        bindgroup: response.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };
  const getBindStoreItems = async (item, itemName) => { // Accept itemName as a parameter
    console.log("Fetching items for Subcategory:", item, "Item Name:", itemName);
    try {
        const response = await BindStoreItems(item, itemName); // Use itemName directly
        console.log("API Response:", response);

        setDropDownList((prevState) => ({
            ...prevState,
            binditem: Array.isArray(response?.data) ? response.data : [],
        }));
    } catch (error) {
        console.error("Error fetching store items:", error);
        setDropDownList((prevState) => ({
            ...prevState,
            binditem: [],
        }));
    }
};


  useEffect(() => {
    getBindGroup();
  }, []);


  const handleSubmit = async () => { 
  if (!payload?.categoryId) {
    notify("Please select the Category ID.", "error");
    return;
  }

  const requestBody = {
    item: [
      {
        maxlevel: Number(payload?.minLavel) || 0,
        minlevel: Number(payload?.maxLavel) || 0,
        reorderLevel: Number(payload?.Reorder) || 0,
        reorderQty: Number(payload?.ReorderQty) || 0,
        maxReorderQty: 3,
        minReorderQty: 1,
        majorUnit: "nos",
        minorUnit: "nos",
        conversionFactor: 1,
        rack: String(payload?.rackname) || "",
        shelf: String(payload?.selfname) || "",
        subcategoryid: Number(payload?.groupId) || 0,
        itemId: Number(payload?.itemId) || 0,
      },
    ],
    ipAddress: ip,
  };

  try {
    const response = await SaveDepartmentWiseRack(requestBody);
    if (response?.success) {
      notify(response?.message, "success");
      setPayload({
        categoryId: "",
        groupId: "",
        itemId: "",
        minLavel: "",
        maxLavel: "",
        Reorder: "",
        ReorderQty: "",
        rackname: "",
        selfname: "",
        subcategoryId: "",
        itemname: "",
      });
    } else {
      notify(response?.message, "error");
    }
  } catch (error) {
    console.error("Error saving data:", error);
    notify("An unexpected error occurred.", "error");
  }
};

  // const handleSubmit = async () => {
  //   const requestBody = {
  //     item: [
  //       {
  //         maxlevel: Number(payload?.minLavel) || 0,
  //         minlevel: Number(payload?.maxLavel) || 0,
  //         reorderLevel: Number(payload?.Reorder) || 0,
  //         reorderQty: Number(payload?.ReorderQty) || 0,
  //         maxReorderQty: 3,
  //         minReorderQty: 1,
  //         majorUnit: "nos",
  //         minorUnit: "nos",
  //         conversionFactor: 1,
  //         rack: String(payload?.rackname) || "",
  //         shelf: String(payload?.selfname) || "",
  //         subcategoryid: Number(payload?.groupId) || 0,
  //         itemId: Number(payload?.itemId) || 0,
  //       },
  //     ],
  //     ipAddress: ip,
  //   };

  //   try {
  //     const response = await SaveDepartmentWiseRack(requestBody);
  //     if (response?.success) {
  //       notify(response?.message, "success");
  //       setPayload({
  //         categoryId: "",
  //         groupId: "",
  //         itemId: "",
  //         minLavel: "",
  //         maxLavel: "",
  //         Reorder: "",
  //         ReorderQty: "",
  //         rackname: "",
  //         selfname: "",
  //         subcategoryId: "",
  //         itemname: "",
  //       });
        
  //     } else {
  //       notify(response?.message, "error");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching items:", error);
  //     return [];
  //   }
  // };

  console.log("binditem data:", dropDownList.binditem);

  // console.log(dropDownList);
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Category")}
            id={"categoryId"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name={"categoryId"}
            dynamicOptions={dropDownList?.bindcategory?.map((ele) => ({
              label: ele?.name,
              value: ele?.categoryID,
            }))}
            value={payload?.categoryId}
            handleChange={handleReactSelect}
            removeIsClearable={true}
          />
          <ReactSelect
            placeholderName={t("Group")}
            id={"groupId"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name={"groupId"}
            dynamicOptions={dropDownList?.bindgroup?.map((ele) => ({
              label: ele?.Name,
              value: ele?.SubCategoryID,
            }))}
            value={payload?.groupId}
            handleChange={handleReactSelect}
            removeIsClearable={true}
          />
          {/* {console.log("dropDownList", dropDownList)} */}
          <ReactSelect
            placeholderName={t("Item")}
            id={"itemId"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name={"itemId"}
            dynamicOptions={
              Array.isArray(dropDownList?.binditem)
                ? dropDownList?.binditem.slice(0, 200).map((ele) => ({
                    label: ele?.TypeName,
                    value: ele?.ItemID,
                  }))
                : []
            }
            value={payload?.itemId}
            handleChange={handleReactSelect}
            removeIsClearable={true}
          />
          <Input
            type="number"
            className="form-control"
            lable={t("Min. Level")}
            placeholder=" "
            id="minLavel"
            name="minLavel"
            onChange={handleChange}
            value={payload?.minLavel}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="number"
            className="form-control"
            lable={t("Max. Level")}
            placeholder=" "
            id="maxLavel"
            name="maxLavel"
            onChange={handleChange}
            value={payload?.maxLavel}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="number"
            className="form-control"
            lable={t("Reorder Level")}
            placeholder=" "
            id="Reorder"
            name="Reorder"
            onChange={handleChange}
            value={payload?.Reorder}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="number"
            className="form-control"
            lable={t("Reorder Qty.")}
            placeholder=" "
            id="ReorderQty"
            name="ReorderQty"
            onChange={handleChange}
            value={payload?.ReorderQty}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            lable={t("Rack Name")}
            placeholder=" "
            id="rackname"
            name="rackname"
            onChange={handleChange}
            value={payload?.rackname}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            lable={t("Shelf Name")}
            placeholder=" "
            id="selfname"
            name="selfname"
            onChange={handleChange}
            value={payload?.selfname}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <div className="col-sm-1">
            <button className="btn btn-sm btn-success" onClick={handleSubmit}>
              {t("Save")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetLowStock;
