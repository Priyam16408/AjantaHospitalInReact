import { useTranslation } from "react-i18next"

const WrapTranslate = (data, key) => {
    const [t] = useTranslation()
    let newData = data?.map((val, index) => {
        // debugger
        if (typeof (val) === "object") {
            val[key] = t(val[key])
        } else {
            val = t(val)
        }
        // debugger
        return val
    })
    return newData
}
export default WrapTranslate


export const transformDataInTranslate = (data,t) => {
    // const [t] = useTranslation()
    return data.map((item) => {
      let newItem = {};
  
      Object.keys(item).forEach((key) => {
        // Convert keys: Replace "_" with " " and add t("...")
        let newKey = t(`${key.replace(/_/g, " ")}`);
  
        // Assign the transformed key-value pair
        newItem[newKey] = item[key];
      });
  
      return newItem;
    });
  };
  
  