import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {LOCATION_IN_PROGRESS_STYLE_CIRCLE, NEW_LOCATION_IN_PROGRESS_STYLE,} from "./mapStyles.ts";
import TileLayer from "ol/layer/Tile";
import {ImageWMS, OSM, XYZ} from "ol/source";
import {TileGrid} from "ol/tilegrid";
import {L_EST} from "./mapUtils.ts";
import {ImageTile, Tile} from "ol";
import ImageLayer from "ol/layer/Image";

export enum LandBoardLayerTypes {
    ORTOPHOTO = "foto",
    RELIEF = "vreljeef",
    BASIC = "kaart",
    HYBRID = "hybriid"
}


export const BASE_OSM_LAYER: TileLayer<OSM> = new TileLayer({
    source: new OSM(),
});


export const createVectorLayer = (source: VectorSource) =>
    new VectorLayer({
        source,
    });


export const createNewInProgressLocationLayer = (source: VectorSource) =>
    new VectorLayer({
        source,
        style: [LOCATION_IN_PROGRESS_STYLE_CIRCLE, NEW_LOCATION_IN_PROGRESS_STYLE]
    });


export const createLandBoardTileMapSource = (mapType: LandBoardLayerTypes, tileFormat: string = "jpg") => {
    return new XYZ({
        projection: L_EST,
        tileGrid: new TileGrid({
            extent: [40500, 5993000, 1064500, 7017000],
            minZoom: 3,
            resolutions: [
                4000, 2000, 1000, 500, 250, 125, 62.5, 31.25, 15.625, 7.8125,
                3.90625, 1.953125, 0.9765625, 0.48828125, 0.244140625,
            ],
        }),
        url: `https://tiles.maaamet.ee/tm/tms/1.0.0/${mapType}/{z}/{x}/{-y}.${tileFormat}`,
        tileLoadFunction: removeWhiteBordersHack,
    });
};


function removeWhiteBordersHack(tile: Tile, src: string) {
    const imageTile = tile as ImageTile;
    const image = imageTile.getImage() as HTMLImageElement;
    image.crossOrigin = "anonymous";

    const tileCoord = tile.getTileCoord();
    const zoom = tileCoord[0];
    const x = tileCoord[1];
    const y = tileCoord[2];

    const numberOfTilesHorizontally = Math.pow(2, zoom);
    const numberOfTilesVertically = Math.pow(2, zoom);

    const leftBoundary = Math.floor(numberOfTilesHorizontally * 0.25);
    const rightBoundary = Math.floor(numberOfTilesHorizontally * 0.75);
    const topBoundary = Math.floor(numberOfTilesVertically * 0.38);
    const bottomBoundary = Math.floor(numberOfTilesVertically * 0.65);

    if (x < leftBoundary || x >= rightBoundary || y < topBoundary || y >= bottomBoundary) {
        tile.setState(3);
        return;
    }
    image.src = src;
}


// this WMS would probably violate Estonian Land Board API terms of service, a TMS should be used instead if possible
export const createImageLayer = () => {
    return new ImageLayer({
        source: new ImageWMS({
            url: 'https://xgis.maaamet.ee/xgis2/service/r979dl',
            params: {
                REQUEST: 'GetMap',
                SERVICE: 'WMS',
                LAYERS: 'EESTIFOTO',
                VERSION: '1.1.1',
                FORMAT: 'image/jpeg', // Use JPEG format as in the example
                STYLES: '',
                TRANSPARENT: true,
            },
            projection: 'EPSG:3301', // Use EPSG:3301 projection
            ratio: 1, // Prevent blurry images (adjust as needed)
        }),
    });
};


// this WMS would probably violate Estonian Land Board API terms of service, a TMS should be used instead if possible
export const createLandBoardWmsSource = () => {
    return new ImageWMS({
        url: 'https://xgis.maaamet.ee/xgis2/service/1gj4lm9',
        params: {
            REQUEST: 'GetMap',
            SERVICE: 'WMS',
            VERSION: '1.1.1',
            FORMAT: 'image/jpeg',
            STYLES: '',
            TRANSPARENT: true,
            LAYERS: 'EESTIFOTO',
            SRS: 'EPSG:3301',
        },
        serverType: 'geoserver',
        projection: L_EST,
    });
};
