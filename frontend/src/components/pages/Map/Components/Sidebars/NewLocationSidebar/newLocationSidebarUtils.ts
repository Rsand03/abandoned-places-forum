import {FormOption, LocationAttributes, NewLocationFormData} from "../../utils.ts";


export const DEFAULT_LOCATION_NAME = "Asukoht_1";

export const DEFAULT_MAIN_CATEGORY_ID = 1;
export const DEFAULT_CONDITION_ID = 1;
export const DEFAULT_STATUS_ID = 1;

export const DEFAULT_FORM_DATA: NewLocationFormData = {
    name: DEFAULT_LOCATION_NAME,
    mainCategoryId: DEFAULT_MAIN_CATEGORY_ID,
    subCategoryIds: [],
    conditionId: DEFAULT_CONDITION_ID,
    statusId: DEFAULT_STATUS_ID,
    additionalInformation: "",
    lon: null,
    lat: null,
};


export const createFormOptions = (data: LocationAttributes) => ({
    categories: data.categories.map((category): FormOption => ({
        value: category.id,
        label: category.name
    })),
    conditions: data.conditions.map((condition): FormOption => ({
        value: condition.id,
        label: condition.name
    })),
    statuses: data.statuses.map((status): FormOption => ({
        value: status.id,
        label: status.name
    }))
});