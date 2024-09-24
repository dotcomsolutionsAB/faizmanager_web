"use client";

import { PlaceholdersAndVanishInput } from "./Placeholders-and-vanish-input";

export function SearchComponent() {
  const placeholders = [
    "Select Sector"
  ];

  const handleChange = (e) => {
    console.log(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    (<div className="h-[3.8rem] flex flex-col justify-center  items-center px-4">
      <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} />
    </div>)
  );
}
