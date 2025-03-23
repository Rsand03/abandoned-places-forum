import {useEffect, useState} from "react";
import emitter from "../../../../../../emitter/eventEmitter.ts";
import {LocationAttributes, MapLocation} from "../../utils.ts";
import LocationService from "../../../../../../service/LocationService.ts";
import {useToast} from "../../../../../../hooks/use-toast.ts";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";

interface FilteringSidebarProps {
    applyFilters: (filteredLocations: MapLocation[]) => void;
}

function FilteringSidebar({applyFilters}: FilteringSidebarProps) {
    // TODO refactor this whole component
    const API_URL = import.meta.env.VITE_API_URL;
    const {t}: { t: TFunction } = useTranslation();

    const bookmarkTypes = [
        { type: "JAA_MEELDE", label: "Jäta meelde" },
        { type: "JUBA_KULASTATUD", label: "Juba külastatud" },
        { type: "SUUR_RISK", label: "Suur risk" },
        { type: "OSALISELT_AVASTATUD", label: "Osaliselt avastatud" },
    ];

    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isConditionsOpen, setIsConditionsOpen] = useState(false);
    const [isStatusesOpen, setIsStatusesOpen] = useState(false);
    const [isBookmarkTypesOpen, setIsBookmarkTypesOpen] = useState(false);

    const toggleDropdown = (type: string) => {
        switch (type) {
            case 'categories':
                setIsCategoriesOpen(!isCategoriesOpen);
                break;
            case 'conditions':
                setIsConditionsOpen(!isConditionsOpen);
                break;
            case 'statuses':
                setIsStatusesOpen(!isStatusesOpen);
                break;
            case 'bookmarkTypes':
                setIsBookmarkTypesOpen(!isBookmarkTypesOpen);
                break;
            default:
                break;
        }
    };

    const [categories, setCategories] = useState<{ id: number; name: string }[]>(
        []
    );
    const [conditions, setConditions] = useState<{ id: number; name: string }[]>(
        []
    );
    const [statuses, setStatuses] = useState<{ id: number; name: string }[]>([]);

    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedConditions, setSelectedConditions] = useState<number[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);
    const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([]);

    const [filterMainCategoriesOnly, setFilterMainCategoriesOnly] = useState(false);

    const {toast} = useToast();

    const fetchLocationsWithParams = async (queryParams: URLSearchParams) => {
        try {
            emitter.emit("startLoading");
            const userToken = localStorage.getItem("userToken");
            console.log(queryParams);
            const response = await fetch(`${API_URL}/api/locations?${queryParams}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            applyFilters(data);
        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            emitter.emit("stopLoading");
        }
    };

    useEffect(() => {
        LocationService.fetchLocationAttributes(toast).then(
            (locationAttributes: LocationAttributes | null) => {
                if (locationAttributes) {
                    setCategories(locationAttributes.categories);
                    setConditions(locationAttributes.conditions);
                    setStatuses(locationAttributes.statuses);
                }
            }
        );
    }, []);

    const handleCategoryChange = (id: number) => {
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
        );
    };
    const handleConditionChange = (id: number) => {
        setSelectedConditions((prev) =>
            prev.includes(id) ? prev.filter((condId) => condId !== id) : [...prev, id]
        );
    };
    const handleStatusChange = (id: number) => {
        setSelectedStatuses((prev) =>
            prev.includes(id) ? prev.filter((statId) => statId !== id) : [...prev, id]
        );
    };

    const handleBookmarkChange = (type: string) => {
        setSelectedBookmarks((prev) =>
            prev.includes(type) ? prev.filter((bookmarkType) => bookmarkType !== type) : [...prev, type]
        );
    };

    const toggleAll = (list: any[], selectedList: any[], setSelectedList: Function) => {
        if (list.length === selectedList.length) {
            setSelectedList([]);
        } else {
            setSelectedList(list.map((item) => item.id || item.type));
        }
    };


    const handleApplyFilters = async () => {
        try {
            const queryParams = new URLSearchParams();

            queryParams.append("filterByMainCategoryOnly", String(filterMainCategoriesOnly));

            if (selectedCategories.length > 0) {
                selectedCategories.forEach((subCategoryId) => {
                    queryParams.append("categoryIds", String(subCategoryId));
                });
            }
            if (selectedConditions.length > 0) {
                selectedConditions.forEach((conditionId) => {
                    queryParams.append("conditionIds", String(conditionId));
                });
            }
            if (selectedStatuses.length > 0) {
                selectedStatuses.forEach((statusId) => {
                    queryParams.append("statusIds", String(statusId));
                });
            }

            if (selectedBookmarks.length > 0) {
                selectedBookmarks.forEach((bookmarkType) => {
                    const bookmarkLabel = bookmarkTypes.find(
                        (bookmark) => bookmark.type === bookmarkType
                    )?.label;

                    if (bookmarkLabel) {
                        queryParams.append("bookmarkTypes", bookmarkLabel);
                    }
                });
            }

            await fetchLocationsWithParams(queryParams);
        } catch (error) {
            console.error("Error applying filters:", error);
        }
    };

    return (
        <div className="p-8 h-full w-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-white">{t("map.sidebar.filtering.title")}</h2>
            <div className="pt-16 text-white">

                {/* Categories Section */}
                <div className="mb-4">
                    <button
                        onClick={() => toggleDropdown('categories')}
                        className="flex font-semibold items-center mb-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className={`mr-2 w-4 h-4 transform transition-transform ${
                                isCategoriesOpen ? 'rotate-180' : 'rotate-0'
                            }`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                        {t("map.sidebar.filtering.category")}
                    </button>
                    {isCategoriesOpen && (
                        <div className="ml-8">
                            <label className=" flex items-center">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={filterMainCategoriesOnly}
                                    onChange={() =>
                                        setFilterMainCategoriesOnly((prev) => !prev)
                                    }
                                />
                                {t("map.sidebar.filtering.mustBeMainCategory")} *
                            </label>
                            <button
                                onClick={() =>
                                    toggleAll(categories, selectedCategories, setSelectedCategories)
                                }
                                className="text-sm bg-black rounded-sm px-1"
                            >
                                {categories.length === selectedCategories.length
                                    ? t("map.sidebar.filtering.unselectAll")
                                    : t("map.sidebar.filtering.selectAll")}
                            </button>
                            <ul className="list-none">
                                {categories.map((category) => (
                                    <li key={category.id} className="mt-1">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="mr-2"
                                                checked={selectedCategories.includes(category.id)}
                                                onChange={() => handleCategoryChange(category.id)}
                                            />
                                            {t(`location.category.${category.id}`)}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Conditions Section */}
                <div className="mb-4">
                    <button
                        onClick={() => toggleDropdown('conditions')}
                        className="flex font-semibold items-center mb-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className={`mr-2 w-4 h-4 transform transition-transform ${
                                isConditionsOpen ? 'rotate-180' : 'rotate-0'
                            }`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                        {t("map.sidebar.filtering.condition")}
                    </button>
                    {isConditionsOpen && (
                        <div className="ml-8">
                            <button
                                onClick={() =>
                                    toggleAll(conditions, selectedConditions, setSelectedConditions)
                                }
                                className="text-sm bg-black rounded-sm px-1"
                            >
                                {conditions.length === selectedConditions.length
                                    ? t("map.sidebar.filtering.unselectAll")
                                    : t("map.sidebar.filtering.selectAll")}
                            </button>
                            <ul className="list-none">
                                {conditions.map((condition) => (
                                    <li key={condition.id} className="mt-1">
                                        <li key={condition.id} className="mt-1">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2"
                                                    checked={selectedConditions.includes(condition.id)}
                                                    onChange={() => handleConditionChange(condition.id)}
                                                />
                                                {t(`location.condition.${condition.id}`)}
                                            </label>
                                        </li>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Statuses Section */}
                <div className="mb-4">
                    <button
                        onClick={() => toggleDropdown('statuses')}
                        className="flex font-semibold items-center mb-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className={`mr-2 w-4 h-4 transform transition-transform ${
                                isStatusesOpen ? 'rotate-180' : 'rotate-0'
                            }`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                        {t("map.sidebar.filtering.status")}
                    </button>
                    {isStatusesOpen && (
                        <div className="ml-8">
                            <button
                                onClick={() =>
                                    toggleAll(statuses, selectedStatuses, setSelectedStatuses)
                                }
                                className="text-sm bg-black rounded-sm px-1"
                            >
                                {statuses.length === selectedStatuses.length
                                    ? t("map.sidebar.filtering.unselectAll")
                                    : t("map.sidebar.filtering.selectAll")}
                            </button>
                            <ul className="list-none">
                                {statuses.map((status) => (
                                    <li key={status.id} className="mt-1">
                                        <li key={status.id} className="mt-1">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2"
                                                    checked={selectedStatuses.includes(status.id)}
                                                    onChange={() => handleStatusChange(status.id)}
                                                />
                                                {t(`location.status.${status.id}`)}
                                            </label>
                                        </li>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Bookmark Types Section */}
                <div className="mb-4">
                    <button
                        onClick={() => toggleDropdown('bookmarkTypes')}
                        className="flex font-semibold items-center mb-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className={`mr-2 w-4 h-4 transform transition-transform ${
                                isBookmarkTypesOpen ? 'rotate-180' : 'rotate-0'
                            }`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                        {t("map.sidebar.filtering.bookmark")}
                    </button>
                    {isBookmarkTypesOpen && (
                        <div className="ml-8">
                            <button
                                onClick={() =>
                                    toggleAll(
                                        bookmarkTypes,
                                        selectedBookmarks,
                                        setSelectedBookmarks
                                    )
                                }
                                className="text-sm bg-black rounded-sm px-1"
                            >
                                {bookmarkTypes.length === selectedBookmarks.length
                                    ? t("map.sidebar.filtering.unselectAll")
                                    : t("map.sidebar.filtering.selectAll")}
                            </button>
                            <ul className="list-none">
                                {bookmarkTypes.slice(0, 2).map((bookmark) => (
                                    <li key={bookmark.type} className="mt-1">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="mr-2"
                                                checked={selectedBookmarks.includes(bookmark.type)}
                                                onChange={() => handleBookmarkChange(bookmark.type)}
                                            />
                                            {bookmark.type === "JAA_MEELDE" ?
                                                t("location.temporaryBookmark.remember")
                                                : t("location.temporaryBookmark.alreadyVisited")}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Apply Filters Button */}
                <div className="col-span-3 flex justify-between mt-12">
                    <button
                        className="w-full bg-black text-white px-4 py-1 rounded border-2 border-black hover:border-white"
                        onClick={handleApplyFilters}
                    >
                        {t("map.sidebar.filtering.submit")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FilteringSidebar;
