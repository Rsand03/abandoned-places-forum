

export enum SidebarContent {
    DETAILS,
    FILTERING,
    NEW_LOCATION
}


export interface MapLocation {
    id: string;
    uuid: string;
    name: string;
    lon: number;
    lat: number;
    mainCategory: LocationCategory;
    locationCategory: LocationCategory[];
    condition: string;
    status: string;
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


export interface NewLocationFormData {
    name: string;
    mainCategoryId: number | null;
    subCategoryIds: number[];
    conditionId: number | null;
    statusId: number | null;
    additionalInformation: string;
}

export interface LocationAttributeFormOptions {
    label: string,
    value : number,
}
