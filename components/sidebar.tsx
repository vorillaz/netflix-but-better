"use client";
import {
  GithubLogo,
  Play,
  PlayCircle,
  Heart,
  Info,
  Popcorn,
} from "@phosphor-icons/react/dist/ssr";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Icon } from "@phosphor-icons/react/dist/lib/types";

type MenuItem = {
  title: string;
  items: {
    name: string;
    icon: Icon;
    href: string;
    external?: boolean;
  }[];
};

const menuItems: MenuItem[] = [
  {
    title: "Menu",
    items: [
      {
        name: "Browse",
        icon: Play,
        href: "/browse",
      },
      {
        name: "Watchlist",
        icon: Heart,
        href: "/watchlist",
      },
      {
        name: "Categories",
        icon: Popcorn,
        href: "/categories",
      },
    ],
  },
  {
    title: "Info",
    items: [
      {
        name: "Learn More",
        icon: Info,
        external: true,
        href: "https://github.com/vorillaz/netflix-but-better#README.md",
      },
      {
        name: "GitHub Repo",
        icon: GithubLogo,
        external: true,
        href: "https://github.com/vorillaz/netflix-but-better",
      },
    ],
  },
];

export function NetflixSidebar() {
  const pathname = usePathname();
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 p-6 flex-col md:flex hidden">
      <div className="mb-8">
        <NextLink href="/">
          <h1 className="text-netflix-primary text-3xl font-bold relative leading-none flex items-end gap-2">
            <span>Netflix.</span>
            <span className="text-gray-500 text-sm">But Better</span>
          </h1>
        </NextLink>
      </div>

      <nav className="flex-1">
        {menuItems.map((section) => (
          <div key={section.title} className="mb-8">
            <h2 className="text-sm text-gray-400 mb-4">{section.title}</h2>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item.name}>
                  <NextLink
                    prefetch={true}
                    target={item?.external ? "_blank" : undefined}
                    href={item.href}
                    className={cn(
                      "flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium p-2 rounded-md",
                      pathname === item.href
                        ? "text-netflix-primary bg-red-50"
                        : "hover:bg-gray-50"
                    )}
                  >
                    <item.icon weight="duotone" className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="bg-gray-50 rounded-md p-3 overflow-hidden border border-gray-100">
          <div className="flex items-center justify-center mb-3">
            <span className="p-2 bg-netflix-red rounded-full">
              <PlayCircle
                weight="fill"
                className="w-10 h-10 text-netflix-primary"
              />
            </span>
          </div>
          <h3 className="text-center font-medium mb-1">
            Better Movies for Popcorn Addicts
          </h3>
          <p className="text-sm text-gray-500 text-center">
            8K+ Movies & TV Shows
          </p>
          <p className="text-sm text-gray-500 text-center">
            Demo app made by{" "}
            <a
              href="https://vorillaz.com"
              target="_blank"
              className="text-blue-500"
            >
              @vorillaz
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
