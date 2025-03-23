import Select, {MultiValue} from "react-select";
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

    function handleMainCategoryChange(selectedOption: FormOption | null) {
        setNewLocationFormData((prevData): NewLocationFormData => ({
            ...prevData,
            mainCategoryId: selectedOption ? selectedOption.value : null,
        }));

        removeDuplicateSelectedSubCategories(selectedOption);
    }

    function handleSubCategoryChange(selectedOptions: MultiValue<FormOption>) {
        const selectedIds = selectedOptions.map((option) => option.value)
        setNewLocationFormData((prevData): NewLocationFormData => ({
            ...prevData,
            subCategoryIds: selectedIds,
        }));
    }


    function removeDuplicateSelectedSubCategories(newMainCategory: FormOption | null) {
        setNewLocationFormData((prevData): NewLocationFormData => ({
            ...prevData,
            subCategoryIds: prevData.subCategoryIds.filter(id => id !== (newMainCategory?.value || null)),
        }));
    }


    return (
        <>
            {t("map.sidebar.new.mainCategory")}: *
            <Select
                options={locationAttributesFormOptions.categories}
                value={
                    locationAttributesFormOptions.categories
                        .find(option =>
                            option.value === newLocationFormData.mainCategoryId) || null
                }
                onChange={handleMainCategoryChange}
                className="text-black mb-3"
                placeholder="-"
                isClearable
            />
            {t("map.sidebar.new.subCategories")} (max 5): *
            <Select
                options={
                    locationAttributesFormOptions.categories
                        .filter(option =>
                            option.value !== newLocationFormData.mainCategoryId &&
                            option.label !== "Määramata"
                        )}
                value={
                    locationAttributesFormOptions.categories
                        .filter(option =>
                            newLocationFormData.subCategoryIds.includes(option.value)
                        )}
                isMulti
                className="text-black mb-3"
                onChange={handleSubCategoryChange}
                placeholder=""
            />
        </>
    );
}

export default CategoriesInput;
