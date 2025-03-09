import {MapLocation} from "../../utils.ts";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";

interface LandBoardButtonProps {
    location: MapLocation;
}

function LandBoardButton({location}: LandBoardButtonProps) {

    const {t}: { t: TFunction } = useTranslation();

    function handleClick() {
        const {lat, lon} = location;
        const url = `https://fotoladu.maaamet.ee/?basemap=hybriidk&zlevel=14,${lon},${lat}&overlay=avaleht&etak=${lon},${lat}`;
        window.open(url, "_blank");
    }

    return (
        <div>
            <button
                className="bg-green-700 text-white py-2 px-3 rounded-sm shadow-md hover:bg-green-600 transition-all flex items-center space-x-2 h-7"
                onClick={handleClick}
            >
                <span>{t("map.sidebar.details.landBoardLink")}</span>
                <img
                    src="https://img.icons8.com/?size=100&id=hUqP035cA2Bd&format=png&color=FFFFFF"
                    alt="Open in new window"
                    className="w-5 h-5"
                />
            </button>
        </div>

    );
}

export default LandBoardButton;
