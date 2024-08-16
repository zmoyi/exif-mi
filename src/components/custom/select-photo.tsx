/*
 * Copyright (c) 2024.
 * by 刘铭熙
 */

'use client'
import React from "react";
import {useImageStore} from "@/providers/counter-store-provider";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";


const SelectPhoto = () => {
    const {images, setImages, setProgress} = useImageStore(state => state)
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
            setImages(null);
            setImages(Array.from(e.target.files))
        }
    }

    const buttonOnClick = () => {
        setImages(null);
        setProgress(0)
    }
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
                    <div className={'lg:col-span-1 col-span-3 flex justify-between items-center'}>
                        <p className={'text-sm font-bold text-muted-foreground'}>
                            已选{images.length}张图片
                        </p>
                        <Button variant={'outline'} onClick={buttonOnClick}>
                            重新选择
                        </Button>
                    </div>
                )
            }


        </>

    )
}


export default SelectPhoto