import {MutableRefObject, useState} from "react";
import VectorLayer from "ol/layer/Vector";
import {MapLocation} from "../../utils.ts";

interface LocationLayerSelector {
    publicLayerRef: MutableRefObject<VectorLayer>;
    privateLayerRef: MutableRefObject<VectorLayer>;
    globalSelectedLocation: MapLocation | null;
    setGlobalSelectedLocation: (mapLocation: MapLocation | null) => void;
}

function LocationLayerSelector({
                                   publicLayerRef,
                                   privateLayerRef,
                                   globalSelectedLocation,
                                   setGlobalSelectedLocation
                               }: LocationLayerSelector) {

    const [displayPublicLocations, setDisplayPublicLocations] = useState(true);
    const [displayPrivateLocations, setDisplayPrivateLocations] = useState(true);

    function togglePublicLocationsVisibility() {
        const newVisibility = !displayPublicLocations;
        setDisplayPublicLocations(newVisibility);
        publicLayerRef.current.setVisible(newVisibility);

        if (!newVisibility && globalSelectedLocation?.isPublic) {
            setGlobalSelectedLocation(null);
        }
    }

    function togglePrivateLocationsVisibility() {
        const newVisibility = !displayPrivateLocations;
        setDisplayPrivateLocations(newVisibility);
        privateLayerRef.current.setVisible(newVisibility);

        if (!newVisibility && !globalSelectedLocation?.isPublic) {
            setGlobalSelectedLocation(null);
        }
    }

    return (
        <div
            className="absolute top-24 left-4 bg-black bg-opacity-80 text-white p-2.5 rounded shadow-lg z-50"
        >
            <div className="space-y-2">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={displayPublicLocations}
                        onChange={togglePublicLocationsVisibility}
                        className="mr-2 w-4 h-4"
                    />
                    <label className="text-sm">Public Map</label>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={displayPrivateLocations}
                        onChange={togglePrivateLocationsVisibility}
                        className="mr-2 w-4 h-4"
                    />
                    <label className="text-sm">Private Map</label>
                </div>
            </div>
        </div>
    );
}

export default LocationLayerSelector;
