import {SidebarContent} from "../utils.ts";

interface NewLocationButtonProps {
    sidebarContent: SidebarContent;
    isSidebarOpen: boolean;
}


function NewLocationButton({ sidebarContent, isSidebarOpen }: NewLocationButtonProps) {
    return (
        <div
            className="fixed top-32 right-0 border-4 border-black w-20 h-16 flex items-center justify-center rounded-l-lg transition-transform duration-500 ease-in-out"
            style={{
                backgroundColor: sidebarContent === SidebarContent.NEW_LOCATION ? 'rgba(256, 256, 256, 0.7)' : 'rgba(0, 0, 0, 0.75)',
                transform: isSidebarOpen ? 'translateX(-500px)' : 'translateX(0)',
                color: sidebarContent === SidebarContent.NEW_LOCATION ? 'black' : 'white',
            }}
        >
            {/*Didn't find a suitable (free) icon*/}
            <img
                src={`https://img.icons8.com/?size=256&id=85353&format=png&color=${sidebarContent === SidebarContent.NEW_LOCATION ? '000000' : 'FFFFFF'}`}
                className="w-8 h-8 transition-none"
                alt="New Location Icon"
            />
            <span className="text-xl font-bold mb-8 -ml-2">+</span>
        </div>
    );
}

export default NewLocationButton;