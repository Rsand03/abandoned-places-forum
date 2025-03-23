import Select from "react-select";
import {EditLocationFromData, FormOption, LocationAttributesFormOptions} from "../../../../utils.ts";
import {TFunction} from "i18next";
import {useTranslation} from "react-i18next";


interface CategoriesInputProps {
    editLocationFormData: EditLocationFromData;
    setEditLocationFormData: (newData: (prevData: EditLocationFromData) => EditLocationFromData) => void;
    locationAttributesFormOptions: LocationAttributesFormOptions
}

function CategoriesInput({
                             editLocationFormData,
                             setEditLocationFormData,
                             locationAttributesFormOptions
                         }: CategoriesInputProps) {

    const {t}: { t: TFunction } = useTranslation();

    function handleStatusChange(selectedOption: FormOption | null) {
        setEditLocationFormData((prevData): EditLocationFromData => ({
            ...prevData,
            statusId: selectedOption ? selectedOption.value : null,
        }));
    }


    return (
        <>
            {t("map.sidebar.details.editing.status")}: *
            <Select
                options={locationAttributesFormOptions.statuses}
                value={
                    locationAttributesFormOptions.statuses
                        .find(option =>
                            option.value === editLocationFormData.statusId) || null
                }
                onChange={handleStatusChange}
                className="text-black mb-3"
                placeholder="-"
                isClearable
            />
        </>
    );
}

export default CategoriesInput;
