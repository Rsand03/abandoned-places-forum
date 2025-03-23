import { useEffect, useState } from "react";

interface AeroPhotoProps {
  selectedCoords: number[] | null;
}

export default function AeroPhoto({ selectedCoords }: AeroPhotoProps) {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCoords != null) {
      setIframeUrl(
        `https://fotoladu.maaamet.ee/etak.php?B=${selectedCoords[0]}&L=${selectedCoords[1]}&fotoladu`
      );
    } else {
      setIframeUrl(null);
    }
  }, [selectedCoords]);

  return (
    <div className="w-full h-full">
      {iframeUrl != null && (
        <div className="w-full h-full">
          <iframe
            src={iframeUrl}
            className="w-full h-full border-white rounded-tl rounded-bl"
          ></iframe>
        </div>
      )}
    </div>
  );
}
