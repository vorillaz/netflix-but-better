import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "pl-10 pr-4 py-2 bg-gray-50 ring-1 ring-gray-200 rounded-lg w-full focus:outline-none focus:ring-netflix-primary md:text-sm focus:bg-transparent",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
