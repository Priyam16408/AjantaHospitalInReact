import { StyledDropdown } from '@app/styles/common';
import {  useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { changeLanguageAPI } from '../../../store/reducers/dashboardSlice/CommonFunction';
import { notify } from '../../../utils/utils';
import { changeLanguageAPI, GetLangaugeAPI } from '../../../store/reducers/dashboardSlice/CommonFunction';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';


const languages = [
  {
    key: 'hi',
    icon: 'flag-icon-in',
    label: 'Hindi',
  },
  {
    key: 'en',
    icon: 'flag-icon-us',
    label: 'English',
  },
  {
    key: 'tr',
    icon: 'flag-icon-tr',
    label: 'Turkish',
  },
  {
    key: 'de',
    icon: 'flag-icon-de',
    label: 'German',
  },
  {
    key: 'fr',
    icon: 'flag-icon-fr',
    label: 'French',
  },
  {
    key: 'es',
    icon: 'flag-icon-es',
    label: 'Spanish',
  },
  {
    key: 'ar',
    icon: 'flag-icon-ar',
    label: 'Arabic ',
  },
];
// D:\Mayank Data\hospnew\src\locales\fr\translation.json
const LanguagesDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { t, i18n } = useTranslation();
  let localData = useLocalStorage("userData","get")



  const changeLanguage = async (lng,label) => {
    let payload ={
      "empLanguage": label,
      "empLanguageCode": lng
    }
    let apiResp = await changeLanguageAPI(payload);

    if (apiResp?.success) {

      useLocalStorage("userData", "set", { ...localData,empLanguage:label,empLanguageCode:lng });
      let translation = {}
      const langlist = await GetLangaugeAPI(label)
      if (langlist?.success) {
        langlist?.data?.map((val) => {
          translation[val["FIELDNAME"]] = val["DISPLAYNAME"]
        })
      }
      i18n.addResourceBundle(lng, 'translation', translation, true, true);
      notify(apiResp?.message,"success")
      i18n.changeLanguage(lng);
    } else {
      notify(apiResp?.message, "error")
    }

  };

  // console.log("asdasd",i18n.getResourceBundle("hi", "translation"))

  const getCurrentLanguage = () => {
    const currentLanguage = i18n.language;
    if (currentLanguage) {
      const language = languages.find(
        (language) => language.key === currentLanguage
      );
      return language || languages[0];
    }
    return languages[0];
  };

  const isActiveLanguage = (language) => {
    if (language) {
      return getCurrentLanguage().key === language.key ? 'active' : '';
    }
    return '';
  };

  return (
    <StyledDropdown isOpen={dropdownOpen} hideArrow >
      <div className="nav-link " slot="head">
        <i className={`flag-icon ${getCurrentLanguage().icon}`} />
      </div>
      <div slot="body">
        {languages.map((language) => (
          <span
            type="button"
            key={language.key}
            className={`dropdown-item ${isActiveLanguage(language)}`}
            onClick={() => {
              changeLanguage(language.key,language.label);
              setDropdownOpen(false);
            }}
          >
            <i className={`flag-icon ${language.icon} mr-2`} />
            <span>{language.label}</span>
          </span>
        ))}
      </div>
    </StyledDropdown>
  );
};

export default LanguagesDropdown;
