import Select, {MultiValue} from "react-select";
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

    function handleMainCategoryChange(selectedOption: FormOption | null) {
        setEditLocationFormData((prevData): EditLocationFromData => ({
            ...prevData,
            mainCategoryId: selectedOption ? selectedOption.value : null,
        }));

        removeDuplicateSelectedSubCategories(selectedOption);
    }

    function handleSubCategoryChange(selectedOptions: MultiValue<FormOption>) {
        const selectedIds = selectedOptions.map((option) => option.value)
        setEditLocationFormData((prevData): EditLocationFromData => ({
            ...prevData,
            subCategoryIds: selectedIds,
        }));
    }


    function removeDuplicateSelectedSubCategories(newMainCategory: FormOption | null) {
        setEditLocationFormData((prevData): EditLocationFromData => ({
            ...prevData,
            subCategoryIds: prevData.subCategoryIds.filter(id => id !== (newMainCategory?.value || null)),
        }));
    }


    return (
        <>
            {t("map.sidebar.details.editing.mainCategory")}: *
            <Select
                options={locationAttributesFormOptions.categories}
                value={
                    locationAttributesFormOptions.categories
                        .find(option =>
                            option.value === editLocationFormData.mainCategoryId) || null
                }
                onChange={handleMainCategoryChange}
                className="text-black mb-3"
                placeholder="-"
                isClearable
            />
            {t("map.sidebar.details.editing.subCategories")} (max 5):
            <Select
                options={
                    locationAttributesFormOptions.categories
                        .filter(option =>
                            option.value !== editLocationFormData.mainCategoryId &&
                            option.label !== "Määramata"
                        )}
                value={
                    locationAttributesFormOptions.categories
                        .filter(option =>
                            editLocationFormData.subCategoryIds.includes(option.value)
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
