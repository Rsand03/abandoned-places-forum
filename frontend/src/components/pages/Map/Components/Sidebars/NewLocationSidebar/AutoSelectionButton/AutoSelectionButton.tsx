import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";

interface CategoriesInputProps {
    selectLocationAfterCreating: boolean;
    setSelectLocationAfterCreating: (newState: boolean) => void;
}


function AutoSelectionButton({selectLocationAfterCreating, setSelectLocationAfterCreating}: CategoriesInputProps) {

    const {t}: { t: TFunction } = useTranslation();

    const toggleSelectingState = () => {
        setSelectLocationAfterCreating(!selectLocationAfterCreating);
    };

    return (
        <div className="flex flex-row align-middle">
            <input
                type="checkbox"
                checked={selectLocationAfterCreating}
                onChange={toggleSelectingState}
                style={{accentColor: "black"}}
            />
            <div className="pl-2 text-[0.7rem] text-white">
                {t("map.sidebar.new.detailsView")}
            </div>
        </div>
    );
}

export default AutoSelectionButton;
