import type { AdventureFilters, AdventureOptions } from "@/utils/sanity/types";
import { useState } from "react";
import MultiSelect from "./MultiSelect";

interface Props {
  filters: AdventureFilters;
  options: AdventureOptions;
}

const SearchFilter = ({ filters, options }: Props) => {
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const blurActiveSelect = () => {
    if (document.activeElement instanceof HTMLSelectElement) {
      document.activeElement.blur();
    }
  };

  const closeOpenFilter = () => {
    setOpenFilter(null);
    blurActiveSelect();
  };

  const toggleOpenFilter = (name: string, isOpen: boolean) => {
    if (isOpen) {
      blurActiveSelect();
      setOpenFilter(name);
      return;
    }

    setOpenFilter(null);
  };

  return (
    <form method="get">
      <fieldset className="flex gap-2 flex-auto flex-col lg:flex-row">
        <MultiSelect
          name="author"
          selected={filters.selectedAuthors}
          options={options.authors}
          isOpen={openFilter === "author"}
          onOpenChange={(isOpen) => toggleOpenFilter("author", isOpen)}
        />

        <MultiSelect
          name="edition"
          selected={filters.selectedEditions}
          options={options.editions}
          isOpen={openFilter === "edition"}
          onOpenChange={(isOpen) => toggleOpenFilter("edition", isOpen)}
        />

        <MultiSelect
          name="theme"
          selected={filters.selectedThemes}
          options={options.themes}
          isOpen={openFilter === "theme"}
          onOpenChange={(isOpen) => toggleOpenFilter("theme", isOpen)}
        />

        <div>
          <select
            className="select w-full"
            name="duration"
            defaultValue={filters.selectedDuration?.[0] ?? ""}
            onFocus={closeOpenFilter}
            onPointerDown={closeOpenFilter}
          >
            <option value="">Any durations</option>
            {options.duration.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <MultiSelect
          name="level"
          selected={filters.selectedLevels}
          options={options.levels}
          isOpen={openFilter === "level"}
          onOpenChange={(isOpen) => toggleOpenFilter("level", isOpen)}
        />

        <MultiSelect
          name="partySize"
          label="party size"
          pluralLabel="party sizes"
          selected={filters.selectedPartySizes}
          options={options.partySizes}
          isOpen={openFilter === "partySize"}
          onOpenChange={(isOpen) => toggleOpenFilter("partySize", isOpen)}
        />

        <button className="btn-primary">Apply</button>
        <a href="/" className="btn btn-secondary">
          Clear
        </a>
      </fieldset>
    </form>
  );
};

export default SearchFilter;
