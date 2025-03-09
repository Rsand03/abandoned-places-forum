import { useEffect, useState } from "react";
import {useIsMobile} from "../../../../../hooks/use-mobile.tsx";

interface ObliqueAeroPhotoContainerProps {
  obliqueAeroPhotoCoords: number[] | null;
  isSidebarOpen: boolean;
}

function ObliqueAeroPhotoContainer({
  obliqueAeroPhotoCoords,
  isSidebarOpen,
}: ObliqueAeroPhotoContainerProps) {

  const isMobile = useIsMobile();
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (obliqueAeroPhotoCoords != null) {
      setIframeUrl(
        `https://fotoladu.maaamet.ee/etak.php?B=${obliqueAeroPhotoCoords[0]}&L=${obliqueAeroPhotoCoords[1]}&fotoladu`
      );
    } else {
      setIframeUrl(null);
    }
  }, [obliqueAeroPhotoCoords]);

  return (
    <div>
      {iframeUrl != null && (
        <div
          className="absolute p-0.5 bg-white rounded-lg z-50"
          style={{
            width: !isMobile ? isSidebarOpen ? "50vw" : "70vw" : "90vw",
            height: "75vh",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "10px solid #fff",
            top: "50%",
            left: isSidebarOpen && !isMobile ? "calc(50% - 300px)" : "50%",
            transform: "translate(-50%, -50%)",
            transition: "width 0.5s ease, left 0.5s ease",
          }}
        >
          <iframe
            src={iframeUrl}
            className="w-full h-full border-2 border-white rounded-tl rounded-bl"
          ></iframe>
          <button
            className="
                        absolute -top-6 -right-6 w-8 h-8 bg-red-500 rounded-full shadow-lg
                         flex items-center justify-center text-white font-bold cursor-pointer
                          transition-transform transform hover:scale-110 z-50"
            onClick={() => setIframeUrl(null)}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}

export default ObliqueAeroPhotoContainer;
