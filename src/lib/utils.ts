/*
 * Copyright (c) 2024.
 * by 刘铭熙
 */

import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import nikonLogo from "@/../public/logo/nikon.svg";
import sonyLogo from "@/../public/logo/sony.svg";
import canonLogo from "@/../public/logo/canon.svg";


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export function selectLogo(imageName: string): string {
    const lowerCaseName = imageName.toLowerCase(); // 将名称转换为小写

    switch (true) {
        case lowerCaseName.includes("nikon"):
            return nikonLogo.src; // 如果包含"nikon"，返回Nikon的Logo路径
        case lowerCaseName.includes("sony"):
            return sonyLogo.src; // 如果包含"sony"，返回Sony的Logo路径
        case lowerCaseName.includes("canon"):
            return canonLogo.src; // 如果包含"canon"，返回Canon的Logo路径
        default:
            return ''; // 如果不匹配任何品牌，返回空字符串或默认的Logo路径
    }
}