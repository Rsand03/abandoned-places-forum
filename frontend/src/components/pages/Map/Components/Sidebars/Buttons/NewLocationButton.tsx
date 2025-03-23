import {SidebarContent} from "../../utils.ts";
import {SIDEBAR_TRANSITION_DURATION} from "../../../MapPage.tsx";
import {useIsMobile} from "../../../../../../hooks/use-mobile.tsx";

interface NewLocationButtonProps {
    sidebarContent: SidebarContent;
    isSidebarOpen: boolean;
    manageSidebar: (newContent: SidebarContent) => void;
    globalCoordinateSelectionMode: boolean;
}


function NewLocationButton({ sidebarContent, isSidebarOpen, manageSidebar, globalCoordinateSelectionMode }: NewLocationButtonProps) {

    const isMobile = useIsMobile();

    return (
        <button
            onClick={() => manageSidebar(SidebarContent.ADD_NEW_LOCATION)}
        >
            <div
                className="fixed top-32 right-0 border-4 border-black w-20 h-16 flex items-center justify-center
             rounded-l-lg transition-transform ease-in-out"
                style={{
                    backgroundColor: sidebarContent === SidebarContent.ADD_NEW_LOCATION ? 'rgba(256, 256, 256, 0.7)' : 'rgba(0, 0, 0, 0.75)',
                    transform: isSidebarOpen && !(globalCoordinateSelectionMode && isMobile) ? 'translateX(-500px)' : 'translateX(0)',
                    color: sidebarContent === SidebarContent.ADD_NEW_LOCATION ? 'black' : 'white',
                    transitionDuration: `${SIDEBAR_TRANSITION_DURATION}ms`,
                }}
            >
                {/*Didn't find a suitable (free) icon*/}
                <img
                    src={`https://img.icons8.com/?size=256&id=85353&format=png&color=${sidebarContent === SidebarContent.ADD_NEW_LOCATION ? '000000' : 'FFFFFF'}`}
                    className="w-8 h-8 transition-none"
                    alt="New Location Icon"
                />
                <span className="text-xl font-bold mb-8 -ml-2">+</span>
            </div>
        </button>
    );
}

export default NewLocationButton;