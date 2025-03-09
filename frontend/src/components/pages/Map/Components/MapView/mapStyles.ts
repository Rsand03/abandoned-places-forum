import {Fill, Icon, RegularShape, Stroke, Style} from "ol/style";
import CircleStyle from "ol/style/Circle";


export function generateColoredLocationStyle(colorHex: string): Style {
    return new Style({
        image: new Icon({
            src: `https://img.icons8.com/?size=128&id=85353&format=png&color=${colorHex.toLowerCase()}`,
            scale: 0.25,
            displacement: [0, 13],
        }),
    });
}


export const LOCATION_LAYER_DEFAULT_STYLE = new Style({
    image: new Icon({
        src: "https://img.icons8.com/?size=128&id=85353&format=png&color=2196f3",
        scale: 0.25,
    }),
});


export const NEW_LOCATION_IN_PROGRESS_STYLE = new Style({
    image: new Icon({
        src: "https://img.icons8.com/?size=128&id=85353&format=png&color=A9A9A9",
        scale: 0.25,
        displacement: [0, 13],
    }),
});


export const SELECTED_LOCATION_STYLE_RECTANGLE = new Style({
    image: new RegularShape({
        points: 4,
        radius: 27,
        angle: Math.PI / 4,
        fill: new Fill({
            color: 'rgba(250, 250, 250, 0.75)',
        }),
        stroke: new Stroke({
            color: 'black',
            width: 2,
            lineDash: [4, 4],
        }),
        displacement: [0, 13],
    })
});


export const LOCATION_IN_PROGRESS_STYLE_CIRCLE = new Style({
    image: new CircleStyle({
        radius: 12,
        fill: new Fill({
            color: 'rgba(250, 250, 250, 0.75)',
        }),
        stroke: new Stroke({
            color: 'black',
            width: 2,
            lineDash: [4, 4],
        }),
        displacement: [0, 1],
    })
});
