import {ChangeEvent, useRef} from "react";
import {NewLocationFormData} from "../../../utils.ts";
import {DEFAULT_LOCATION_NAME} from "../newLocationSidebarUtils.ts";

interface NameInputProps {
    newLocationFormData: NewLocationFormData;
    setNewLocationFormData: (newData: (prevData: NewLocationFormData) => NewLocationFormData) => void;
}

function NameInput({newLocationFormData, setNewLocationFormData}: NameInputProps) {

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
                Nimi: *
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
