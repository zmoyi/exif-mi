/*
 * Copyright (c) 2024. 
 * by 刘铭熙
 */

'use client'
/*
 * Copyright (c) 2024.
 * by 刘铭熙
 */

import {useImageStore} from "@/providers/counter-store-provider";
import React, {useCallback, useEffect, useState} from "react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {drawCanvas} from "@/hook/canvas-hook";
import {Progress} from "@/components/ui/progress";

const Page = () => {
    const {images} = useImageStore(state => state)
    const [imageUrl, setImageUrl] = React.useState<string[] | null>(null)
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const createCMI = async () => {
        setIsLoading(true);
    };

    const drawCanvasCallback = useCallback(async (image: File) => {
        // 假设 drawCanvas 是一个已定义的异步函数
        return await drawCanvas(image);
    }, []);
    

    useEffect(() => {
        if (isLoading && images) {
            const startTime = performance.now(); // 记录开始时间
            let completedImages = 0;
            const totalImages = images.length;
            let tempProgress = 0;

            const updateProgress = (index: number) => {
                tempProgress = Math.round(((index + 1) / totalImages) * 100);
                setProgress(tempProgress);
            };

            const promises: any[] = [];

            images.forEach((image, index) => {
                const promise = drawCanvasCallback(image)
                    .then(imageUrl => {
                        if (imageUrl) {
                            const endTime = performance.now(); // 记录每个图片处理完成的时间
                            console.log(`Image ${index} processed in ${endTime - startTime} ms`);
                            completedImages++;
                            updateProgress(completedImages);
                            return imageUrl;
                        } else {
                            return null;
                        }
                    })
                    .catch(error => {
                        console.error(`Error processing image at index ${index}:`, error);
                        return null; // 返回 null 以便保留数组长度一致
                    });
                promises.push(promise);
            });

            Promise.all(promises)
                .then(imageUrls => {
                    const validImageUrls = imageUrls.filter(url => url !== null);
                    setImageUrl(validImageUrls);
                    setProgress(100);
                    setIsLoading(false);
                    const endTime = performance.now(); // 记录整个处理完成的时间
                    console.log(`All images processed in ${endTime - startTime} ms`);
                })
                .catch(error => {
                    console.error('Error during image processing:', error);
                    setIsLoading(false);
                });
        }
    }, [images, isLoading, drawCanvasCallback]);

    return (
        <>
            <div className={'space-y-5'}>
                <div className={'flex flex-row justify-between items-center'}>
                    <div>

                        <p className={'text-sm font-bold text-muted-foreground'}>批量生成进度{` ${progress}%`}</p>
                        <Progress value={progress}/>
                    </div>
                    <div>
                        {
                            images && images.length > 0 && (
                                <Button onClick={createCMI} variant={'outline'}>
                                    生成
                                </Button>
                            )
                        }
                    </div>

                </div>
                <div className={'lg:columns-3 gap-5 space-y-5'}>
                    {
                        imageUrl && imageUrl.map((item, index) => (
                            <Image key={index} src={item} alt={'a'} width={200} height={200}
                                   className={'w-full rounded-md'}/>
                        ))
                    }
                </div>
            </div>
        </>
    )
};

export default Page;