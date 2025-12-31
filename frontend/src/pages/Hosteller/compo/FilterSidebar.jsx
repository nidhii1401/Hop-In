import React from 'react';

const FilterSidebar = ({ filters, onChange }) => {
  const min = 5000;
  const max = 50000;

  // derive slider value (0–100) from maxPrice
  const sliderValue = (() => {
    if (!filters.maxPrice) return 100; // default full range
    const v = Number(filters.maxPrice);
    return Math.round(((v - min) / (max - min)) * 100);
  })();

  const handlePriceChange = (e) => {
    const v = Number(e.target.value); // 0–100
    const price = Math.round(min + ((max - min) * v) / 100);

    onChange({
      minPrice: min,
      maxPrice: price,
    });
  };

  const handleMessChange = (value) => {
    onChange({
      messType: filters.messType === value ? '' : value,
    });
  };

  const handleRoomCategoryChange = (value) => {
    const existing = filters.roomCategories
      ? filters.roomCategories.split(',').filter(Boolean)
      : [];

    const exists = existing.includes(value);
    const updated = exists
      ? existing.filter((v) => v !== value)
      : [...existing, value];

    onChange({
      roomCategories: updated.length > 0 ? updated.join(',') : '',
    });
  };

  const handleGenderChange = (value) => {
    onChange({
      genderType: filters.genderType === value ? '' : value,
    });
  };

  const clearFilters = () => {
    onChange({
      messType: '',
      minPrice: '',
      maxPrice: '',
      roomCategories: '',
      genderType: '',
    });
  };

  const selectedRooms = filters.roomCategories
    ? filters.roomCategories.split(',').filter(Boolean)
    : [];

  return (
    <div className="flex flex-col gap-6 p-6 border-0 rounded-xl dark:bg-stone-900">
      <div className="flex border-0 items-center justify-between">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Filter By
        </h2>
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm font-medium text-stone-500 hover:text-orange-600 px-2 py-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          Price Range
        </p>
        <input
          type="range"
          min={0}
          max={100}
          value={sliderValue}
          className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer dark:bg-stone-700 accent-orange-600"
          onChange={handlePriceChange}
        />
        <div className="flex justify-between text-xs text-stone-500">
          <span>₹5k</span>
          <span>
            {filters.maxPrice
              ? `₹${Number(filters.maxPrice).toLocaleString()}`
              : '₹50k+'}
          </span>
        </div>
      </div>

      {/* Room Category (Seaters) */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          Room Category
        </p>
        <div className="flex flex-col gap-2 max-h-40 lg:max-h-none lg:overflow-visible">
          {[
            { label: '1 Seater', value: '1' },
            { label: '2 Seater', value: '2' },
            { label: '3 Seater', value: '3' },
            { label: '4+ Seater', value: 'MORE' },
          ].map(({ label, value }) => (
            <label
              key={value}
              className="flex items-center gap-2 cursor-pointer group p-2 -m-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedRooms.includes(value)}
                onChange={() => handleRoomCategoryChange(value)}
                className="w-4 h-4 rounded border-stone-300 text-orange-600 focus:ring-orange-500 bg-stone-50 dark:bg-stone-800 dark:border-stone-700 shrink-0"
              />
              <span className="text-sm text-stone-600 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-200">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender Type */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          Gender
        </p>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Boys', value: 'BOYS' },
            { label: 'Girls', value: 'GIRLS' },
            { label: 'Co-ed', value: 'COED' },
          ].map(({ label, value }) => (
            <label
              key={value}
              className="flex items-center gap-2 cursor-pointer group p-2 -m-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              <input
                type="radio"
                name="gender"
                checked={filters.genderType === value}
                onChange={() => handleGenderChange(value)}
                className="w-4 h-4 rounded border-stone-300 text-orange-600 focus:ring-orange-500 bg-stone-50 dark:bg-stone-800 dark:border-stone-700 shrink-0"
              />
              <span className="text-sm text-stone-600 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-200">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Mess Facility */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          Mess Facility
        </p>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Compulsory', value: 'COMPULSORY' },
            { label: 'Optional', value: 'OPTIONAL' },
            { label: 'None', value: 'NONE' },
          ].map(({ label, value }) => (
            <label
              key={value}
              className="flex items-center gap-2 cursor-pointer group p-2 -m-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              <input
                type="radio"
                name="mess"
                checked={filters.messType === value}
                onChange={() => handleMessChange(value)}
                className="w-4 h-4 rounded border-stone-300 text-orange-600 focus:ring-orange-500 bg-stone-50 dark:bg-stone-800 dark:border-stone-700 shrink-0"
              />
              <span className="text-sm text-stone-600 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-200">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
