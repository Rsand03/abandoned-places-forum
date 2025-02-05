import {useEffect, useState} from "react";
import NameInput from "./Form/NameInput.tsx";
import AdditionalInfoInput from "./Form/AdditionalInfoInput.tsx";
import CategoriesInput from "./Form/CategoriesInput.tsx";
import ConditionInput from "./Form/ConditionInput.tsx";
import StatusInput from "./Form/StatusInput.tsx";
import {
    EditLocationFromData,
    FormOption,
    LocationAttributes,
    LocationAttributesFormOptions,
    LocationPatchDto,
    MapLocation
} from "../../../utils.ts";
import LocationService from "../../../../../../../service/LocationService.ts";
import {createFormOptions} from "./locationEditingUtils.ts";
import { useToast } from "../../../../../../../hooks/use-toast.ts";

interface EditLocationProps {
    stopEditing: () => void;
    globalSelectedLocation: MapLocation,
    stopDisplayingLocation: (deletedLocationId: string) => void;
    displayEditedLocation: (
        createdLocation: MapLocation,
        selectOnMap: boolean
    ) => void;
}

function EditSelectedLocation({
                                  stopEditing,
                                  globalSelectedLocation,
                                  stopDisplayingLocation,
                                  displayEditedLocation
                              }: EditLocationProps) {

    const [editLocationFormData, setEditLocationFormData] =
        useState<EditLocationFromData>({
            id: globalSelectedLocation.id,
            name: globalSelectedLocation.name,
            mainCategoryId: globalSelectedLocation.mainCategory.id,
            subCategoryIds: globalSelectedLocation.subCategories.map(x => x.id),
            conditionId: 1, // Direct assignment would require the full condition object in each MapLocation
            statusId: 1,
            additionalInformation: globalSelectedLocation.additionalInformation,
        });

    const [locationAttributesFormOptions, setLocationAttributesFormOptions] =
        useState<LocationAttributesFormOptions>({
            categories: [] as FormOption[],
            conditions: [] as FormOption[],
            statuses: [] as FormOption[],
        });
    
    const { toast } = useToast();

    function setPrevConditionAndStatus(locationAttributes: LocationAttributes | null) {
        if (locationAttributes) {
            setEditLocationFormData((prevData): EditLocationFromData => ({
                ...prevData,
                conditionId: locationAttributes.conditions
                    .find(x => x.name === globalSelectedLocation.condition)?.id ?? prevData.conditionId,
                statusId: locationAttributes.statuses
                    .find(x => x.name === globalSelectedLocation.status)?.id ?? prevData.statusId
            }));
        }
    }

    useEffect(() => {
        LocationService.fetchLocationAttributes(toast).then(
            (locationAttributes: LocationAttributes | null) => {
                if (locationAttributes) {
                    setLocationAttributesFormOptions(
                        createFormOptions(locationAttributes)
                    );
                    setPrevConditionAndStatus(locationAttributes);
                }
            }
        );
    }, []);

    function patchSelectedLocation() {

        const validationError =
            LocationService.isLocationEditingFormDataValid(editLocationFormData);
        if (validationError) {
            console.error(validationError);
            return;
        }

        LocationService.patchLocation(
            editLocationFormData as LocationPatchDto,
            toast
        ).then((editedLocation: MapLocation | null) => {
            if (editedLocation) {
                stopDisplayingLocation(editedLocation.id);
                displayEditedLocation(editedLocation, true);
                stopEditing();
            }
        });
    }

    return (
        <div className="flex flex-col p-8 h-full w-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-white">
                Muuda olemasolevat asukohta
            </h2>
            <form className="text-white pt-12">
                <NameInput
                    editLocationFormData={editLocationFormData}
                    setEditLocationFormData={setEditLocationFormData}
                />
                <CategoriesInput
                    editLocationFormData={editLocationFormData}
                    setEditLocationFormData={setEditLocationFormData}
                    locationAttributesFormOptions={locationAttributesFormOptions}
                />
                <ConditionInput
                    editLocationFormData={editLocationFormData}
                    setEditLocationFormData={setEditLocationFormData}
                    locationAttributesFormOptions={locationAttributesFormOptions}
                />
                <StatusInput
                    editLocationFormData={editLocationFormData}
                    setEditLocationFormData={setEditLocationFormData}
                    locationAttributesFormOptions={locationAttributesFormOptions}
                />
                <AdditionalInfoInput
                    editLocationFormData={editLocationFormData}
                    setEditLocationFormData={setEditLocationFormData}
                />
            </form>
            <div className="flex justify-between gap-x-4 w-full">
                <button
                    onClick={patchSelectedLocation}
                    className="bg-black text-white py-1 px-4 rounded border-2 border-black hover:border-white w-[calc(75%-1rem)]"
                >
                    Salvesta muudatused
                </button>

                <button
                    className="bg-red-700 text-white py-1 px-4 rounded-sm shadow-md hover:bg-red-600 transition-all w-[calc(25%-1rem)]"
                    onClick={stopEditing}
                >
                    Loobu
                </button>
            </div>

        </div>
    );
}

export default EditSelectedLocation;
