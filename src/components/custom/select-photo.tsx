/*
 * Copyright (c) 2024.
 * by 刘铭熙
 */

'use client'
import React, {useCallback, useEffect, useState} from "react";
import {useImageStore} from "@/providers/counter-store-provider";
import {createMI} from "@/hook/canvas-hook";
import {Progress} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";


const SelectPhoto = () => {
    const {exif, images, setImages, setExif} = useImageStore(state => state)
    const [progress, setProgress] = useState(0);
    const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 最多选择9张图片
        if (e.target.files && e.target.files.length > 9) {
            toast({
                variant: 'destructive',
                description: "最多选择9张图片",
            })
            return;
        }
        if (e.target.files) {
            setExif(null);
            setImages(null);
            setProgress(0);
            setImages(Array.from(e.target.files))
        }
    }

    const buttonOnClick = () => {
        setExif(null);
        setImages(null);
        setProgress(0);
    }

    const createMICallback = useCallback(async (image: File) => {
        // 假设 createMI 是一个已定义的异步函数
        return await createMI(image);
    }, []);

    useEffect(() => {
        if (images) {
            let exif = [];
            let completedImages = 0;
            const totalImages = images.length;

            const updateProgress = () => {
                setProgress(Math.round((completedImages / totalImages) * 100));
            };

            const processImages = async () => {
                for (let index = 0; index < images.length; index++) {
                    try {
                        const exifData = await createMICallback(images[index]);
                        if (exifData) {
                            exif.push(exifData);
                        }
                        completedImages++;
                        updateProgress();
                    } catch (error) {
                        console.error(`Error processing image at index ${index}:`, error);
                    }
                }
                setExif(exif);
                setProgress(100);
            };

            processImages().then(
                () => {
                    console.log('All images processed.');
                }
            );
        }
    }, [images, setExif, createMICallback]);
    console.log(progress, exif)
    return (
        <>
            {
                images === null ? (
                    <div className={'relative'}>
                        <div
                            className={'p-5 w-full h-[180px] rounded-md border border-dashed text-sm flex justify-center items-center'}>
                            选择图片
                        </div>
                        <input onChange={handleClick} className={'absolute bottom-0 w-full h-full opacity-0'}
                               type={'file'}
                               multiple={true} accept={'image/*'}/>
                    </div>
                ) : (
                    <div>
                        <div className={'grid grid-cols-3 gap-2'}>
                            <div className={'lg:col-span-2 col-span-3 gap-2'}>
                                <p className={'text-sm font-bold text-muted-foreground'}>解析Exif进度{` ${progress}%`}</p>
                                <Progress value={progress}/>
                            </div>
                            <div className={'lg:col-span-1 col-span-3 flex justify-end items-center'}>
                                <Button variant={'outline'} onClick={buttonOnClick}>
                                    重新选择
                                </Button>

                            </div>
                        </div>
                    </div>
                )
            }


        </>

    )
}


export default SelectPhoto