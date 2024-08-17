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
export const forDrawMi = (images: File[], maxConcurrent: number = 5) => {
    // 使用 Map 存储处理后的 Blob 结果，键为图片的索引，值为对应的 Blob
    const results: Map<number, Blob> = new Map();
    const progressCallbacks: Array<(results: Map<number, Blob>) => void> = [];
    const abortController = new AbortController(); // 创建一个 AbortController 实例

    /**
     * 处理单张图片的异步函数
     * @param image - 需要处理的图片文件
     * @param index - 图片在数组中的索引，用于标识处理结果
     */
    const processImage = async (image: File, index: number): Promise<void> => {
        try {
            // 检查是否已请求取消
            if (abortController.signal.aborted) {
                throw new Error('Image processing aborted');
            }

            // 调用 drawMi 函数处理图片
            const result = await drawMi({image});
            // 将处理结果转换为 Blob
            const blob = await new Promise<Blob | null>((resolve) => result.toBlob(resolve, 'image/jpeg', 1));

            if (!blob) {
                console.error('Blob is null');
                throw new Error('Blob is null'); // 如果 Blob 为空，抛出错误
            }
            console.log("blob", URL.createObjectURL(blob))

            // 将处理后的 Blob 存入 results Map 中
            results.set(index, blob);
            // 调用所有注册的进度回调函数
            progressCallbacks.forEach((callback) => callback(new Map(results)));
        } catch (error) {
            if (abortController.signal.aborted) {
                console.log(`Processing of image ${index} was aborted`);
            } else {
                console.error(`Error processing image ${index}:`, error); // 捕获并记录错误
            }
            throw error; // 重新抛出错误，让上层处理
        }
    };

    /**
     * 控制并发处理图片的函数
     * 使用有限数量的 "worker" 来逐个处理图片，避免资源过载
     */
    const processImagesInBatches = async (): Promise<void> => {
        // 将 images 转换为 [index, image] 对的队列
        const queue = Array.from(images.entries());

        // 创建 worker 数组，每个 worker 处理队列中的图片
        const promises = Array.from({length: maxConcurrent}, async function worker() {
            while (queue.length > 0) {
                const [index, image] = queue.shift()!; // 从队列中取出一个 [index, image] 对
                await processImage(image, index); // 处理该图片
            }
        });

        await Promise.all(promises); // 等待所有 worker 完成任务
    };

    // 创建一个 Promise，用于跟踪所有图片的处理过程
    const processingPromise = processImagesInBatches()
        .then(() => results) // 处理完成后返回结果 Map
        .catch((error) => {
            if (!abortController.signal.aborted) {
                console.error('Error processing images:', error); // 捕获并记录批量处理的错误
            }
            throw error; // 重新抛出错误，以便调用者处理
        });

    return {
        /**
         * 返回一个 Promise，解析后包含所有图片处理结果
         */
        results: processingPromise,

        /**
         * 注册进度更新回调函数的方法
         * @param callback - 用于处理进度更新的回调函数
         */
        onProgress: (callback: (results: Map<number, Blob>) => void) => {
            progressCallbacks.push(callback); // 将回调函数添加到进度回调数组中
        },

        /**
         * 中止所有正在进行的图片处理操作
         */
        abort: () => {
            abortController.abort(); // 调用 abort 中止所有进行中的操作
        }
    };
};

