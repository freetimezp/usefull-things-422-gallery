import React from "react";

import "../src/assets/css/style.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head />
            <body suppressHydrationWarning={true}>{children}</body>
        </html>
    );
}
