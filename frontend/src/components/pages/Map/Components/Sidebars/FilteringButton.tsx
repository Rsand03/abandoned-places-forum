import {SidebarContent} from "../utils.ts";

interface FilteringButtonProps {
    sidebarContent: SidebarContent;
    isSidebarOpen: boolean;
}


function FilteringButton({ sidebarContent, isSidebarOpen }: FilteringButtonProps) {
    return (
        <div
            className="fixed top-56 right-0 border-4 border-black text-white w-20 h-16 flex items-center justify-center rounded-l-lg transition-transform duration-500 ease-in-out"
            style={{
                backgroundColor: sidebarContent === SidebarContent.FILTERING ? "rgba(256, 256, 256, 0.7)" : "rgba(0, 0, 0, 0.75)",
                transform: isSidebarOpen ? "translateX(-500px)" : "translateX(0)"
            }}
        >
            <img
                src={`https://img.icons8.com/?size=100&id=10752&format=png&color=${
                    sidebarContent === SidebarContent.FILTERING ? "000000" : "FFFFFF"
                }`}
                className="w-7 h-7 transition-none"
                alt="img"
            />
        </div>
    );
}

export default FilteringButton;