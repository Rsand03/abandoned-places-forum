import Map from "ol/Map.js";
import {defaults as defaultInteractions, Select} from "ol/interaction";
import {Feature, MapBrowserEvent} from "ol";
import {MutableRefObject, useEffect, useRef} from "react";
import {toLonLat} from "ol/proj";
import VectorSource from "ol/source/Vector";
import {
  DEFAULT_INITIAL_VIEW,
  DEFAULT_SELECT_INTERACTION,
  generateLocationFeature,
  generateLocationInProgressFeature,
  generateSelectedFeature,
} from "./mapUtils.ts";
import {MapLocation, SidebarContent} from "../utils.ts";
import {BASE_OSM_LAYER, createNewInProgressLocationLayer, createVectorLayer,} from "./mapLayers.ts";
import VectorLayer from "ol/layer/Vector";
import {SelectEvent} from "ol/interaction/Select";
import LocationLayerSelector from "./LayerControls/LocationLayerSelector.tsx";
import LandBoardLayerSelector from "./LayerControls/LandBoardLayerSelector.tsx";
import TileLayer from "ol/layer/Tile";

interface MapViewProps {
  globalMapClickCoords: number[] | null;
  setGlobalMapClickCoords: (mapClickCoords: number[]) => void;
  globalCoordinateSelectionMode: boolean;
  globalSelectedLocation: MapLocation | null;
  setGlobalSelectedLocation: (mapLocation: MapLocation | null) => void;
  setObliqueAeroPhotoCoords: (
    newObliqueAeroPhotoCoords: number[] | null
  ) => void;
  locationsDisplayedOnMap: MapLocation[];
  sideBarContent: SidebarContent;
}

function MapView({
  globalMapClickCoords,
  setGlobalMapClickCoords,
  globalCoordinateSelectionMode,
  globalSelectedLocation,
  setGlobalSelectedLocation,
  setObliqueAeroPhotoCoords,
  locationsDisplayedOnMap,
  sideBarContent,
}: MapViewProps) {
  const mapRef: MutableRefObject<Map | null> = useRef<Map | null>(null);

  const selectInteraction: Select = DEFAULT_SELECT_INTERACTION;

  const publicLocationsVectorSource: MutableRefObject<VectorSource> = useRef(
    new VectorSource()
  );
  const privateLocationsVectorSource: MutableRefObject<VectorSource> = useRef(
    new VectorSource()
  );
  const newLocationInProgressVectorSource: MutableRefObject<VectorSource> =
    useRef(new VectorSource());
  const selectedLocationsVectorSource: MutableRefObject<VectorSource> = useRef(
    new VectorSource()
  );

  const publicLocationsLayer: MutableRefObject<VectorLayer> = useRef(
    createVectorLayer(publicLocationsVectorSource.current)
  );
  const privateLocationsLayer: MutableRefObject<VectorLayer> = useRef(
    createVectorLayer(privateLocationsVectorSource.current)
  );
  const newLocationInProgressLayer: MutableRefObject<VectorLayer> = useRef(
    createNewInProgressLocationLayer(newLocationInProgressVectorSource.current)
  );
  const selectedLocationsVectorLayer: MutableRefObject<VectorLayer> = useRef(
    createVectorLayer(selectedLocationsVectorSource.current)
  );
  const landBoardBaseLayer: MutableRefObject<TileLayer> = useRef(new TileLayer());
  const landBoardOverlayLayer: MutableRefObject<TileLayer> = useRef(new TileLayer());

  function handleSelectEvent(event: SelectEvent) {
    const selectedFeatures: Feature[] = event.selected;

    if (selectedFeatures.length && !selectedFeatures[0]?.get("isNewLocationInProgress")) {
      setGlobalSelectedLocation(selectedFeatures[0].get("location"));
    } else {
      setGlobalSelectedLocation(null);
    }
  }

  function initMap(): Map {
    const map = new Map({
      target: "map-container",
      layers: [
        BASE_OSM_LAYER,
        landBoardBaseLayer.current,
        landBoardOverlayLayer.current,
        privateLocationsLayer.current,
        publicLocationsLayer.current,
        selectedLocationsVectorLayer.current,
        newLocationInProgressLayer.current,
      ],
      view: DEFAULT_INITIAL_VIEW,
      controls: [],
      interactions: defaultInteractions({
        doubleClickZoom: false,
      }),
    });

    map.on("dblclick", (event: MapBrowserEvent<PointerEvent>) => {
      setObliqueAeroPhotoCoords(toLonLat(event.coordinate).reverse());
    });
    map.on("click", (event: MapBrowserEvent<PointerEvent>) => {
      setGlobalMapClickCoords(toLonLat(event.coordinate).reverse());
      setObliqueAeroPhotoCoords(null);
    });
    selectInteraction.on("select", handleSelectEvent);

    map.addInteraction(selectInteraction);

    return map;
  }

  function displayLocationsOnMap(locationsDisplayedOnMap: MapLocation[]) {
    locationsDisplayedOnMap.forEach((mapLocation: MapLocation) => {
      const feature = generateLocationFeature(mapLocation);
      if (mapLocation.isPublic) {
        publicLocationsVectorSource.current.addFeature(feature);
      } else {
        privateLocationsVectorSource.current.addFeature(feature);
      }
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
    publicLocationsVectorSource.current.clear();
    privateLocationsVectorSource.current.clear();
    selectedLocationsVectorSource.current.clear();
    newLocationInProgressVectorSource.current.clear();

    displayLocationsOnMap(locationsDisplayedOnMap);
  }, [locationsDisplayedOnMap]);

  useEffect(() => {
    selectedLocationsVectorSource.current.clear();
    selectInteraction.getFeatures().clear();
    if (globalSelectedLocation !== null) {
      const feature = generateSelectedFeature(globalSelectedLocation);
      selectInteraction.getFeatures().push(feature);
      selectedLocationsVectorSource.current.addFeature(feature);
    }
  }, [globalSelectedLocation]);

  useEffect(() => {
    if (sideBarContent !== SidebarContent.ADD_NEW_LOCATION) {
      newLocationInProgressVectorSource.current.clear();
    }
  }, [sideBarContent]);

  useEffect(() => {
    if (globalMapClickCoords !== null && globalCoordinateSelectionMode) {
      newLocationInProgressVectorSource.current.clear();
      newLocationInProgressVectorSource.current.addFeature(
        generateLocationInProgressFeature(globalMapClickCoords)
      );
    }
  }, [globalMapClickCoords]);

  return (
    <div>
      <div
        id="map-container"
        className="absolute top-0 left-0 h-screen w-screen"
      />
      <LocationLayerSelector
        publicLayerRef={publicLocationsLayer}
        privateLayerRef={privateLocationsLayer}
        globalSelectedLocation={globalSelectedLocation}
        setGlobalSelectedLocation={setGlobalSelectedLocation}
      />
      <LandBoardLayerSelector
          landBoardBaseLayer={landBoardBaseLayer}
          landBoardOverlayLayer={landBoardOverlayLayer}
      />
    </div>
  );
}

export default MapView;
