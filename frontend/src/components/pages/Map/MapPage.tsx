import {useEffect, useState} from "react";
import MapView from "./Components/MapView/MapView.tsx";
import LocationDetailsSidebar from "./Components/Sidebars/LocationDetailsSidebar/LocationDetailsSidebar.tsx";
import FilteringSidebar from "./Components/Sidebars/FilteringSidebar/FilteringSidebar.tsx";
import ObliqueAeroPhotoContainer from "./Components/ObliqueAeroPhoto/ObliqueAeroPhotoContainer.tsx";
import NewLocationSidebar from "./Components/Sidebars/NewLocationSidebar/NewLocationSidebar.tsx";
import NewLocationButton from "./Components/Sidebars/Buttons/NewLocationButton.tsx";
import FilteringButton from "./Components/Sidebars/Buttons/FilteringButton.tsx";
import {MapLocation, SidebarContent} from "./Components/utils.ts";
import LocationService from "../../../service/LocationService.ts";
import { useToast } from "../../../hooks/use-toast.ts";
import {useIsMobile} from "../../../hooks/use-mobile.tsx";

export const SIDEBAR_TRANSITION_DURATION = 300;

function MapPage() {
    const isMobile = useIsMobile();

  const [globalSelectedLocation, setGlobalSelectedLocation] =
    useState<MapLocation | null>(null);

  const [obliqueAeroPhotoCoords, setObliqueAeroPhotoCoords] = useState<
    number[] | null
  >(null);

  const [globalMapClickCoords, setGlobalMapClickCoords] = useState<
    number[] | null
  >(null);
  const [globalCoordinateSelectionMode, setGlobalCoordinateSelectionMode] =
    useState<boolean>(false);

  const [locationsDisplayedOnMap, setLocationsDisplayedOnMap] = useState<
    MapLocation[]
  >([]);
  const { toast } = useToast();
  
  function handleLocationFiltering(filteredLocations: MapLocation[]) {
    setLocationsDisplayedOnMap(filteredLocations);
  }
  function displayNewLocation(
    createdLocation: MapLocation,
    selectOnMap: boolean
  ) {
    if (selectOnMap) {
      setGlobalSelectedLocation(createdLocation);
      setSidebarContent(SidebarContent.DETAILS);
    }
    setLocationsDisplayedOnMap((prevLocations) => [
      ...prevLocations,
      createdLocation,
    ]);
  }
  function stopDisplayingLocation(deletedLocationId: string) {
    setGlobalSelectedLocation(null);
    setLocationsDisplayedOnMap((prevLocations) =>
      prevLocations.filter((location) => location.id !== deletedLocationId)
    );
  }

  const [sidebarContent, setSidebarContent] = useState<SidebarContent>(
    SidebarContent.DETAILS
  );
  const isSidebarOpen =
    (sidebarContent === SidebarContent.DETAILS &&
      globalSelectedLocation !== null) ||
    sidebarContent !== SidebarContent.DETAILS;
  function manageSidebar(newContent: SidebarContent) {
    setGlobalCoordinateSelectionMode(false);
    if (sidebarContent === newContent) {
      setSidebarContent(SidebarContent.DETAILS);
    } else {
      setSidebarContent(newContent);
    }
  }
  function closeSidebar() {
    if (sidebarContent === SidebarContent.DETAILS) {
      setGlobalSelectedLocation(null);
    }
    manageSidebar(SidebarContent.DETAILS);
  }

  useEffect(() => {
    LocationService.fetchAllAvailableLocations(toast).then(
      (locations: MapLocation[] | null) => {
        if (locations) {
          setLocationsDisplayedOnMap(locations);
        }
      }
    );
  }, []);

  return (
    <div className={globalCoordinateSelectionMode ? "cursor-map-pin" : ""}>
      <MapView
        globalMapClickCoords={globalMapClickCoords}
        setGlobalMapClickCoords={setGlobalMapClickCoords}
        globalCoordinateSelectionMode={globalCoordinateSelectionMode}
        globalSelectedLocation={globalSelectedLocation}
        setGlobalSelectedLocation={setGlobalSelectedLocation}
        locationsDisplayedOnMap={locationsDisplayedOnMap}
        setObliqueAeroPhotoCoords={setObliqueAeroPhotoCoords}
        sideBarContent={sidebarContent}
      />
      <ObliqueAeroPhotoContainer
        obliqueAeroPhotoCoords={obliqueAeroPhotoCoords}
        isSidebarOpen={isSidebarOpen}
      />
      <div
        className="fixed top-0 right-0 h-full bg-black bg-opacity-75 z-40
                 flex justify-center items-center transition-all ease-in-out w-[500px] max-w-full"
        style={{
          transform: isSidebarOpen && !(globalCoordinateSelectionMode && isMobile) ? "translateX(0)" : "translateX(100%)",
          transitionDuration: `${SIDEBAR_TRANSITION_DURATION}ms`,
        }}
      >
        <button
          className="absolute top-8 right-12 w-8 h-8 flex items-center justify-center text-white text-2xl
                        pb-1.5 rounded-full shadow-lg font-bold cursor-pointer transition-transform transform
                        hover:scale-110 hover:bg-white hover:bg-opacity-20 z-50"
          onClick={closeSidebar}
        >
          x
        </button>
        {sidebarContent === SidebarContent.DETAILS && globalSelectedLocation !== null &&(
          <LocationDetailsSidebar
            globalSelectedLocation={globalSelectedLocation}
            stopDisplayingLocation={stopDisplayingLocation}
            displayModifiedLocation={displayNewLocation}
            setObliqueAeroPhotoCoords={setObliqueAeroPhotoCoords}
          />
        )}
        {sidebarContent === SidebarContent.FILTER && (
          <FilteringSidebar applyFilters={handleLocationFiltering} />
        )}
        {sidebarContent === SidebarContent.ADD_NEW_LOCATION && (
          <NewLocationSidebar
            globalCoordinateSelectionMode={globalCoordinateSelectionMode}
            setGlobalCoordinateSelectionMode={setGlobalCoordinateSelectionMode}
            globalMapClickCoords={globalMapClickCoords}
            displayCreatedLocation={displayNewLocation}
          />
        )}
      </div>
      <NewLocationButton
        sidebarContent={sidebarContent}
        isSidebarOpen={isSidebarOpen}
        manageSidebar={manageSidebar}
        globalCoordinateSelectionMode={globalCoordinateSelectionMode}
      />
      <FilteringButton
        sidebarContent={sidebarContent}
        isSidebarOpen={isSidebarOpen}
        manageSidebar={manageSidebar}
        globalCoordinateSelectionMode={globalCoordinateSelectionMode}
      />
    </div>
  );
}

export default MapPage;
