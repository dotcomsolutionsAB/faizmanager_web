import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./Sidebar";
import {
    IconArrowLeft,
    IconBrandCashapp,
    IconBrandTabler,
    IconCreditCardPay,
    IconInfoSquare,
    IconReceipt,
    IconReceipt2,
    IconSettings,
    IconUserBolt,
    IconUsersGroup,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

import { IconDots } from "@tabler/icons-react"; // Assuming you are using the three dots icon

export function SidebarDemo() {
    const [open, setOpen] = useState(false);

    const links = [
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: (
                <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 ml-2 flex-shrink-0" />
            ),
        },
        {
            heading: "Thaali Information", // Heading for the section
            items: [
                {
                    label: "Mumeneen",
                    href: "/mumeneen",
                    icon: (
                        <IconUsersGroup className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                    ),
                },
                {
                    label: "Receipt Acknowledgement",
                    href: "#",
                    icon: (
                        <IconReceipt2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                    ),
                },
                {
                    label: "Receipts",
                    href: "#",
                    icon: (
                        <IconReceipt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                    ),
                },
                {
                    label: "Payments",
                    href: "#",
                    icon: (
                        <IconCreditCardPay className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                    ),
                },
                {
                    label: "Expense",
                    href: "#",
                    icon: (
                        <IconBrandCashapp className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                    ),
                },
            ],
        },
        {
            heading: "Profile", // Another heading
            items: [
                { label: "Overview", href: "#" },
                { label: "Statistics", href: "#" },
            ],
        },
        {
            heading: "Settings", // Another heading
            items: [
                { label: "Overview", href: "#" },
                { label: "Statistics", href: "#" },
            ],
        },
        {
            label: "Logout",
            href: "#",
            icon: (
                <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
    ];

    return (
        <div
            className={cn(
                "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-8xl mx-0 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
                "h-[100vh]"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-4">
                            {links.map((link, idx) => (
                                <div key={idx}>
                                    {link.heading ? (
                                        // Render heading and list items conditionally
                                        <>
                                            <h3 className="text-md font-bold text-neutral-900 dark:text-white">
                                                {open || link.heading === "Logout" ? (
                                                    link.heading
                                                ) : (
                                                    <IconDots className="h-5 w-5 ml-2" />
                                                )}
                                            </h3>
                                            <ul className="ml-2 space-y-2">
                                                {link.items.map((item, itemIdx) => (
                                                    <li key={itemIdx}>
                                                        <SidebarLink link={item} />
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : (
                                        // Render normal sidebar links
                                        <SidebarLink link={link} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </SidebarBody>
            </Sidebar>
        </div>
    );
}


export const Logo = () => {
    return (
        <Link
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-amber-900 dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-black dark:text-white whitespace-pre"
            >
                Faiz-ul-Mawaid-il-Burhaniyah
            </motion.span>
        </Link>
    );
};

export const LogoIcon = () => {
    return (
        <Link
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 ml-2 bg-amber-900 dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        </Link>
    );
};
