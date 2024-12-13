import Bookmark from "./Bookmark.tsx";
import LandBoardButton from "./LandBoardButton.tsx";
import {MapLocation} from "../../utils.ts";
import emitter from "../../../../../../emitter/eventEmitter.ts";

interface LocationDetailsSidebarProps {
  selectedLocation: MapLocation | null;
  stopDisplayingDeletedLocation: (deletedLocationId: string) => void;
  applyObliqueAeroPhotoCoords: (newObliqueAeroPhotoCoords: number[] | null) => void;
}

function LocationDetailsSidebar({selectedLocation, stopDisplayingDeletedLocation, applyObliqueAeroPhotoCoords}: LocationDetailsSidebarProps) {

  const API_URL = import.meta.env.VITE_API_URL;


  const showObliqueAeroPhoto = () => {
    if (selectedLocation) {
      applyObliqueAeroPhotoCoords([selectedLocation.lat, selectedLocation.lon]);
    }
  };


  const deleteSelectedLocation = async () => {
    if (selectedLocation == null) {
      return;
    }
    try {
      emitter.emit("startLoading");
      const userToken = localStorage.getItem("userToken");

      const response = await fetch(`${API_URL}/api/locations?locationId=${selectedLocation.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 204) {
        stopDisplayingDeletedLocation(selectedLocation.id);
      }

    } catch (error) {
      emitter.emit("stopLoading");
      console.error("Error fetching conditions:", error);
    } finally {
      emitter.emit("stopLoading");
    }
  };

  return (
    <div className="p-4 h-full">
      <h2 className="text-lg font-bold text-white">Location Details</h2>
      {selectedLocation != null ? (
        <div className="pt-20">
          <Bookmark locationId={selectedLocation.id} />
          <div className="flex flex-col items-center space-y-4">
            <div className="text-white">
              <p>{selectedLocation.name}</p>
              <p>{selectedLocation.lat}</p>
              <p>{selectedLocation.lon}</p>
            </div>
            <div className="flex row gap-4">
              <button
                  className="bg-green-700 text-white py-2 px-3 rounded-sm shadow-md hover:bg-green-600 transition-all
                   flex items-center space-x-2 h-7"
                  onClick={showObliqueAeroPhoto}
              >
                Kaldaerofoto
              </button>
              <LandBoardButton location={selectedLocation}/>
            </div>
            {!selectedLocation.isPublic ? (
                <button
                    className="bg-red-700 text-white py-1 px-2 rounded-sm shadow-md hover:bg-red-600 transition-all
                     flex items-center space-x-2 h-5"
                    onClick={deleteSelectedLocation}
                >
                  Delete
                </button>
            ) : <p className="text-white"> Public location </p>}
          </div>
        </div>
      ) : (
          <p>No location selected</p>
      )}
    </div>
  );
}

export default LocationDetailsSidebar;
