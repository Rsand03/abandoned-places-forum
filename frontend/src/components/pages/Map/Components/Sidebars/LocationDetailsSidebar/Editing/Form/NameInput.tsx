import {ChangeEvent, useRef} from "react";
import {EditLocationFromData} from "../../../../utils.ts";
import {DEFAULT_LOCATION_NAME} from "../../../NewLocationSidebar/newLocationSidebarUtils.ts";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";

interface NameInputProps {
    editLocationFormData: EditLocationFromData;
    setEditLocationFormData: (newData: (prevData: EditLocationFromData) => EditLocationFromData) => void;
}

function NameInput({editLocationFormData, setEditLocationFormData}: NameInputProps) {

    const {t}: { t: TFunction } = useTranslation();
    const nameInputRef = useRef<HTMLInputElement>({} as HTMLInputElement);

    function autoSelectWholeName(){
        if (nameInputRef.current && nameInputRef.current?.value === DEFAULT_LOCATION_NAME) {
            nameInputRef.current?.focus();
            nameInputRef.current?.setSelectionRange(0, nameInputRef.current.value.length);
        }
    }

    function updateFormData(event: ChangeEvent<HTMLInputElement>) {
        setEditLocationFormData((prevData): EditLocationFromData => ({
            ...prevData, name: event.target.value,
        }))
    }


    return (
        <div className="">
            <label htmlFor="location-name" className="block">
                {t("map.sidebar.details.editing.name")}: *
            </label>
            <input
                type="text"
                name="name"
                value={editLocationFormData.name}
                onChange={updateFormData}
                className="w-full mb-3 p-2 rounded text-black h-9"
                ref={nameInputRef}
                onClick={autoSelectWholeName}
            />
        </div>
    );
}

export default NameInput;
