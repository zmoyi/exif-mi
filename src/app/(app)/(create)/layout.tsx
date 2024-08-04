/*
 * Copyright (c) 2024.
 * by 刘铭熙
 */

import React from "react";
import SelectPhoto from "@/components/custom/select-photo";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
            <SelectPhoto/>
            <div>
                {children}
            </div>
        </>
    );
}