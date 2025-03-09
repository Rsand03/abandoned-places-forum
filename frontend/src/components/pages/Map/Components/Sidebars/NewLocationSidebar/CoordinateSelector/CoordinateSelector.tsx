import {NewLocationFormData} from "../../../utils.ts";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";

interface CoordinateSelectorProps {
    globalCoordinateSelectionMode: boolean;
    setGlobalCoordinateSelectionMode: (newMode: boolean) => void;
    globalMapClickCoords: number[] | null;
    newLocationFormData: NewLocationFormData;
    setNewLocationFormData: (newData: (prevData: NewLocationFormData) => NewLocationFormData) => void;
}

function CoordinateSelector({
                                globalCoordinateSelectionMode,
                                setGlobalCoordinateSelectionMode,
                                globalMapClickCoords,
                                newLocationFormData,
                                setNewLocationFormData,
                            }: CoordinateSelectorProps) {

    const {t}: { t: TFunction } = useTranslation();

    function toggleCoordinateSelectionMode() {
        setGlobalCoordinateSelectionMode(!globalCoordinateSelectionMode)
    }

    useEffect(() => {
        if (globalCoordinateSelectionMode && globalMapClickCoords) {
            setGlobalCoordinateSelectionMode(false);

            setNewLocationFormData((prevData): NewLocationFormData => ({
                ...prevData,
                lon: globalMapClickCoords[1],
                lat: globalMapClickCoords[0],
            }));
        }
    }, [globalMapClickCoords]);


    return (
        <div className="flex flex-col gap-2">
            <span>{`${t("map.sidebar.new.coordinates")}: *`}</span>
            <div className="flex items-center gap-x-8">
                <span>
                    {newLocationFormData.lon
                        ? (<>
                            <span className="mr-3">{newLocationFormData.lon?.toFixed(6)}</span>
                            <span>{newLocationFormData.lat?.toFixed(6)}</span>
                        </>)
                        : ("B: - L: -")
                    }
                </span>
                <button
                    onClick={toggleCoordinateSelectionMode}
                    className={`flex flex-row items-center text-white border-2 bg-black justify-center px-2 py-1
                         max-w-40 rounded transition-all duration-200
                         ${globalCoordinateSelectionMode
                        ? "border-white cursor-map-pin"
                        : "border-black"}`
                    }
                >
                    <span>{t("map.sidebar.new.selectOnMap")}</span>
                    <img
                        src="https://img.icons8.com/?size=100&id=85353&format=png&color=FFFFFF"
                        className="w-5 h-5 ml-1 transition-none"
                        alt="New Location Icon"
                    />
                </button>
            </div>
        </div>
    );
}

export default CoordinateSelector;
