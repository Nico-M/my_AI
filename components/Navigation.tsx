"use client";

import { useRouter, usePathname } from "next/navigation";

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    {
      key: "/",
      label: "对话",
    },
    {
      key: "/grammar",
      label: "语法",
    },
  ];

  return (
    <nav className="px-8 border-b border-gray-200 w-1/2 mx-auto">
      <div className="flex space-x-8">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => router.push(item.key)}
            className={`
              py-4 px-2 relative
              ${pathname === item.key 
                ? 'text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700'
              }
              transition-colors duration-200
              focus:outline-none
            `}
          >
            {item.label}
            {pathname === item.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
