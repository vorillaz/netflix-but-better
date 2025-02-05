import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-netflix-primary text-white px-4 md:px-8 py-2 rounded-md flex items-center space-x-2 hover:bg-netflix-red/90 transition-colors transform hover:scale-105 duration-200",
        ghost: "bg-transparent text-black",
        imdb: "bg-yellow-500 text-black px-4 md:px-8 py-2 rounded-md flex items-center",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps<C extends React.ElementType = "button">
  extends VariantProps<typeof buttonVariants> {
  as?: C;
  asChild?: boolean;
  className?: string;
  // Omit conflicting props from the element type and add our own
  props?: Omit<React.ComponentPropsWithoutRef<C>, keyof ButtonProps>;
}

const Button = React.forwardRef(
  <C extends React.ElementType = "button">(
    { className, variant, size, asChild = false, as, ...props }: ButtonProps<C>,
    ref: React.ComponentPropsWithRef<C>["ref"]
  ) => {
    const Comp = asChild ? Slot : as || "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
) as <C extends React.ElementType = "button">(
  props: ButtonProps<C> & React.ComponentPropsWithoutRef<C>
) => React.ReactElement | null;

(Button as any).displayName = "Button";

export { Button, buttonVariants };
