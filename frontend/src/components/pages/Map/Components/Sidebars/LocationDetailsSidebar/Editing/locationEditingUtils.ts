import {FormOption, LocationAttributes} from "../../../utils.ts";


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