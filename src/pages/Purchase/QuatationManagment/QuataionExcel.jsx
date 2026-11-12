
import React, { useState } from 'react'
import BrowseButton from '../../../components/formComponent/BrowseButton'
import { t } from 'i18next'

const QuataionExcel = () => {
    const [Image, setImage] = useState()
    const handleImageChange = (e) => {
        const file = e?.target?.files[0];

        if (file) {
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                alert("File size exceeds 5MB. Please choose a smaller file.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader?.result.split(",")[1];
                const fileExtension = file?.name.split(".").pop();
                setImage({
                    ...Image,
                    SelectFile: file,
                    Document_Base64: base64String,
                    FileExtension: fileExtension,
                });
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <>

            <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <div className="d-flex align-items-center">
                    <BrowseButton
                    
                        label={t("Select File")}
                        handleImageChange={handleImageChange}
                    />
                    <button
                        className="btn btn-sm btn-primary mx-1"
                    // onClick={handleQuotationSearch}
                    >
                        {t("Upload File")}
                      
                    </button>
                </div>

            </div>

        </>

    )
}

export default QuataionExcel