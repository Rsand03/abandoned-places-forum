import Select from "react-select";
import {FormOption, LocationAttributesFormOptions, NewLocationFormData} from "../../../utils.ts";
import {TFunction} from "i18next";
import {useTranslation} from "react-i18next";


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

    function handleStatusChange(selectedOption: FormOption | null) {
        setNewLocationFormData((prevData): NewLocationFormData => ({
            ...prevData,
            statusId: selectedOption ? selectedOption.value : null,
        }));
    }


    return (
        <>
            {t("map.sidebar.new.status")}:
            <Select
                options={locationAttributesFormOptions.statuses}
                value={
                    locationAttributesFormOptions.statuses
                        .find(option =>
                            option.value === newLocationFormData.statusId) || null
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
