import React from 'react'
import Heading from '../../../components/UI/Heading'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import Input from '../../../components/formComponent/Input'
import { inputBoxValidation } from '../../../utils/utils'
import { AGE_TYPE, AMOUNT_REGX, BIND_TABLE_BY_MED_FIRST_NAME } from '../../../utils/constant'
import SearchItemEassyUI from '../../../components/commonComponents/SearchItemEassyUI'
import { useTranslation } from 'react-i18next'

const TYPE = [{ label: "Registred Patient", value: 1 }, { label: "Walk-in", value: 2 }]
const TITLE = [{ label: "Mr", value: "Mr" }, { label: "Mrs", value: "Mrs" }, { label: "Ms", value: "Ms" }]
const GENDER = [{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }]
const SearchByOption = [{ label: "Item", value: "1" }, { label: "Generic", value: "3" }]
const TypeOption = [{ label: "Manual", value: "1" }, { label: "Item Code", value: "0" }]
const GenericOption = [{ label: "Yes", value: "1" }, { label: "No", value: "0" }]
const SellOnOption = [{ label: "MRP", value: "0" }, { label: "Rate", value: "1" }]

export default function WalkIn({ handleReactSelect, handleChange, values, hanldeCloseSearchMed, BindDetails, BindListAPI, addDoctorModel }) {
    const [t] = useTranslation()
    return (
        <>


            <Heading title={""} isBreadcrumb={false} />
            <div className="row p-2">
                <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12 d-flex">
                    <ReactSelect
                        placeholderName={"Title"}
                        id="title"
                        name="title"
                        value={values?.title?.value}
                        handleChange={(name, e) => handleReactSelect(name, e)}
                        dynamicOptions={TITLE}
                        searchable={true}
                        respclass="w-45"
                    />

                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="Name"
                        name="Name"
                        value={values?.Name ? values?.Name : ""}
                        onChange={handleChange}
                        lable={"Name"}
                        placeholder=" "
                        respclass="w-75 ml-1"
                    />


                </div>

                <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12 d-flex">
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="Age"
                        name="Age"
                        value={values?.Age ? values?.Age : ""}
                        onChange={(e) => { inputBoxValidation(AMOUNT_REGX(3), e, handleChange) }}
                        lable={"Age"}
                        placeholder=" "
                        respclass="w-45"
                    />

                    <ReactSelect
                        placeholderName={"Age Type"}
                        id="AgeType"
                        name="AgeType"
                        value={values?.AgeType?.value}
                        handleChange={handleReactSelect}
                        dynamicOptions={AGE_TYPE}
                        searchable={true}
                        respclass="w-75 ml-1"
                    />
                </div>

                <ReactSelect
                    placeholderName={"Gender"}
                    id="Gender"
                    name="Gender"
                    value={values?.Gender?.value}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    dynamicOptions={GENDER}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                />
                <Input
                    type="text"
                    className="form-control"
                    id="Address"
                    name="Address"
                    value={values?.Address ? values?.Address : ""}
                    onChange={handleChange}
                    lable={"Address"}
                    placeholder=" "
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                />
                <Input
                    type="text"
                    className="form-control required-fields"
                    id="ContactNo"
                    name="ContactNo"
                    value={values?.ContactNo ? values?.ContactNo : ""}
                    onChange={handleChange}
                    lable={"Contact No."}
                    placeholder=" "
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                />


                <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12">
                    <div className="d-flex">
                        <ReactSelect
                            placeholderName={"Doctor"}
                            id="Doctor"
                            name="Doctor"
                            value={values?.Doctor?.value}
                            handleChange={(name, e) => handleReactSelect(name, e)}
                            dynamicOptions={GENDER}
                            searchable={true}
                            respclass="w-100 pr-2"
                        // respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        />

                        <div >
                            <button
                                className="btn btn-sm btn-primary"
                                type="button"
                                onClick={addDoctorModel}
                            >
                                <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Heading title={""} isBreadcrumb={false} />
            <div className="row p-2">
                <ReactSelect
                    placeholderName={"Search By"}
                    id="SearchBy"
                    name="SearchBy"
                    value={values?.SearchBy?.value}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    dynamicOptions={SearchByOption}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                />
                <ReactSelect
                    placeholderName={"Type"}
                    id="type"
                    name="type"
                    value={values?.type?.value}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    dynamicOptions={TypeOption}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                />

                {/* <Input
                            type="checkbox"
                            className="form-control"
                            id="Quantity"
                            name="Quantity"
                            value={values?.Quantity ? values?.Quantity : ""}
                            onChange={handleChange}
                            lable={"Quantity"}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        /> */}

                <ReactSelect
                    placeholderName={"W. Generic"}
                    id="Generic"
                    name="Generic"
                    value={values?.Generic?.value}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    dynamicOptions={GenericOption}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                />
                <div className='col-xl-4 col-md-4 col-sm-6 col-12'>
                    <SearchItemEassyUI onClick={hanldeCloseSearchMed} BindListAPI={BindListAPI} BindDetails={BindDetails} Head={BIND_TABLE_BY_MED_FIRST_NAME} />
                </div>

            
                <ReactSelect
                    placeholderName={t("Add To Implant")}
                    id="addToImplant"
                    name="addToImplant"
                    value={values?.addToImplant?.value}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    dynamicOptions={[{label:"Yes",value:true},{label:"No",value:false}]}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                />
                <ReactSelect
                    placeholderName={"Sell On"}
                    id="SellOn"
                    name="SellOn"
                    value={values?.SellOn?.value}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    dynamicOptions={SellOnOption}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                />
                <Input
                    type="number"
                    className="form-control"
                    id="Quantity"
                    name="Quantity"
                    value={values?.Quantity ? values?.Quantity : ""}
                    onChange={handleChange}
                    lable={"Quantity"}
                    placeholder=" "
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                />


                <div className="col-sm-1">
                    <button className="btn btn-sm btn-success" type='button'>Add</button>
                </div>

            </div>


        </>
    )
}
