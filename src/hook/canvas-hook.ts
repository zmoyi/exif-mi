/*
 * Copyright (c) 2024.
 * by 刘铭熙
 */
import {ExifLib} from "@/lib/exif-lib";
import {KonvaLib} from "@/lib/konva-lib";

const createMI = async (image: File) => {
    const exifLib = new ExifLib({
        file: image
    })
    return await exifLib.getExif()
}

export type drawMiProps = {
    image: File
}
export const drawMi = async (props: drawMiProps) => {
    const exif = await createMI(props.image)
    if (!exif) {
        throw new Error('exif is null')
    }
    const canvasLib = new KonvaLib({
        file: props.image,
        exif: exif,
        isMi: true
    })
    // 等待图片加载
    return await canvasLib.createStage()
}

export const forDrawMi = (images: File[]) => {
    const results: Map<number, Blob> = new Map(); // 使用 Map 更方便管理结果
    const progressCallbacks: Array<(results: Map<number, Blob>) => void> = []; // 进度回调数组

    const processImage = async (image: File, index: number) => {
        try {
            const result = await drawMi({image});
            const blob = await new Promise<Blob | null>((resolve) => result.toBlob(resolve, 'image/jpeg', 1));

            if (!blob) {
                throw new Error('Blob is null');
            }

            results.set(index, blob);
            // 调用所有注册的进度回调
            progressCallbacks.forEach((callback) => callback(new Map(results)));
        } catch (error) {
            console.error(`Error processing image ${index}:`, error);
        }
    };

    // 使用一个 Promise 来跟踪所有图片处理完成
    const processingPromise = Promise.all(images.map((image, index) => processImage(image, index)))
        .then(() => results) // 处理完成后返回结果
        .catch((error) => {
            console.error('Error processing images:', error);
            throw error; // 抛出错误以便调用者处理
        });

    return {
        results: processingPromise,
        onProgress: (callback: (results: Map<number, Blob>) => void) => {
            progressCallbacks.push(callback);
        },
    };
};

