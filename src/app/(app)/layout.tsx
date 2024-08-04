/*
 * Copyright (c) 2024. 
 * by 刘铭熙
 */

import React from "react";
import {ModeToggle} from "@/components/theme/mode-toggle";
import {Button} from "@/components/ui/button";
import {RocketIcon} from "@radix-ui/react-icons";
import Link from "next/link";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <main>
                <div
                    className={'p-5 lg:px-56 flex flex-row justify-between top-0 sticky backdrop-blur supports-[backdrop-filter]:bg-background/40 z-10'}>
                    <Link className={'font-bold'} href={'/'}>
                        EXIF MI
                    </Link>
                    <div className={'flex flex-row justify-center items-center gap-2'}>
                        <ModeToggle/>
                        <Button variant={'ghost'} size={'icon'}>
                            <RocketIcon className={'w-5 h-5'}/>
                        </Button>
                    </div>
                </div>
                <div className={'p-5 lg:px-56 flex flex-col gap-5'}>
                    {children}
                </div>
                <footer>
                    <div className={'p-5 lg:px-56 flex flex-row justify-between items-center'}>
                        <div className={'flex flex-col justify-center gap-2'}>
                            <Link className={'font-bold'} href={'/'}>
                                EXIF MI
                            </Link>
                            <ul className={'flex flex-row gap-2 text-sm'}>
                                <li className={''}>
                                    <a href={'https://github.com/zmoyi'}>Github</a>
                                </li>
                                <li>
                                    <a href={'https://twitter.com/exifmi'}>Twitter</a>
                                </li>
                                <li>
                                    <a href={'https://twitter.com/exifmi'}>About</a>
                                </li>
                            </ul>
                        </div>

                        <div className={'flex flex-row justify-center items-center gap-2'}>
                            <ModeToggle/>
                        </div>
                    </div>
                </footer>
            </main>

        </>
    );
}