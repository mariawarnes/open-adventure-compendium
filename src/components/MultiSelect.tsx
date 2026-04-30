import { useState } from "react";
import type { Slug } from "sanity";

interface ObjectOption {
  slug: Slug;
  name: string;
}

interface Props {
  name: string;
  label?: string;
  pluralLabel?: string;
  selected: string[] | undefined;
  options: string[] | ObjectOption[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const getOptionValue = (option: string | ObjectOption) =>
  typeof option === "object" ? option.slug.current : option;

const getOptionLabel = (option: string | ObjectOption) =>
  typeof option === "object" ? option.name : option;

const MultiSelect = ({
  name,
  label: labelProp,
  pluralLabel,
  selected,
  options,
  isOpen,
  onOpenChange,
}: Props) => {
  const [selectedValues, setSelectedValues] = useState(selected ?? []);
  const allSelected =
    options.length > 0 && selectedValues.length === options.length;
  const allOptionSelected = selectedValues.length === 0 || allSelected;
  const displayName = labelProp ?? name;
  const pluralDisplayName = pluralLabel ?? displayName + "s";
  const selectedDisplayName =
    selectedValues.length === 1 ? displayName : pluralDisplayName;

  const label =
    selectedValues.length && !allSelected
      ? selectedValues.length + " " + selectedDisplayName + " selected"
      : "All " + pluralDisplayName;

  const handleAllChange = () => {
    setSelectedValues([]);
  };

  const handleOptionChange = (value: string) => {
    setSelectedValues((currentValues) => {
      const isAlreadySelected = currentValues.includes(value);

      if (isAlreadySelected) {
        return currentValues.filter((selectedValue) => selectedValue !== value);
      }

      return [...currentValues, value];
    });
  };

  return (
    <details className="dropdown" name={name} open={isOpen}>
      <summary
        className="select w-full"
        onClick={(event) => {
          event.preventDefault();
          onOpenChange(!isOpen);
        }}
      >
        {label}
      </summary>
      <ul className="menu dropdown-content bg-base-100 gap-2 border border-base-300 rounded-box z-1 w-52 p-2 shadow-sm">
        <li className="flex flex-row">
          <input
            type="checkbox"
            id={`${name}-all`}
            name={name}
            checked={allOptionSelected}
            onChange={handleAllChange}
            value=""
            className="checkbox mr-2"
          />
          <label htmlFor={`${name}-all`}>All {pluralDisplayName}</label>
        </li>
        {options.map((option: string | ObjectOption) => {
          const value = getOptionValue(option);
          const optionLabel = getOptionLabel(option);

          return (
            <li className="flex flex-row" key={value}>
              <input
                type="checkbox"
                id={`${name}-${value}`}
                name={name}
                checked={selectedValues.includes(value)}
                onChange={() => handleOptionChange(value)}
                value={value}
                className="checkbox mr-2"
              />
              <label htmlFor={`${name}-${value}`}>{optionLabel}</label>
            </li>
          );
        })}
      </ul>
    </details>
  );
};

export default MultiSelect;
