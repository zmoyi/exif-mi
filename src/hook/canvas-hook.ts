/*
 * Copyright (c) 2024.
 * by 刘铭熙
 */
import {ExifLib} from "@/lib/exif-lib";
import {CanvasLib} from "@/lib/canvas-lib";
import nikonLogo from "@/../public/logo/nikon.svg"

export const createMI = async (image: File) => {
    const exifLib = new ExifLib({
        file: image
    })
    return await exifLib.getExif()
}

export const drawCanvas = async (image: File) => {
    const canvasLib = new CanvasLib({
        file: image
    })
    console.log(canvasLib)
    const images = await canvasLib.loadImage()
    console.log('canvasLib.baseX', canvasLib.baseX)

    const miCanvas = await canvasLib.createMiCanvas({
        lineTexts: [
            {
                lineText: 'nikon z72',
                lineStyle: {
                    // color: '#000000',
                    isBold: true
                },
                linePosition: {
                    position: 'middleLeft',
                    positionOffsets: {
                        x: canvasLib.baseX,
                        y: -canvasLib.watermarkHeight() * 0.05
                    }
                }
            },
            {
                lineText: '唯卓士 85mm',
                lineStyle: {
                    // color: '#000000',
                    size: -3
                },
                linePosition: {
                    position: 'middleLeft',
                    positionOffsets: {
                        x: canvasLib.baseX,
                        y: canvasLib.watermarkHeight() * 0.25
                    }
                }
            },
            {
                lineText: '85mm ISO 400 F/1.8 1/640s',
                lineStyle: {
                    // color: '#000000',
                    isBold: true
                },
                linePosition: {
                    position: 'middleRight',
                    positionOffsets: {
                        x: canvasLib.baseX,
                        y: -canvasLib.watermarkHeight() * 0.05
                    }
                }
            },
            {
                lineText: '2023/08/24',
                lineStyle: {
                    // color: '#000000',
                    size: -3
                },
                linePosition: {
                    position: 'middleRight',
                    positionOffsets: {
                        x: canvasLib.baseX,
                        y: canvasLib.watermarkHeight() * 0.25
                    }
                }
            }
        ],
        style: {
            color: '#ffffff',
        },
        logoSrc: nikonLogo.src
    }, images)

    const imageCanvas = await canvasLib.createImageCanvas({
        isMi: true,
        // miCanvas: miCanvas
        miCanvas: miCanvas,
        image: images
    })
    return imageCanvas.toDataURL('image/jpeg')
}