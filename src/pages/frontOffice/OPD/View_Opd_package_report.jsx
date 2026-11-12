import React from 'react'
import Heading from '../../../components/UI/Heading'
import { useTranslation } from 'react-i18next';
import Tables from '../../../components/UI/customTable';

const View_Opd_package_report = ({details}) => {
     const [t] = useTranslation();
    console.log("details",details)
      const THEAD = [
    {name:t("S.No."),width:"1%"},
    t("Category"),
    t("Subcategory"),
    t("ItemName"),
 
    // t("Ledger TransactionNo"),
    t("Entry Date"),
        
    t("Rate"),
   
  ];
  return (

    <>
     
       {
            details?.length > 0 &&
            <div className="card patient_registration_card my-1 mt-2">
              {/* <Heading
                title={t("Package details")}
                isBreadcrumb={false}
              /> */}
              <Tables
                thead={THEAD}
                tbody={details?.map((item, index) => ({
                  "#": index + 1,
                  Category: item?.Category,
                  Subcategory: item?.Subcategory,
                  ItemName: item?.ItemName,
                  // LedgerTransactionNo: item?.LedgerTransactionNo,
                  EntryDate: item?.EntryDate,
                  Rate: item?.Rate,
                 
                }))}
                tableHeight={"tableHeight"}
              // getRowClass={getRowClass}
              />
            </div>
          }
    </>
  )
}

export default View_Opd_package_report