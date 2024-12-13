import {useEffect, useState} from "react";
import MapView from "./Components/MapView/MapView.tsx";
import LocationDetailsSidebar from "./Components/Sidebars/LocationDetailsSidebar/LocationDetailsSidebar.tsx";
import FilteringSidebar from "./Components/Sidebars/FilteringSidebar/FilteringSidebar.tsx";
import emitter from "../../../emitter/eventEmitter.ts";
import ObliqueAeroPhotoContainer from "./Components/ObliqueAeroPhoto/ObliqueAeroPhotoContainer.tsx";
import NewLocationSidebar from "./Components/Sidebars/NewLocationSidebar/NewLocationSidebar.tsx";
import NewLocationButton from "./Components/Sidebars/NewLocationButton.tsx";
import FilteringButton from "./Components/Sidebars/FilteringButton.tsx";
import {MapLocation, SidebarContent} from "./Components/utils.ts";


function MapPage() {
    // TODO move to utils / config?
    const API_URL = import.meta.env.VITE_API_URL;

    const [isCursorMapPinMode, setIsCursorMapPinMode] = useState<boolean>(false);
    const [newLocationCoords, setNewLocationCoords] = useState<number[]>([]);
    const handleMapClickCoords = (mapClickCoords: number[]) => {
        setNewLocationCoords(mapClickCoords);
    };


    const [obliqueAeroPhotoCoords, setObliqueAeroPhotoCoords] = useState<number[] | null>(null);
    const handleObliqueAeroPhotoCoords = (newObliqueAeroPhotoCoords: number[] | null) => {
        setObliqueAeroPhotoCoords(newObliqueAeroPhotoCoords);
    };


    const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);


    const [locationsDisplayedOnMap, setLocationsDisplayedOnMap] = useState<MapLocation[]>([]);
    const handleLocationFiltering = (filteredLocations: MapLocation[]) => {
        setLocationsDisplayedOnMap(filteredLocations);
    };
    const displayNewLocation = (createdLocation: MapLocation) => {
        setLocationsDisplayedOnMap(prevLocations => [...prevLocations, createdLocation]);
    };
    const stopDisplayingDeletedLocation = (deletedLocationId: string) => {
        setSelectedLocation(null);
        setLocationsDisplayedOnMap(prevLocations =>
            prevLocations.filter(location => location.id !== deletedLocationId)
        );
    };


    const [sidebarContent, setSidebarContent] = useState<SidebarContent>(SidebarContent.DETAILS);
    const isSidebarOpen =
        (sidebarContent === SidebarContent.DETAILS && selectedLocation !== null) || sidebarContent !== SidebarContent.DETAILS;
    const manageSidebar = (newContent: SidebarContent) => {
        setIsCursorMapPinMode(false);
        if (sidebarContent === newContent) {
            setSidebarContent(SidebarContent.DETAILS); // default value - sidebar is open only if selectedLocation != null
        } else {
            setSidebarContent(newContent);
        }
    };

    useEffect(() => {
        // TODO move to service
        const fetchLocations = async () => {
            try {
                emitter.emit("startLoading");
                const userToken = localStorage.getItem("userToken");

                const response = await fetch(`${API_URL}/api/locations`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                setLocationsDisplayedOnMap(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                emitter.emit("stopLoading");
            }
        };

        fetchLocations();
    }, []);

    return (
        <div className={isCursorMapPinMode ? 'cursor-map-pin' : ''}>
            <MapView
                locationsDisplayedOnMap={locationsDisplayedOnMap}
                setSelectedLocationInParent={setSelectedLocation}
                applyNewLocationCoords={handleMapClickCoords}
                applyObliqueAeroPhotoCoords={handleObliqueAeroPhotoCoords}
            />
            <ObliqueAeroPhotoContainer
                selectedCoords={obliqueAeroPhotoCoords}
                isSidebarOpen={isSidebarOpen}
            />
            // TODO debug: opening newLocationSidebar or FilteringSidebar causes white flash on the whole screen
            <div
                className="fixed top-0 right-0 h-full bg-black bg-opacity-75 z-40
                 flex justify-center items-center transition-all duration-500 ease-in-out"
                style={{transform: isSidebarOpen ? "translateX(0)" : "translateX(100%)", width: "500px"}}
            >
                {sidebarContent === SidebarContent.DETAILS && (
                    <LocationDetailsSidebar
                        selectedLocation={selectedLocation}
                        stopDisplayingDeletedLocation={stopDisplayingDeletedLocation}
                        applyObliqueAeroPhotoCoords={handleObliqueAeroPhotoCoords}
                    />
                )}
                {sidebarContent === SidebarContent.FILTERING && (
                    <FilteringSidebar
                        applyFilters={handleLocationFiltering}
                    />
                )}
                {sidebarContent === SidebarContent.NEW_LOCATION && (
                    <NewLocationSidebar
                        newLocationCoordsProps={newLocationCoords}
                        setMapPinCursorModeInParent={setIsCursorMapPinMode}
                        displayCreatedLocation={displayNewLocation}
                    />
                )}
            </div>
            <button onClick={() => manageSidebar(SidebarContent.NEW_LOCATION)}>
                <NewLocationButton sidebarContent={sidebarContent} isSidebarOpen={isSidebarOpen}/>
            </button>
            <button onClick={() => manageSidebar(SidebarContent.FILTERING)}>
                <FilteringButton sidebarContent={sidebarContent} isSidebarOpen={isSidebarOpen}/>
            </button>
        </div>
    );
}

export default MapPage;
