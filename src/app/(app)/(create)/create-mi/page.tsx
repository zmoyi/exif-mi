/*
 * Copyright (c) 2024. 
 * by 刘铭熙
 */

'use client'

import React, {useEffect} from "react";
import {useImageStore} from "@/providers/counter-store-provider";
import {toast} from "@/components/ui/use-toast";
import {Progress} from "@/components/ui/progress";
import {forDrawMi} from "@/hook/canvas-hook";
import Image from "next/image";

const Page = () => {
    const {images, progress, setProgress, setIsLoading} = useImageStore(state => state)
    const [canvasImages, setCanvasImages] = React.useState<Map<number, Blob>>(new Map())
    useEffect(() => {
        if (!images || images.length === 0) return;
        setIsLoading(true);
        toast({
            variant: 'default',
            description: `已选择${images.length}张图片`,
        });

        const {results, onProgress, abort} = forDrawMi(images);

        onProgress((updatedResults) => {
            setProgress(Math.round((updatedResults.size / images.length) * 100));
        });

        results.then((finalResults) => {
            setCanvasImages(finalResults);
            setProgress(100);
            setIsLoading(false);
        }).catch((error) => {
            if (error.message !== 'Image processing aborted') {
                toast({
                    variant: 'destructive',
                    description: '图片处理时发生错误，请重试。',
                });
                setIsLoading(false);
            }
        });

        // 清理函数，用于在组件卸载或 images 变化时中止操作
        return () => {
            abort(); // 调用 abort 中止操作
        };
    }, [images, setProgress]);

    useEffect(() => {
        if (progress === 0) {
            setCanvasImages(new Map())
        }
    }, [progress]);
    return (
        <>
            <div className={'space-y-5'}>
                <div>
                    <p className={'text-sm font-bold text-muted-foreground mb-2'}>解析进度 {progress}%</p>
                    <Progress value={progress} className="w-full"/>
                </div>
                <div className={'lg:columns-2 space-y-5'}>
                    {
                        Array.from(canvasImages.entries()).map(([index, item]) => {
                            return (
                                <div key={index} className={'w-full'}>
                                    <Image src={URL.createObjectURL(item)} width={500} height={500} alt={'canvas'}
                                           className={'w-full h-auto'}/>
                                </div>
                            )
                        })
                    }
                </div>

            </div>

        </>
    )
};

export default Page;