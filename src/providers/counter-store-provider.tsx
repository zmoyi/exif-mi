/*
 * Copyright (c) 2024.
 * by 刘铭熙
 */

'use client'

import {createContext, type ReactNode, useContext, useRef} from 'react'
import {useStore} from 'zustand'
import {createImageStore, ImageStore, initImageStore} from "@/stores/image-store";


export type ImageStoreApi = ReturnType<typeof createImageStore>

export const ImageStoreContext = createContext<ImageStoreApi | undefined>(
    undefined,
)

export interface ImageStoreProviderProps {
    children: ReactNode
}

export const ImageStoreProvider = ({
                                       children,
                                   }: ImageStoreProviderProps) => {
    const storeRef = useRef<ImageStoreApi>()
    if (!storeRef.current) {
        storeRef.current = createImageStore(initImageStore())
    }

    return (
        <ImageStoreContext.Provider value={storeRef.current}>
            {children}
        </ImageStoreContext.Provider>
    )
}

export const useImageStore = <T, >(
    selector: (store: ImageStore) => T,
): T => {
    const imageStoreContext = useContext(ImageStoreContext)

    if (!imageStoreContext) {
        throw new Error(`useImageStore must be used within ImageStoreProvider`)
    }

    return useStore(imageStoreContext, selector)
}