import {useEffect, useState} from "react";
import {TFunction} from "i18next";
import {useTranslation} from "react-i18next";



export default function LocationBookmarks({
  locationId,
}: {
  locationId: string;
}) {

  // TODO: Move fetches to a separate service
  {/*All logic related to bookmarks must be refactored in the future to be 'id-based'*/}

  const {t}: { t: TFunction } = useTranslation();

  const bookmarkTypes = [
    { type: "JAA_MEELDE", label: "Jäta meelde" },
    { type: "JUBA_KULASTATUD", label: "Juba külastatud" },
    { type: "SUUR_RISK", label: "Suur risk" },
    { type: "OSALISELT_AVASTATUD", label: "Osaliselt avastatud" },
  ];

  const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([]);

  // Get userId from localStorage
  const userId = localStorage.getItem("userId");
  const userToken = localStorage.getItem("userToken");

  // Check if the bookmark exists
  useEffect(() => {
    if (!userId) {
      console.error("User is not logged in");
      return;
    }

    const fetchBookmarks = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/location-bookmarks?userId=${userId}&locationId=${locationId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        const bookmarkTypes = data.map(
          (bookmark: { type: string }) => bookmark.type
        );

        setSelectedBookmarks(bookmarkTypes);
      } catch (error) {
        console.error("Error fetching bookmarks", error);
      }
    };

    fetchBookmarks();
  }, [userId, locationId]);

  // Toggle the bookmark state
  const handleCheckboxChange = async (type: string, label: string) => {
    if (!userId) {
      console.error("User is not logged in");
      return;
    }

    const isChecked = selectedBookmarks.includes(label);

    try {
      if (isChecked) {
        // Remove the bookmark
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/location-bookmarks?userId=${userId}&locationId=${locationId}&bookmarkType=${type}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (response.ok) {
          setSelectedBookmarks((prev) =>
            prev.filter((bookmark) => bookmark !== label)
          );
        } else {
          throw new Error("Failed to delete the bookmark");
        }
      } else {
        // Add the bookmark
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/location-bookmarks`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type,
              createdByUserUuid: userId,
              locationId,
            }),
          }
        );

        if (response.ok) {
          setSelectedBookmarks((prev) => [...prev, label]);
        } else {
          throw new Error("Failed to create the bookmark");
        }
      }
    } catch (error) {
      console.error("Error updating bookmark", error);
    }
  };

  return (
    <div className="absolute top-24 left-6 bg-black bg-opacity-75 rounded-lg p-1.5 pl-2">
      {bookmarkTypes.slice(0, 2).map(({ type, label }) => (
        <div className="flex items-center" key={type}>
          <input
            type="checkbox"
            id={type}
            checked={selectedBookmarks.includes(label)}
            onChange={() => handleCheckboxChange(type, label)}
            className="w-5 h-5"
          />
          <label className="ml-2 text-slate-100" htmlFor={type}>
            {type === "JAA_MEELDE" ? t("location.temporaryBookmark.remember") : t("location.temporaryBookmark.alreadyVisited")}
          </label>
          {/*Temp. fix to handle translation. All logic related to bookmarks must be refactored in the future to be 'id-based'*/}
        </div>
      ))}
    </div>
  );
}
