/*
 * Copyright (c) 2024.
 * by 刘铭熙
 */

import {createStore} from "zustand/vanilla";
import {ExifData} from "@/lib/exif-lib";

export type ImageState = {
    images: File[] | null,
    exif: ExifData[] | null,
}

export type ImageActions = {
    setImages: (images: ImageState["images"]) => void,
    setExif: (exif: ImageState["exif"]) => void,
}

export type ImageStore = ImageState & ImageActions

export const initImageStore = (): ImageState => {
    return {
        images: null,
        exif: null,
    }
}

export const defaultInitState: ImageState = {
    images: null,
    exif: null,
}

export const createImageStore = (
    initState: ImageState = defaultInitState,
) => {
    return createStore<ImageStore>()((set) => ({
        ...initState,
        setImages: async (images) => set((state) => ({
            ...state,
            images: images,
        })),
        setExif: (exif) => set((state) => ({
            ...state,
            exif: exif,
        })),
    }))
}