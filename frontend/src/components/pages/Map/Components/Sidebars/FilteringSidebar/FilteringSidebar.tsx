import {useEffect, useState} from "react";
import emitter from "../../../../../../emitter/eventEmitter.ts";
import {MapLocation} from "../../utils.ts";

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
  const [selectedCondition, setSelectedCondition] = useState<number | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);

  const fetchLocationCategories = async () => {
    try {
      emitter.emit("startLoading");
      const userToken = localStorage.getItem("userToken");

      const response = await fetch(`${API_URL}/api/location-categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      setCategories(data);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      emitter.emit("stopLoading");
    }
  };

  const fetchLocationConditions = async () => {
    try {
      emitter.emit("startLoading");
      const userToken = localStorage.getItem("userToken");

      const response = await fetch(`${API_URL}/api/locations/conditions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      setConditions(data);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      emitter.emit("stopLoading");
    }
  };

  const fetchLocationStatuses = async () => {
    try {
      emitter.emit("startLoading");
      const userToken = localStorage.getItem("userToken");

      const response = await fetch(`${API_URL}/api/locations/statuses`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      setStatuses(data);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      emitter.emit("stopLoading");
    }
  };

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
    const fetchData = async () => {
      try {
        fetchLocationCategories();
        fetchLocationConditions();
        fetchLocationStatuses();
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const handleApplyFilters = async () => {
    try {
      const queryParams = new URLSearchParams();

      if (selectedCategories.length > 0) {
        queryParams.append("mainCategoryId", String(selectedCategories[0]));
      }

      if (selectedCategories.length > 1) {
        selectedCategories.slice(1).forEach((subCategoryId) => {
          queryParams.append("subCategoryIds", String(subCategoryId));
        });
      }

      if (selectedCondition !== null) {
        queryParams.append("conditionId", String(selectedCondition));
      }

      if (selectedStatus !== null) {
        queryParams.append("statusId", String(selectedStatus));
      }

      await fetchLocationsWithParams(queryParams);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  return (
    <div className="p-8 text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <h2 className="text-lg font-bold mb-4 col-span-3">Filter Locations</h2>

      {/* Categories Section */}
      <div className="mb-4">
        <h3 className="text-md font-semibold">Categories</h3>
        <ul className="list-none">
          {categories.map((category) => (
            <li key={category.id} className="mt-2">
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
        <ul className="list-none">
          {conditions.map((condition) => (
            <li key={condition.id} className="mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="condition"
                  className="mr-2"
                  checked={selectedCondition === condition.id}
                  onChange={() => setSelectedCondition(condition.id)}
                />
                {condition.name}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Statuses Section */}
      <div className="mb-4">
        <h3 className="text-md font-semibold">Statuses</h3>
        <ul className="list-none">
          {statuses.map((status) => (
            <li key={status.id} className="mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  className="mr-2"
                  checked={selectedStatus === status.id}
                  onChange={() => setSelectedStatus(status.id)}
                />
                {status.name}
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
  );
}

export default FilteringSidebar;
