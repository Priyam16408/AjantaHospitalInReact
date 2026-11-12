import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import {
  GetCategory,
  GetDepartment,
  GetGST,
  getSubCategory,
  LoadItems,
  SaveItem,
  UpdateItem,
} from "../../../networkServices/EDP/edpApi.js";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import Tables from "../../../components/UI/customTable";
import CustomSelect from "../../../components/formComponent/CustomSelect";
import WrapTranslate from "../../../components/WrapTranslate";
import SlideScreen from "../../../components/front-office/SlideScreen.jsx";
import SeeMoreSlideScreen from "../../../components/UI/SeeMoreSlideScreen.jsx";
import EDPSeeMoreList from "../EDPSeeMoreList.jsx";

const ItemMaster = ({ data }) => {
  const localData = useLocalStorage("userData", "get");
  const ip = useLocalStorage("ip", "get");
  const [t] = useTranslation();

  const THEAD = [
    { name: t("S.No."), width: "1%" },
    { name: t("Category"), width: "10%" },
    { name: t("Sub Category"), width: "10%" },
    { name: t("Item Name"), width: "10%" },
    { name: t("Department"), width: "5%" },
    { name: t("CPT Code"), width: "10%" },
    { name: t("Rate Edit"), width: "10%" },
    { name: t("Is Discount"), width: "8%" },
    { name: t("Active"), width: "5%" },
    { name: t("GST Type"), width: "10%" },
    { name: t("Action"), width: "10%" },
  ];


  const RateEditableOptions = [
    { label: t("Yes"), value: "1" },
    { label: t("No"), value: "0" },
    { label: t("Both"), value: "2" },
  ];

  const ConditionOptions = [
    { label: t("Active"), value: "1" },
    { label: t("DeActive"), value: "0" },
    { label: t("Both"), value: "2" },
  ];

  const IsDiscountAble = [
    { label: t("Yes"), value: "1" },
    { label: t("No"), value: "0" },
  ];

  const initialState = {
    Edit: {
      label: "New",
      value: "1",
    },
    Category: {
      configID: "",
      categoryName: "",
      categoryID: "",
      label: "",
      value: "",
    },
    ItemName: "",
  };

  const [values, setValues] = useState({ ...initialState });
  const [tableData, setTableData] = useState([]);

  const [dropDownState, setDropDownState] = useState({
    GetCategory: [],
    GetSubCategory: [],
    GST: [],
    GetDepartment: [],
  });

  const GetCategoryAPI = async () => {
    try {
      const GetCategoryDetails = await GetCategory();
      setDropDownState((val) => ({
        ...val,
        GetCategory: handleReactSelectDropDownOptions(
          GetCategoryDetails?.data,
          "categoryName", // Ensure this matches the API response
          "categoryID"
        ),
      }));
    } catch (e) {
      console.log("Something Went Wrong", e);
    }
  };

  const GetDepartmentAPI = async () => {
    try {
      const GetDepartmentDetails = await GetDepartment();
      setDropDownState((val) => ({
        ...val,
        GetDepartment: handleReactSelectDropDownOptions(
          GetDepartmentDetails?.data,
          "Name",
          "ID"
        ),
      }));
    } catch (e) {
      console.log("Something Went Wrong", e);
    }
  };

  const GetSubCategoryAPI = async (payload) => {
    try {
      const getSubCategoryDetails = await getSubCategory(payload);

      setDropDownState((val) => ({
        ...val,
        GetSubCategory: handleReactSelectDropDownOptions(
          getSubCategoryDetails?.data,
          "displayName", // Ensure it matches API response
          "subCategoryID"
        ),
      }));
    } catch (e) {
      console.log("Something Went Wrong", e);
    }
  };

  const GSTAPI = async () => {
    try {
      const GSTDetails = await GetGST();
      setDropDownState((val) => ({
        ...val,
        GST: handleReactSelectDropDownOptions(
          GSTDetails?.data,
          "TaxGroup", // Ensure it matches API response
          "ID"
        ),
      }));
    } catch (e) {
      console.log("Something Went Wrong", e);
    }
  };

  const extractTaxValues = (taxGroup) => {
    if (!taxGroup) return { CGST: 0, SGST: 0, IGST: 0 };

    const isIGST = taxGroup.includes("IGST_");
    const match = taxGroup.match(/(\d+(\.\d+)?)/); // Extract numeric value
    const taxValue = match ? parseFloat(match[0]) : 0;

    if (isIGST) {
      return { CGST: 0, SGST: 0, IGST: taxValue }; // Only IGST applied
    }

    return { CGST: taxValue / 2, SGST: taxValue / 2, IGST: 0 }; // CGST & SGST applied, IGST = 0
  };




  const handleEdit = async () => {
    if (!values?.Category?.value) {
      notify("Please select Category", "error");
      return;
    } else if (!values?.SubCategory?.value) {
      notify("Please select SubCategory", "error");
      return;
    }

    const payloadToBe = {
      CategoryID: values?.Category?.value || "",
      SubCategoryID: values?.SubCategory?.value || 0,
      ItemName: values?.ItemName || "",
      CPTCode: values?.CPTcode || "",
      Type: 1, //PENDING ????
      RateEditable: values?.RateEditable?.value || 2,
      DepartmentID: values?.Department?.value || 0,
      IsDiscountable: values?.IsDiscountable?.value || 0,
    };
    const saveItemDetails = await LoadItems(payloadToBe);

    if (saveItemDetails?.success === true) {
      const formattedData = saveItemDetails.data.map((item) => ({
        ...item,
        RateEditable: RateEditableOptions.find(
          (opt) => opt.value === String(item.RateEditable)
        ),
        IsDiscountable: IsDiscountAble.find(
          (opt) => opt.value === String(item.IsDiscountable)
        ),
        GSTType: dropDownState?.GST.find(
          (opt) => opt.TaxGroup === String(item?.GSTType)
        ),
      }));
      setTableData(formattedData);
      notify(saveItemDetails?.message, "Success");
    } else {
      notify(saveItemDetails?.message, "error");
    }
  };



  const handleReactSelect = async (label, value) => {
    // 
    if (label == "Edit") {
      setValues([]);
      setTableData([]);
    }
    // 
    if (label === "Category") {
      await GetSubCategoryAPI(value?.value);
      setValues((val) => ({ ...val, ["SubCategory"]: { value: "" } }));
    }
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const updateTableData = (index, key, value) => {
    // 
    setTableData((prevTableData) =>
      prevTableData.map((item, i) =>
        i === index
          ? {
            ...item,
            [key]: value?.target ? value.target.value : value,
          }
          : item
      )
    );
  };

  const { CGST, SGST, IGST } = extractTaxValues(values?.GSTType?.TaxGroup);

  useEffect(() => {
    GetCategoryAPI();
    GetDepartmentAPI();
    GSTAPI();
  }, []);


  const [visible, setVisible] = useState(false);
  const [seeMore, setSeeMore] = useState([]);
  // const dispatch = useDispatch()
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });
  const handleChangeComponent = (e) => {
    ModalComponent(e?.label, e?.component);
  };
  const ModalComponent = (name, component) => {
    setVisible(true);
    setRenderComponent({
      name: name,
      component: component,
    });
  };


  return (<>
    <div className="card">
      <Heading
        title={data?.breadcrumb}
        // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true}
        isBreadcrumb={true}
        secondTitle={<><EDPSeeMoreList
          ModalComponent={ModalComponent}
          setSeeMore={setSeeMore}
          data={{}}
          isRemoveSvg={true}
          setVisible={() => { setVisible(false) }}
          handleBindFrameMenu={[{
            "FileName": "Create Item Master",
            "URL": "AccessMasters",
            "FrameName": "Create Item Master",
            "Description": "Create Item Master",
            // header: true
          }]}
          openFirstItem={false}
          name={<button className='btn text-white'> {t("Create Item")} </button>
          }
        />
        </>}
      />
      <div className="row px-2 pt-2">

        <ReactSelect
          placeholderName={t("Category")}
          //   id="Category"
          requiredClassName={"required-fields"}
          name="Category"
          value={values?.Category?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.GetCategory}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Sub Category")}
          id="SubCategory"
          requiredClassName={"required-fields"}
          name="SubCategory"
          value={values?.SubCategory?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.GetSubCategory}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="ItemName"
          className={"form-control "}
          lable={t("Item Name")}
          placeholder=" "
          id="ItemName"
          name="ItemName"
          onChange={(e) => handleInputChange(e, 0, "ItemName")}
          value={values?.ItemName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />

        <ReactSelect
          placeholderName={t("Status")}
          id="Status"
          name="Status"
          value={values?.Status?.value}
          removeIsClearable={true}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={ConditionOptions}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />

        <button
          className=" btn btn-sm btn-success ml-2 px-3"
          onClick={handleEdit}
        >
          {t("Search")}
        </button>



      </div>
      {tableData?.length > 0 &&
        <div className="card">
          <Heading title={t("Item Master")} isBreadcrumb={false} />
          <Tables
            isSearch={true}
            thead={THEAD}
            tbody={tableData?.map((val, index) => ({
              SNo: index + 1,
              Category: val?.Category,
              SubCategory: val?.SubCategory,
              ItemName: val?.TypeName,
              Department: val?.Department,
              CPTCode: val?.ItemCode,
              RateEditable: val?.RateEditable?.value,
              IsDiscountable: val?.IsDiscountable?.value,
              IsActive: val?.IsActive,
              GSTtype: val?.GSTType?.value,
              Action: <EDPSeeMoreList
                ModalComponent={ModalComponent}
                setSeeMore={setSeeMore}
                data={val}
                isRemoveSvg={true}
                setVisible={() => { setVisible(false); handleEdit() }}
                handleBindFrameMenu={[{
                  "FileName": "",
                  "URL": "AccessMasters",
                  "FrameName": "Create Item Master",
                  "Description": "Create Item Master",
                  // header: true
                }]}
                openFirstItem={false}
                name={<i className="fa fa-edit"></i>}
              />,
            }))}
          />
        </div>
      }
    </div>
    <SlideScreen
      visible={visible}
      setVisible={() => {
        setVisible(false);
        setRenderComponent({
          name: null,
          component: null,
        });
      }}
      Header={
        <SeeMoreSlideScreen
          name={renderComponent?.name}
          seeMore={seeMore}
          handleChangeComponent={handleChangeComponent}
        />
      }
    >
      {renderComponent?.component}
    </SlideScreen>
  </>
  );
};

export default ItemMaster;
