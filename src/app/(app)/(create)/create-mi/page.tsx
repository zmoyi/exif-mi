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
    const {images, progress, setProgress} = useImageStore(state => state)
    const [canvasImages, setCanvasImages] = React.useState<Map<number, Blob>>(new Map())
    useEffect(() => {
        // 如果没有选择图片，则不执行后续逻辑
        if (!images || images.length === 0) return;
        toast({
            variant: 'default',
            description: `已选择${images.length}张图片`,
        });
        const {results, onProgress} = forDrawMi(images);

// 注册进度回调
        onProgress((updatedResults) => {
            console.log('Processing progress:', updatedResults);
            // 处理进度
            setProgress(Math.round((updatedResults.size / images.length) * 100));
            // updatedResults 是一个 Map<number, Blob> 对象，表示已处理的图片及其 Blob 数据
        });

// 获取最终结果
        results.then((finalResults) => {
            console.log('All images processed:', finalResults);
            setCanvasImages(finalResults)
            setProgress(100)
            // finalResults 是一个 Map<number, Blob> 对象，表示所有图片处理完成后的 Blob 数据
        }).catch((error) => {
            console.error('Error retrieving final results:', error);
        });

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
                    <p className={'text-sm font-bold text-muted-foreground mb-2'}>解析进度</p>
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