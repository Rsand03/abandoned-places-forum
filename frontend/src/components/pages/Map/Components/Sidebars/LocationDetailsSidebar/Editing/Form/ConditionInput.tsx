import Select from "react-select";
import {EditLocationFromData, FormOption, LocationAttributesFormOptions} from "../../../../utils.ts";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";


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

    function handleConditionChange(selectedOption: FormOption | null) {
        setEditLocationFormData((prevData): EditLocationFromData => ({
            ...prevData,
            conditionId: selectedOption ? selectedOption.value : null,
        }));
    }


    return (
        <>
            {t("map.sidebar.details.editing.condition")}: *
            <Select
                options={locationAttributesFormOptions.conditions}
                value={
                    locationAttributesFormOptions.conditions
                        .find(option =>
                            option.value === editLocationFormData.conditionId) || null
                }
                onChange={handleConditionChange}
                className="text-black mb-3"
                placeholder="-"
                isClearable
            />
        </>
    );
}

export default CategoriesInput;
