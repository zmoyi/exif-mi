/*
 * Copyright (c) 2024.
 * by 刘铭熙
 */

import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function base64ToFile(base64String: string, fileName: string): File {
    // 创建一个Blob对象，它将包含base64字符串
    const blob = new Blob([base64String], {type: 'image/jpeg'}); // 或者 'image/png'，取决于你的图片格式

    // 使用File构造函数将Blob对象转换为File对象
    // 返回File对象
    return new File([blob], fileName, {type: blob.type})
}