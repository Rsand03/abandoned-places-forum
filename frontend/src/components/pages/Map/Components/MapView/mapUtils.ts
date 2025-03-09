import {Feature, View} from "ol";
import {Point} from "ol/geom";
import {fromLonLat, transform} from "ol/proj";
import {MapLocation} from "../utils.ts";
import {Select} from "ol/interaction";
import {generateColoredLocationStyle, SELECTED_LOCATION_STYLE_RECTANGLE} from "./mapStyles.ts";
import proj4 from "proj4";
import {register} from "ol/proj/proj4";

export const WGS84 = "EPSG:4326";
export const MERCATOR = "EPSG:3857";
export const L_EST = "EPSG:3301";

proj4.defs(
    L_EST,
    "+proj=lcc +lat_1=59.33333333333334 +lat_2=58 +lat_0=57.51755393055556 +lon_0=24 +x_0=500000 +y_0=6375000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
);
register(proj4);


export const INITIAL_MAP_VIEW_CENTRE_WGS84 = [25.5, 58.8];
export const DEFAULT_INITIAL_VIEW = new View({
  center: transform(INITIAL_MAP_VIEW_CENTRE_WGS84, WGS84, MERCATOR),
  zoom: 8,
  constrainResolution: true,
})

export const DEFAULT_SELECT_INTERACTION: Select = new Select({
  style: null,
});


export function generateLocationFeature(mapLocation: MapLocation): Feature<Point> {
  const feature = new Feature({
    geometry: new Point(fromLonLat([mapLocation.lon, mapLocation.lat])),
    location: mapLocation,
    isNewLocationInProgress: false,
  });

  feature.setStyle(generateColoredLocationStyle(mapLocation.mainCategory.colorHex));
  return feature;
}


export function generateSelectedFeature(mapLocation: MapLocation): Feature<Point> {
  const feature = new Feature({
    geometry: new Point(fromLonLat([mapLocation.lon, mapLocation.lat])),
    location: mapLocation,
    isNewLocationInProgress: false,
  });

  const coloredMapPinStyle = generateColoredLocationStyle(mapLocation.mainCategory.colorHex);
  const styles = [SELECTED_LOCATION_STYLE_RECTANGLE, coloredMapPinStyle];
  feature.setStyle(styles);

  return feature;
}


export function generateLocationInProgressFeature(newLocationCoords: number[]) {
  return new Feature({
    geometry: new Point(fromLonLat([newLocationCoords[1], newLocationCoords[0]])),
    isNewLocationInProgress: true,
  });
}
