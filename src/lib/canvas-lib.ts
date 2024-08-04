/*
 * Copyright (c) 2024.
 * by 刘铭熙
 */

import {Canvas, CanvasRenderingContext2D, createCanvas, Image, loadImage} from "canvas";

export type CanvasLibProps = {
    file: File
}

export type lineTextProps = {
    lineText: string,
    lineStyle: {
        color?: string,
        isBold?: boolean,
        size?: number
    },
    linePosition: {
        position: Position,
        positionOffsets: PositionOffsets
    }
}

export type Position =
    'topLeft'
    | 'bottomLeft'
    | 'topRight'
    | 'bottomRight'
    | 'topCenter'
    | 'bottomCenter'
    | 'middleLeft'
    | 'middleRight'
    | 'center';

export type PositionOffsets = {
    x?: number;
    y?: number;
}


export class CanvasLib {
    file: File
    width: number
    height: number
    baseX: number
    baseY: number

    constructor(props: CanvasLibProps) {
        this.file = props.file
        this.width = 0
        this.height = 0
        this.baseX = 0
        this.baseY = 0
    }

    loadImage = async () => {
        const imageUrl = URL.createObjectURL(this.file)
        const image = await loadImage(imageUrl)
        this.width = image.width
        this.height = image.height
        this.baseX = image.width * 0.02
        return image
    }
    watermarkHeight = () => {
        const photoArea: number = this.width / this.height;
        console.log(photoArea)
        if (photoArea < 1) {
            return Math.floor(this.height * 0.08)
        } else if (photoArea > 1) {
            return Math.floor(this.height * 0.13)
        } else {
            return Math.floor(this.height * 0.09)
        }

    }
    createImageCanvas = async (
        {
            isMi = false,
            miCanvas,
            image
        }: {
            isMi?: boolean,
            miCanvas?: Canvas,
            image: Image
        }
    ) => {
        if (!image) {
            throw new Error('image is null')
        }
        const imageCanvasHeight = isMi ? this.watermarkHeight() + this.height : this.height
        const imageCanvas = createCanvas(this.width, imageCanvasHeight)
        const ctx = imageCanvas.getContext('2d')
        if (!ctx) {
            throw new Error('ctx is null')
        }
        ctx.drawImage(image, 0, 0, this.width, this.height)
        if (!miCanvas) {
            throw new Error('miCanvas is null')
        }
        ctx.drawImage(miCanvas, 0, this.height, this.width, this.watermarkHeight())

        return imageCanvas
    }

    createMiCanvas = async (
        {
            lineTexts,
            style,
            logoSrc
        }: {
            lineTexts?: lineTextProps[],
            style?: {
                color: string,
            },
            logoSrc?: string
        }, image: Image,
    ) => {
        if (!image) {
            throw new Error('image is null')
        }
        const watermarkCanvas = createCanvas(this.width, this.watermarkHeight());
        const ctx = watermarkCanvas.getContext('2d');
        if (!ctx) {
            throw new Error('ctx is null')
        }
        if (!lineTexts) {
            throw new Error('lineText is null')
        }
        ctx.fillStyle = style?.color || '#ffffff'
        ctx.fillRect(0, 0, this.width, this.watermarkHeight());

        const maxWidth = Math.max(
            ...lineTexts
                .filter(item => item.linePosition.position === 'middleRight')
                .map(item => {
                    const fontSize = item.lineStyle.size ? this.calculateFontSize() + item.lineStyle.size : this.calculateFontSize();
                    // 设置字体样式
                    ctx.font = `${item.lineStyle.isBold ? 'bold' : ''} ${fontSize}px sans-serif`;
                    // 计算并返回宽度
                    return ctx.measureText(item.lineText).width;
                })
        );

        lineTexts.map((line) => {
            const maxTextWidth = line.linePosition.positionOffsets.x ? maxWidth + line.linePosition.positionOffsets.x : maxWidth;
            const fontSize = line.lineStyle.size ? this.calculateFontSize() + line.lineStyle.size : this.calculateFontSize();
            ctx.font = `${line.lineStyle.isBold ? 'bold' : ''} ${fontSize}px sans-serif`;
            ctx.fillStyle = line.lineStyle.color ?? '#000000';
            const offsetX = line.linePosition.position === 'middleRight' ? maxTextWidth : line.linePosition.positionOffsets.x;
            const {x, y} = this.calculatePosition(line.linePosition.position, {
                x: offsetX,
                y: line.linePosition.positionOffsets.y
            });
            ctx.fillText(line.lineText, x, y);
        })
        if (logoSrc) {
            await this.drawMiLogo({
                ctx,
                logoSrc: logoSrc,
                position: 'middleRight',
                positionOffsets: {
                    x: this.baseX * 2 + maxWidth,
                }
            })
        }
        return watermarkCanvas
    }
    drawMiLogo = async (
        {
            logoSrc,
            ctx,
            position,
            positionOffsets,
        }: {
            logoSrc: string
            ctx: CanvasRenderingContext2D,
            position: Position,
            positionOffsets: PositionOffsets
        }
    ) => {
        const logo = await loadImage(logoSrc);
        const {newLogoWidth, newLogoHeight} = this.resizeLogo({
            isMi: true,
            logoHeight: logo.height,
            logoWidth: logo.width,
            maxPercentage: 0.05
        });
        const logoY = this.baseY + this.watermarkHeight() / 2 - newLogoHeight / 2;
        const logoX = this.calculatePosition(position, {
            x: positionOffsets.x ? positionOffsets.x + newLogoWidth : positionOffsets.x,
        }).x;
        ctx.drawImage(logo, logoX, logoY, newLogoWidth, newLogoHeight);
    }

