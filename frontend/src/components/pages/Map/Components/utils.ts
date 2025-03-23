

export enum SidebarContent {
    DETAILS,
    FILTER,
    ADD_NEW_LOCATION
}

export interface MapLocation {
    id: string;
    uuid: string;
    name: string;
    lon: number;
    lat: number;
    mainCategory: LocationCategory;
    subCategories: LocationCategory[];
    condition: LocationCondition;
    status: LocationStatus;
    additionalInformation: string;
    minRequiredPointsToView: number;
    isPublic: boolean;
    isPendingPublicationApproval: boolean;
}

export interface LocationAttributes {
    categories: LocationCategory[];
    conditions: LocationCondition[];
    statuses: LocationStatus[];
}

export interface LocationCategory {
    id: number;
    name: string;
    colorHex: string;
}

export interface LocationCondition {
    id: number;
    name: string;
    colorHex: string;
}

export interface LocationStatus {
    id: number;
    name: string;
    colorHex: string;
}

export interface LocationCreateDto {
    name: string;
    lon: number;
    lat: number;
    mainCategoryId: number | null;
    subCategoryIds: number[];
    conditionId: number | null;
    statusId: number | null;
    additionalInformation: string;
}

export interface LocationPatchDto {
    id: string;
    name: string;
    mainCategoryId: number | null;
    subCategoryIds: number[];
    conditionId: number | null;
    statusId: number | null;
    additionalInformation: string;
}

export interface NewLocationFormData {
    name: string;
    mainCategoryId: number | null;
    subCategoryIds: number[];
    conditionId: number | null;
    statusId: number | null;
    additionalInformation: string;
    lon: number | null;
    lat: number | null;
}

export interface EditLocationFromData {
    id: string
    name: string;
    mainCategoryId: number | null;
    subCategoryIds: number[];
    conditionId: number | null;
    statusId: number | null;
    additionalInformation: string;
}

export interface LocationAttributesFormOptions {
    categories: FormOption[];
    conditions: FormOption[];
    statuses: FormOption[];
}

export interface FormOption {
    label: string,
    value : number,
}
