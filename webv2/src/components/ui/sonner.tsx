"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ position = "top-right", richColors = true, ...props }: ToasterProps) => {
  return (
    <Sonner
      position={position}
      richColors={richColors}
      toastOptions={{
        duration: 3000,
        className: "border border-border shadow-lg",
      }}
      {...props}
    />
  );
};
