import {ChangeEvent} from "react";
import {NewLocationFormData} from "../../../utils.ts";
import {TFunction} from "i18next";
import {useTranslation} from "react-i18next";

interface LocationNameFieldProps {
    newLocationFormData: NewLocationFormData;
    setNewLocationFormData: (newData: (prevData: NewLocationFormData) => NewLocationFormData) => void;
}

function AdditionalInformationInput({newLocationFormData, setNewLocationFormData}: LocationNameFieldProps) {

    const {t}: { t: TFunction } = useTranslation();

    function updateFormData(event: ChangeEvent<HTMLTextAreaElement>)  {
        setNewLocationFormData((prevData): NewLocationFormData => ({
            ...prevData, additionalInformation: event.target.value,
        }))
    }


    return (
        <div className="mb-3">
            <label htmlFor="additionalInformation" className="block">
                {t("map.sidebar.new.additionalInfo")}:

            </label>
            <textarea
                name="additionalInformation"
                value={newLocationFormData.additionalInformation}
                onChange={updateFormData}
                className="w-full text-black mb-10 rounded h-12 p-0.5 overflow-auto"
            />
        </div>
    );
}

export default AdditionalInformationInput;
