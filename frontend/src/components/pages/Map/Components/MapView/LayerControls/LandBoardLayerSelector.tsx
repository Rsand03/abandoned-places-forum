import {MutableRefObject, useState} from "react";
import {createLandBoardTileMapSource, LandBoardLayerTypes} from "../mapLayers";
import TileLayer from "ol/layer/Tile";

interface LandBoardLayerSelectorProps {
    landBoardLayerRef1: MutableRefObject<TileLayer>;
    landBoardLayerRef2: MutableRefObject<TileLayer>;
}

function LandBoardLayerSelector({ landBoardLayerRef1, landBoardLayerRef2 }: LandBoardLayerSelectorProps) {

    const [activeLayer, setActiveLayer] = useState<LandBoardLayerTypes | null>(null);

    function handleLayerChange(layerType: LandBoardLayerTypes | null) {
        landBoardLayerRef1.current.clearRenderer();
        landBoardLayerRef1.current.setSource(null);
        landBoardLayerRef2.current.clearRenderer();
        landBoardLayerRef2.current.setSource(null);
        setActiveLayer(null);

        if (layerType !== activeLayer && layerType === LandBoardLayerTypes.HYBRID) {
            landBoardLayerRef1.current.setSource(createLandBoardTileMapSource(LandBoardLayerTypes.ORTOPHOTO));
            landBoardLayerRef2.current.setSource(createLandBoardTileMapSource(LandBoardLayerTypes.HYBRID));
            setActiveLayer(LandBoardLayerTypes.HYBRID);
        } else if (layerType !== activeLayer && layerType !== null) {
            landBoardLayerRef1.current.setSource(createLandBoardTileMapSource(layerType));
            setActiveLayer(layerType);
        }
    }

    return (
        <div className="absolute bottom-4 left-4 p-4 bg-black bg-opacity-75 rounded-lg flex flex-col space-y-2">
            <button
                className={`px-4 py-2 rounded-lg text-white ${activeLayer === null ? "bg-blue-500" : "bg-gray-800"}`}
                onClick={() => handleLayerChange(null)}
            >
                {"BASE MAP ONLY"}
            </button>
            {Object.keys(LandBoardLayerTypes).map((key) => {
                const layerType = LandBoardLayerTypes[key as keyof typeof LandBoardLayerTypes];
                return (
                    <button
                        key={layerType}
                        className={`px-4 py-2 rounded-lg text-white ${
                            activeLayer === layerType ? "bg-blue-500" : "bg-gray-800"
                        }`}
                        onClick={() => handleLayerChange(layerType)}
                    >
                        {key}
                    </button>
                );
            })}
        </div>
    );
}

export default LandBoardLayerSelector;
