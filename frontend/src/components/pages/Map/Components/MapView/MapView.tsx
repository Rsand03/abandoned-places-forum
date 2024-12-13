import Map from 'ol/Map.js';
import {defaults as defaultInteractions, Select} from 'ol/interaction';
import {Feature, MapBrowserEvent, View} from "ol";
import {useEffect, useRef} from "react";
import {toLonLat} from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {BASE_MAP_LAYER, generateLocationFeature, INITIAL_MAP_VIEW_CENTRE_MERCATOR} from "./mapUtils.ts";
import {LOCATION_LAYER_DEFAULT_STYLE, SELECTED_LOCATION_STYLE_RECTANGLE} from "./mapStyles.ts";
import {MapLocation} from "../utils.ts";


interface MapViewProps {
    locationsDisplayedOnMap: MapLocation[];
    setSelectedLocationInParent: (mapLocation: MapLocation | null) => void;
    applyNewLocationCoords: (mapClickCoords: number[]) => void;
    applyObliqueAeroPhotoCoords: (newObliqueAeroPhotoCoords: number[] | null) => void;
}


export default function MapView({ locationsDisplayedOnMap, setSelectedLocationInParent, applyNewLocationCoords,applyObliqueAeroPhotoCoords }: MapViewProps) {
    const mapRef = useRef<Map | null>(null);
    const publicLocationsVectorSource = useRef(new VectorSource<Feature>());
    const privateLocationsVectorSource = useRef(new VectorSource<Feature>());

    const publicLocationsLayer = useRef(
        new VectorLayer({
            source: publicLocationsVectorSource.current,
            style: LOCATION_LAYER_DEFAULT_STYLE,
        })
    );
    const privateLocationsLayer = useRef(
        new VectorLayer({
            source: privateLocationsVectorSource.current,
            style: LOCATION_LAYER_DEFAULT_STYLE,
        })
    );

    useEffect(() => {
        if (!mapRef.current) {
            const map = new Map({
                target: "map-element",
                layers: [BASE_MAP_LAYER, privateLocationsLayer.current, publicLocationsLayer.current],
                view: new View({
                    center: INITIAL_MAP_VIEW_CENTRE_MERCATOR,
                    zoom: 8,
                }),
                controls: [],
                interactions: defaultInteractions({
                    doubleClickZoom: false,
                }),
            });


            map.on('dblclick', (event: MapBrowserEvent<PointerEvent>) => {
                applyObliqueAeroPhotoCoords(toLonLat(event.coordinate).reverse());
            });
            map.on('click', (event: MapBrowserEvent<PointerEvent>) => {
                applyNewLocationCoords(toLonLat(event.coordinate).reverse());
            });


            const selectInteraction = new Select({
                style: [SELECTED_LOCATION_STYLE_RECTANGLE, LOCATION_LAYER_DEFAULT_STYLE],
            });
            selectInteraction.on("select", (event) => {
                if (event.selected.length !== 0) {
                    setSelectedLocationInParent(event.selected[0].get("location"));
                } else if (event.deselected.length !== 0) {
                    setSelectedLocationInParent(null);
                }
            });
            map.addInteraction(selectInteraction);


            mapRef.current = map;

            return () => {
                map.setTarget();
                mapRef.current = null;
            };
        }
    }, []);


    useEffect(() => {
        publicLocationsVectorSource.current.clear();
        privateLocationsVectorSource.current.clear();

        locationsDisplayedOnMap.forEach((location: MapLocation) => {
            const feature = generateLocationFeature(location);
            if (location.isPublic) {
                publicLocationsVectorSource.current.addFeature(feature);
            } else {
                privateLocationsVectorSource.current.addFeature(feature);
            }
        });
    }, [locationsDisplayedOnMap]);
git pull
    return (
        <div>
            <div id="map-element" className="absolute top-0 left-0 h-screen w-screen"/>
        </div>
    );
}
