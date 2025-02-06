import {SidebarContent} from "../../utils.ts";
import {SIDEBAR_TRANSITION_DURATION} from "../../../MapPage.tsx";

interface FilteringButtonProps {
    sidebarContent: SidebarContent;
    isSidebarOpen: boolean;
    manageSidebar: (newContent: SidebarContent) => void;

}

function FilteringButton({ sidebarContent, isSidebarOpen, manageSidebar }: FilteringButtonProps) {
    return (
        <button
            onClick={() => manageSidebar(SidebarContent.FILTER)}
        >
            <div
                className="fixed top-56 right-0 border-4 border-black text-white w-20 h-16 flex items-center justify-center
                 rounded-l-lg transition-transform ease-in-out"
                style={{
                    backgroundColor: sidebarContent === SidebarContent.FILTER ? "rgba(256, 256, 256, 0.7)" : "rgba(0, 0, 0, 0.75)",
                    transform: isSidebarOpen ? "translateX(-500px)" : "translateX(0)",
                    transitionDuration: `${SIDEBAR_TRANSITION_DURATION}ms`,
                }}
            >
                <img
                    src={`https://img.icons8.com/?size=100&id=10752&format=png&color=${
                        sidebarContent === SidebarContent.FILTER ? "000000" : "FFFFFF"
                    }`}
                    className="w-7 h-7 transition-none"
                    alt="img"
                />
            </div>
        </button>
    );
}

export default FilteringButton;