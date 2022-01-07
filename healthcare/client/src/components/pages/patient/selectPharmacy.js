import React, { useState, Fragment, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const pharmacyTest = {
  name: "Shoppers on Younge",
};

const pharmacyTest2 = {
  name: "Shoppers on Eglinton",
};

const SelectPharmacy = () => {
  const [pharmacies, setPharmacies] = useState([pharmacyTest, pharmacyTest2]);
  const [selected, setSelected] = useState(pharmacies[0]);
  // handlers
  const onSubmit = (event) => {
    console.log(event);
  };

  // use effect
  useEffect(() => {
    // get pharmacies
  }, []);

  return (
    <form action="submit" onSubmit={onSubmit}>
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium text-gray-700">
              Select Pharmacy
            </Listbox.Label>
            <div className="relative mt-1">
              <div className="flex flex-col sm:flex-row">
                <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <span className="flex items-center">
                    <span className="block ml-3 truncate">{selected.name}</span>
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 ml-3 pointer-events-none">
                    <SelectorIcon
                      className="w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <button className="inline-flex justify-center flex-auto w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm sm:w-1/4 min-w-min hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Submit Request
                </button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-56 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {pharmacies.map((person) => (
                    <Listbox.Option
                      key={person.id}
                      className={({ active }) =>
                        classNames(
                          active ? "text-white bg-indigo-600" : "text-gray-900",
                          "cursor-default select-none relative py-2 pl-3 pr-9"
                        )
                      }
                      value={person}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "ml-3 block truncate"
                              )}
                            >
                              {person.name}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </form>
  );
};

export default SelectPharmacy;
