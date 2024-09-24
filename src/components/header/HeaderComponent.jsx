"use client";
import { TypewriterEffectSmooth } from "./Typewriter-effect";
import { FloatingNavbar } from "./Floating-navbar";
import { IconSettings, IconReceiptFilled } from "@tabler/icons-react";
import { SearchComponent } from "../search/SearchComponent";
import { SidebarDemo } from "../sidebar/SidebarComponent";
import { useLocation } from "react-router-dom";

export function Header({ userName }) {
  const location = useLocation();
  const currentPage = location.pathname.split("/").pop() || "/";
  const words = [
    { text: "Faiz" },
    { text: "-" },
    { text: "ul" },
    { text: "-" },
    { text: "Mawaid" },
    { text: "-" },
    { text: "il" },
    { text: "-" },
    { text: "Burhaniyah" },
  ];

  const navItems = [
    {
      name: "Quick Panel",
      link: "/quick-panel",
      icon: <IconReceiptFilled className="h-6 w-6 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Settings",
      link: "/settings",
      icon: <IconSettings className="h-6 w-6 text-neutral-500 dark:text-white" />,
    },
  ];


  return (
    <>
      <div className="relative w-full">
        <FloatingNavbar navItems={navItems} userName={userName} />
        <div className="flex flex-col h-[4rem] justify-center bg-amber-900">
          <TypewriterEffectSmooth words={words} />
        </div>
        <DummyContent currentPage={currentPage} />
      </div>
    </>
  );
}

const DummyContent = ({currentPage}) => {
  const capitalizeFirstLetter = (string) => {
    if (!string) return ''; // Handle undefined or empty string
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  console.log(currentPage)
  return (
    <div className="flex h-[4rem] w-full bg-white dark:bg-black relative border border-neutral-200 dark:border-white/[0.2] rounded-md items-center justify-between">
      <div className="flex-shrink-0 w-1/4 text-lg text-black font-semibold pl-5">{capitalizeFirstLetter(currentPage)}</div> {/* Display current page */}
      <div className="flex flex-grow justify-center">
        <SearchComponent className="flex-1" />
        <SearchComponent className="flex-1" />
        <SearchComponent className="flex-1" />
      </div>
      <div className="inset-0 absolute bg-grid-black/[0.1] dark:bg-grid-white/[0.2]" />
    </div>
  );
};


// const DummyContent = ({currentPage}) => {
//   return (
//     <div className="grid grid-cols-3 h-[4rem] w-full bg-white dark:bg-black relative border border-neutral-200 dark:border-white/[0.2] rounded-md">

//       <span>{currentPage}</span>
//       <SearchComponent />
//       <SearchComponent />
//       <SearchComponent />

//       <div className="inset-0 absolute bg-grid-black/[0.1] dark:bg-grid-white/[0.2]" />
//     </div>
//   );
// };


// const DummyContent = () => {
//   return (
//     <div className="relative flex h-[calc(100vh-40rem)]"> {/* Adjust height to fit the sidebar */}
//       <SidebarDemo />
//       <div className="grid grid-cols-1 w-full bg-white dark:bg-black relative border border-neutral-200 dark:border-white/[0.2] rounded-md ml-20"> {/* Add margin-left to create space */}
//         <SearchComponent />
//         <div className="inset-0 absolute bg-grid-black/[0.1] dark:bg-grid-white/[0.2]" />
//       </div>
//     </div>
//   );
// };
