import {ChangeEvent, useRef} from "react";
import {NewLocationFormData} from "../../../utils.ts";
import {DEFAULT_LOCATION_NAME} from "../newLocationSidebarUtils.ts";
import {TFunction} from "i18next";
import {useTranslation} from "react-i18next";

interface NameInputProps {
    newLocationFormData: NewLocationFormData;
    setNewLocationFormData: (newData: (prevData: NewLocationFormData) => NewLocationFormData) => void;
}

function NameInput({newLocationFormData, setNewLocationFormData}: NameInputProps) {

    const {t}: { t: TFunction } = useTranslation();

    const nameInputRef = useRef<HTMLInputElement>({} as HTMLInputElement);

    function autoSelectWholeName(){
        if (nameInputRef.current && nameInputRef.current?.value === DEFAULT_LOCATION_NAME) {
            nameInputRef.current?.focus();
            nameInputRef.current?.setSelectionRange(0, nameInputRef.current.value.length);
        }
    }

    function updateFormData(event: ChangeEvent<HTMLInputElement>) {
        setNewLocationFormData((prevData): NewLocationFormData => ({
            ...prevData, name: event.target.value,
        }))
    }


    return (
        <div className="">
            <label htmlFor="location-name" className="block">
                {t("map.sidebar.new.name")}: *
            </label>
            <input
                type="text"
                name="name"
                value={newLocationFormData.name}
                onChange={updateFormData}
                className="w-full mb-3 p-2 rounded text-black h-9"
                ref={nameInputRef}
                onClick={autoSelectWholeName}
            />
        </div>
    );
}

export default NameInput;
