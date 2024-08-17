/*
 * Copyright (c) 2024.
 * by 刘铭熙
 */

'use client';
import React, {useCallback} from "react";
import {useImageStore} from "@/providers/counter-store-provider";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";

const SelectPhoto = () => {
    const {images, isLoading, setImages, setProgress} = useImageStore(state => state);

    // 处理文件选择逻辑
    const handleFileSelect = useCallback((files: FileList) => {
        // 检查文件数量是否超过限制
        if (files.length > 9) {
            toast({
                variant: 'destructive',
                description: "最多选择9张图片",
            });
            return;
        }

        // 过滤非图片文件
        const validImages = Array.from(files).filter(file => file.type.startsWith('image/'));

        // 设置图片
        setImages(validImages);
    }, [setImages]);

    // 处理文件输入变化
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFileSelect(e.target.files);
        }
    };

    // 重新选择图片
    const handleReset = () => {
        setImages(null);
        setProgress(0);
    };

    return (
        <div className="relative">
            {images === null ? (
                <div
                    className="p-5 w-full h-[180px] rounded-md border border-dashed text-sm flex justify-center items-center">
                    选择图片
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>
            ) : (
                <div className="lg:col-span-1 col-span-3 flex justify-between items-center">
                    <p className="text-sm font-bold text-muted-foreground">
                        已选{images.length}张图片
                    </p>
                    <Button
                        disabled={isLoading}
                        variant="outline"
                        onClick={handleReset}
                    >
                        重新选择
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SelectPhoto;
