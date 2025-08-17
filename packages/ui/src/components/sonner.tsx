"use client";

import { useTheme } from "next-themes";
import { ExternalToast, Toaster as Sonner, ToasterProps, toast } from "sonner";

const toastOptions: ExternalToast = {
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
};

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster, toast, toastOptions };
