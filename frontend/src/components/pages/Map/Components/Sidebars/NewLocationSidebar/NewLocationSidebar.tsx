import { useEffect, useState } from "react";
import {
  FormOption,
  LocationAttributes,
  LocationAttributesFormOptions,
  LocationCreateDto,
  MapLocation,
  NewLocationFormData,
} from "../../utils.ts";
import LocationService from "../../../../../../service/LocationService.ts";
import CoordinateSelector from "./CoordinateSelector/CoordinateSelector.tsx";
import NameInput from "./Form/NameInput.tsx";
import {
  createFormOptions,
  DEFAULT_FORM_DATA,
} from "./newLocationSidebarUtils.ts";
import AdditionalInfoInput from "./Form/AdditionalInfoInput.tsx";
import CategoriesInput from "./Form/CategoriesInput.tsx";
import ConditionInput from "./Form/ConditionInput.tsx";
import StatusInput from "./Form/StatusInput.tsx";
import AutoSelectionCheckbox from "./AutoSelectionButton/AutoSelectionButton.tsx";
import { useToast } from "../../../../../../hooks/use-toast.ts";

interface NewLocationSidebarProps {
  globalCoordinateSelectionMode: boolean;
  setGlobalCoordinateSelectionMode: (isMapPinCursorActive: boolean) => void;
  globalMapClickCoords: number[] | null;
  displayCreatedLocation: (
    createdLocation: MapLocation,
    selectOnMap: boolean
  ) => void;
}

function NewLocationSidebar({
  globalCoordinateSelectionMode,
  setGlobalCoordinateSelectionMode,
  globalMapClickCoords,
  displayCreatedLocation,
}: NewLocationSidebarProps) {
  const [selectLocationAfterCreating, setSelectLocationAfterCreating] =
    useState<boolean>(true);
  const { toast } = useToast();
  const [newLocationFormData, setNewLocationFormData] =
    useState<NewLocationFormData>(DEFAULT_FORM_DATA);
  function resetFormData() {
    setNewLocationFormData(DEFAULT_FORM_DATA);
  }

  const [locationAttributesFormOptions, setLocationAttributesFormOptions] =
    useState<LocationAttributesFormOptions>({
      categories: [] as FormOption[],
      conditions: [] as FormOption[],
      statuses: [] as FormOption[],
    });

  useEffect(() => {
    LocationService.fetchLocationAttributes(toast).then(
      (locationAttributes: LocationAttributes | null) => {
        if (locationAttributes) {
          setLocationAttributesFormOptions(
            createFormOptions(locationAttributes)
          );
        }
      }
    );
  }, []);

  function createNewLocation() {
    setGlobalCoordinateSelectionMode(false);

    const validationError =
      LocationService.isLocationCreationFormDataValid(newLocationFormData);
    if (validationError) {
      console.error(validationError);
      toast({
          title: "Error!",
          description: validationError,
      });
      return;
    }

    LocationService.createLocation(
      newLocationFormData as LocationCreateDto,
      toast
    ).then((newLocation: MapLocation | null) => {
      if (newLocation) {
        displayCreatedLocation(newLocation, selectLocationAfterCreating);
        resetFormData();
      }
    });
  }

  return (
    <div className="flex flex-col p-8 h-full w-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-white">
        Lisa privaatsele kaardile
      </h2>
      <div className="flex flex-col gap-3 text-white pt-8 rounded-lg mb-2">
        <CoordinateSelector
          globalMapClickCoords={globalMapClickCoords}
          globalCoordinateSelectionMode={globalCoordinateSelectionMode}
          setGlobalCoordinateSelectionMode={setGlobalCoordinateSelectionMode}
          newLocationFormData={newLocationFormData}
          setNewLocationFormData={setNewLocationFormData}
        />
      </div>
      <form className="text-white pt-4">
        <NameInput
          newLocationFormData={newLocationFormData}
          setNewLocationFormData={setNewLocationFormData}
        />
        <CategoriesInput
          newLocationFormData={newLocationFormData}
          setNewLocationFormData={setNewLocationFormData}
          locationAttributesFormOptions={locationAttributesFormOptions}
        />
        <ConditionInput
          newLocationFormData={newLocationFormData}
          setNewLocationFormData={setNewLocationFormData}
          locationAttributesFormOptions={locationAttributesFormOptions}
        />
        <StatusInput
          newLocationFormData={newLocationFormData}
          setNewLocationFormData={setNewLocationFormData}
          locationAttributesFormOptions={locationAttributesFormOptions}
        />
        <AdditionalInfoInput
          newLocationFormData={newLocationFormData}
          setNewLocationFormData={setNewLocationFormData}
        />
      </form>
      <div className="flex justify-center">
        <button
          onClick={createNewLocation}
          className="w-full bg-black text-white px-4 py-1 rounded border-2 border-black hover:border-white"
        >
          Lisa
        </button>
      </div>
      <div className="pt-2">
        <AutoSelectionCheckbox
          selectLocationAfterCreating={selectLocationAfterCreating}
          setSelectLocationAfterCreating={setSelectLocationAfterCreating}
        />
      </div>
    </div>
  );
}

export default NewLocationSidebar;
