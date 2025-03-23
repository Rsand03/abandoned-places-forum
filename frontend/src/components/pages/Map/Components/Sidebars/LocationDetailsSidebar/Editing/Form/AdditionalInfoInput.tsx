import {ChangeEvent} from "react";
import {EditLocationFromData} from "../../../../utils.ts";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";

interface LocationNameFieldProps {
    editLocationFormData: EditLocationFromData;
    setEditLocationFormData: (newData: (prevData: EditLocationFromData) => EditLocationFromData) => void;
}

function AdditionalInformationInput({editLocationFormData, setEditLocationFormData}: LocationNameFieldProps) {

    const {t}: { t: TFunction } = useTranslation();

    function updateFormData(event: ChangeEvent<HTMLTextAreaElement>)  {
        setEditLocationFormData((prevData): EditLocationFromData => ({
            ...prevData, additionalInformation: event.target.value,
        }))
    }


    return (
        <div className="mb-3">
            <label htmlFor="additionalInformation" className="block">
                {t("map.sidebar.details.editing.additionalInfo")}:
            </label>
            <textarea
                name="additionalInformation"
                value={editLocationFormData.additionalInformation}
                onChange={updateFormData}
                className="w-full text-black mb-10 rounded h-12 p-0.5 overflow-auto"
            />
        </div>
    );
}

export default AdditionalInformationInput;