    calculateFontSize = (minFontSize = 20, maxFontSize = 100, areaFactor = 60): number => {
        // 计算图片的总面积
        const imgArea = this.width * this.height;

        // 根据图片的总面积计算字体大小
        const calculatedFontSize = Math.sqrt(imgArea) / areaFactor;

        // 确保字体大小在指定的范围内
        return Math.max(minFontSize, Math.min(maxFontSize, calculatedFontSize));
    };

    calculatePosition(position: Position, offsets: PositionOffsets = {x: 0, y: 0}): { x: number; y: number } {
        const canvasWidth = this.width;
        const canvasHeight = this.watermarkHeight();
        const {x: offsetX = 0, y: offsetY = 0} = offsets;
        let x: number, y: number;

        switch (position) {
            case 'topLeft':
                x = offsetX;
                y = offsetY;
                break;
            case 'bottomLeft':
                x = offsetX;
                y = canvasHeight - offsetY;
                break;
            case 'topRight':
                x = canvasWidth - offsetX;
                y = offsetY;
                break;
            case 'bottomRight':
                x = canvasWidth - offsetX;
                y = canvasHeight - offsetY;
                break;
            case 'topCenter':
                x = canvasWidth / 2 + offsetX;
                y = offsetY;
                break;
            case 'bottomCenter':
                x = canvasWidth / 2 + offsetX;
                y = canvasHeight - offsetY;
                break;
            case 'middleLeft':
                x = offsetX;
                y = canvasHeight / 2 + offsetY;
                break;
            case 'middleRight':
                x = canvasWidth - offsetX;
                y = canvasHeight / 2 + offsetY;
                break;
            case 'center':
                x = canvasWidth / 2 + offsetX;
                y = canvasHeight / 2 + offsetY;
                break;
        }

        return {x, y};
    }

    resizeLogo = (
        {
            logoWidth,
            logoHeight,
            maxPercentage,
            isMi = false
        }: {
            logoWidth: number,
            logoHeight: number,
            maxPercentage: number,
            isMi?: boolean
        }) => {
        const canvasHeight = isMi ? this.watermarkHeight() : this.height;
        const canvasArea = this.width * canvasHeight;
        const logoArea = logoWidth * logoHeight;
        const maxLogoArea = canvasArea * maxPercentage;
        const scale = Math.sqrt(maxLogoArea / logoArea);
        const newLogoWidth = logoWidth * scale;
        const newLogoHeight = logoHeight * scale;

        return {newLogoWidth, newLogoHeight};
    }
}