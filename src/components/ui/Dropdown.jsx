// components/Dropdown.jsx
import { Listbox } from "@headlessui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

const Dropdown = ({
  label,
  options,
  selectedId,
  setSelectedId,
  placeholder,
}) => {
  const selectedOption = options.find((opt) => String(opt.id) === String(selectedId));

  return (
    <div>
      {/* {label && (
        <label className="block text-sm font-medium mb-1 text-gray-700">
          {label}
        </label>
      )} */}
      <Listbox value={selectedId} onChange={setSelectedId}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button className="w-full bg-teal-700 text-white text-base font-bold px-4 py-3 rounded-md flex justify-between items-center ring-0 focus:outline-none focus:ring-0 focus:border-0">
              {selectedOption?.title || placeholder}
              {open ? (
                <ChevronUpIcon className="h-5 w-5 text-white" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-white" />
              )}
            </Listbox.Button>

            <Listbox.Options
              as="ul"
              className="absolute mt-1 w-full text-sm bg-white shadow-md border border-gray-200 rounded-md z-10 max-h-60 overflow-auto"
            >
              {options.map((opt) => (
                <Listbox.Option
                  as="li"
                  key={opt.id}
                  value={opt.id}
                  className={({ active, selected }) =>
                    `cursor-pointer px-4 py-2 ${
                      active
                        ? "bg-teal-100 text-teal-900"
                        : selected
                        ? "bg-teal-50 text-teal-800"
                        : "text-gray-900"
                    }`
                  }
                >
                  {opt.title}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        )}
      </Listbox>
    </div>
  );
};

export default Dropdown;