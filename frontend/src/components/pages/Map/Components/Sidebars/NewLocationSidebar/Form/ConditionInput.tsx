import Select from "react-select";
import {FormOption, LocationAttributesFormOptions, NewLocationFormData} from "../../../utils.ts";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";


interface CategoriesInputProps {
    newLocationFormData: NewLocationFormData;
    setNewLocationFormData: (newData: (prevData: NewLocationFormData) => NewLocationFormData) => void;
    locationAttributesFormOptions: LocationAttributesFormOptions
}

function CategoriesInput({
                             newLocationFormData,
                             setNewLocationFormData,
                             locationAttributesFormOptions
                         }: CategoriesInputProps) {

    const {t}: { t: TFunction } = useTranslation();

    function handleConditionChange(selectedOption: FormOption | null) {
        setNewLocationFormData((prevData): NewLocationFormData => ({
            ...prevData,
            conditionId: selectedOption ? selectedOption.value : null,
        }));
    }


    return (
        <>
            {t("map.sidebar.new.condition")}: *

            <Select
                options={locationAttributesFormOptions.conditions}
                value={
                    locationAttributesFormOptions.conditions
                        .find(option =>
                            option.value === newLocationFormData.conditionId) || null
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
