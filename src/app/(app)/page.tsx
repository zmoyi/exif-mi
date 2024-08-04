/*
 * Copyright (c) 2024.
 * by 刘铭熙
 */

import {RocketIcon} from "@radix-ui/react-icons";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import Template from "@/components/custom/template";
import React from "react";

export default function Home() {

    return (
        <>
            <div className={'flex flex-col gap-2  font-bold'}>
                <h1 className={'text-2xl'}>
                    HELLO <span className={'text-sm text-muted-foreground'}>摄影师朋友</span>
                </h1>
                <span className={'text-xs text-muted-foreground'}>为您的照片添加个性水印</span>
            </div>
            <Alert>
                <RocketIcon className="h-4 w-4"/>
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription className={'text-xs font-bold'}>
                    This site provides free watermark generation, I hope everyone forward oh
                </AlertDescription>
            </Alert>
            <div className={'text-sm font-bold text-muted-foreground'}>
                请选择模板
            </div>
            <Template/>
        </>
    );
}
