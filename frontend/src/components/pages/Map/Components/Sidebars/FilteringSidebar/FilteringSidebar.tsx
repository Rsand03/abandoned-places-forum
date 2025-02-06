import {useEffect, useState} from "react";
import emitter from "../../../../../../emitter/eventEmitter.ts";
import {LocationAttributes, MapLocation} from "../../utils.ts";
import LocationService from "../../../../../../service/LocationService.ts";
import { useToast } from "../../../../../../hooks/use-toast.ts";

const bookmarkTypes = [
  { type: "JAA_MEELDE", label: "Jäta meelde" },
  { type: "JUBA_KULASTATUD", label: "Juba külastatud" },
  { type: "SUUR_RISK", label: "Suur risk" },
  { type: "OSALISELT_AVASTATUD", label: "Osaliselt avastatud" },
];

interface FilteringSidebarProps {
  applyFilters: (filteredLocations: MapLocation[]) => void;
}

function FilteringSidebar({ applyFilters }: FilteringSidebarProps) {
  // TODO refactor this whole component
  const API_URL = import.meta.env.VITE_API_URL;
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

  const { toast } = useToast();

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
        <h2 className="text-2xl font-bold text-white">Filter</h2>
        <div className="pt-16 text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Categories Section */}
          <div className="mb-4">
            <h3 className="text-md font-semibold">Categories</h3>
            <label className=" flex items-center">
              <input
                  type="checkbox"
                  className="mr-2"
                  checked={filterMainCategoriesOnly}
                  onChange={() =>
                      setFilterMainCategoriesOnly((prev) => !prev)
                  }
              />
              Must be main category
            </label>
            <button
                onClick={() =>
                    toggleAll(categories, selectedCategories, setSelectedCategories)
                }
                className="text-sm text-blue-500 underline mb-2"
            >
              {categories.length === selectedCategories.length
                  ? "Unselect All"
                  : "Select All"}
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
                      {category.name}
                    </label>
                  </li>
              ))}
            </ul>
          </div>

          {/* Conditions Section */}
          <div className="mb-4">
            <h3 className="text-md font-semibold">Conditions</h3>
            <button
                onClick={() =>
                    toggleAll(conditions, selectedConditions, setSelectedConditions)
                }
                className="text-sm text-blue-500 underline mb-2"
            >
            {conditions.length === selectedConditions.length
                  ? "Unselect All"
                  : "Select All"}
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
                        {condition.name}
                      </label>
                    </li>
                  </li>
              ))}
            </ul>
          </div>

          {/* Statuses Section */}
          <div className="mb-4">
            <h3 className="text-md font-semibold">Statuses</h3>
            <button
                onClick={() =>
                    toggleAll(statuses, selectedStatuses, setSelectedStatuses)
                }
                className="text-sm text-blue-500 underline mb-2"
            >
              {statuses.length === selectedStatuses.length
                  ? "Unselect All"
                  : "Select All"}
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
                        {status.name}
                      </label>
                    </li>
                  </li>
              ))}
            </ul>
          </div>

          {/* Bookmark Types Section */}
          <div className="mb-4">
            <h3 className="text-md font-semibold">Bookmark Types</h3>
            <button
                onClick={() =>
                    toggleAll(
                        bookmarkTypes,
                        selectedBookmarks,
                        setSelectedBookmarks
                    )
                }
                className="text-sm text-blue-500 underline mb-2"
            >
              {bookmarkTypes.length === selectedBookmarks.length
                  ? "Unselect All"
                  : "Select All"}
            </button>
            <ul className="list-none">
              {bookmarkTypes.map((bookmark) => (
                  <li key={bookmark.type} className="mt-1">
                    <label className="flex items-center">
                      <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedBookmarks.includes(bookmark.type)}
                          onChange={() => handleBookmarkChange(bookmark.type)}
                      />
                      {bookmark.label}
                    </label>
                  </li>
              ))}
            </ul>
          </div>

          {/* Apply Filters Button */}
          <div className="col-span-3 flex justify-between mt-4">
            <button
                className="bg-green-500 text-white px-4 py-2 rounded shadow"
                onClick={handleApplyFilters}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
  );
}

export default FilteringSidebar;
