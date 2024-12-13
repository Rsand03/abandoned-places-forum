import {Feature} from "ol";
import {Point} from "ol/geom";
import TileLayer from "ol/layer/Tile";
import {fromLonLat, transform} from "ol/proj";
import {OSM} from "ol/source";
import {MapLocation} from "../utils.ts";

export const WGS84 = "EPSG:4326";
export const MERCATOR = "EPSG:3857";

export const INITIAL_MAP_VIEW_CENTRE_LON_LAT = [25.5, 58.8]
export const INITIAL_MAP_VIEW_CENTRE_MERCATOR = transform(INITIAL_MAP_VIEW_CENTRE_LON_LAT, WGS84, MERCATOR);

export const BASE_MAP_LAYER = new TileLayer({
  source: new OSM(),
});

export function generateLocationFeature(location: MapLocation) {
  return new Feature({
    geometry: new Point(fromLonLat([location.lon, location.lat])),
    location: location,
  });
}



