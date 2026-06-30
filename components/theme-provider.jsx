"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider 
      {...props}
      enableColorScheme
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  );
}
