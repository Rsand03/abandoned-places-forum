import Map from "ol/Map.js";
import { defaults as defaultInteractions, Select } from "ol/interaction";
import { Feature } from "ol";
import { MutableRefObject, useEffect, useRef } from "react";
import VectorSource from "ol/source/Vector";
import {
  DEFAULT_INITIAL_VIEW,
  generateLocationFeature,
} from "../../../Map/Components/MapView/mapUtils.ts";
import { MapLocation } from "../../../Map/Components/utils.ts";
import {
  BASE_OSM_LAYER,
  createVectorLayer,
} from "../../../Map/Components/MapView/mapLayers.ts";
import VectorLayer from "ol/layer/Vector";
import { SelectEvent } from "ol/interaction/Select";

interface SelectLocationProps {
  locationsDisplayedOnMap: MapLocation[];
  setGlobalSelectedLocation?: (mapLocation: MapLocation | null) => void;
}

export default function SelectLocation({
  locationsDisplayedOnMap,
  setGlobalSelectedLocation,
}: SelectLocationProps) {
  const mapRef: MutableRefObject<Map | null> = useRef<Map | null>(null);

  const selectInteraction: Select = new Select();

  const locationsVectorSource: MutableRefObject<VectorSource> = useRef(
    new VectorSource()
  );

  const locationsLayer: MutableRefObject<VectorLayer> = useRef(
    createVectorLayer(locationsVectorSource.current)
  );

  function handleSelectEvent(event: SelectEvent) {
    const selectedFeatures: Feature[] = event.selected;

    if (setGlobalSelectedLocation) {
      if (selectedFeatures.length) {
        setGlobalSelectedLocation(selectedFeatures[0].get("location"));
      } else {
        setGlobalSelectedLocation(null);
      }
    }
  }

  function initMap(): Map {
    const map = new Map({
      target: "map-container",
      layers: [BASE_OSM_LAYER, locationsLayer.current],
      view: DEFAULT_INITIAL_VIEW,
      controls: [],
      interactions: defaultInteractions({
        doubleClickZoom: false,
      }),
    });
    map.getView().setZoom(7);

    selectInteraction.on("select", handleSelectEvent);
    map.addInteraction(selectInteraction);

    return map;
  }

  function displayLocationsOnMap(locationsDisplayedOnMap: MapLocation[]) {
    locationsDisplayedOnMap.forEach((mapLocation: MapLocation) => {
      const feature = generateLocationFeature(mapLocation);
      locationsVectorSource.current.addFeature(feature);
    });
  }

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = initMap();
      return () => {
        mapRef.current?.setTarget();
        mapRef.current = null;
      };
    }
  }, []);

  useEffect(() => {
    locationsVectorSource.current.clear();
    displayLocationsOnMap(locationsDisplayedOnMap);
  }, [locationsDisplayedOnMap]);

  return <div className="relative w-full h-full">
    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-65 text-white px-2 py-1 rounded-md z-50">
      Select a location for your post
    </div>
    <div id="map-container" className="absolute inset-0 w-full h-full" />
  </div>;
}
