interface CategoriesInputProps {
    selectLocationAfterCreating: boolean;
    setSelectLocationAfterCreating: (newState: boolean) => void;
}


function AutoSelectionButton({selectLocationAfterCreating, setSelectLocationAfterCreating}: CategoriesInputProps) {

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
                Kuva peale lisamist detailvaade
            </div>
        </div>
    );
}

export default AutoSelectionButton;
