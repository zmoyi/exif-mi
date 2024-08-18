// 工具类：包含计算、绘制、和Canvas相关的工具方法
import {Position, PositionOffsets} from "@/lib/lib-type";

export class CanvasUtils {
    /**
     * 获取Canvas的2D上下文
     * @param canvas Canvas元素
     * @returns Canvas的2D上下文
     */
    static getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Canvas rendering context is null'); // 如果获取上下文失败，抛出错误
        }
        return ctx;
    }

    /**
     * 根据图片的宽高比计算适合的水印字体大小
     * @param imageWidth 图片宽度
     * @param imageHeight 图片高度
     * @param minFontSize 最小字体大小
     * @param maxFontSize 最大字体大小
     * @param areaFactor 面积因子，用于计算字体大小
     * @returns 计算出的字体大小
     */
    static calculateFontSize(
        imageWidth: number,
        imageHeight: number,
        minFontSize = 20,
        maxFontSize = 100,
        areaFactor = 60
    ): number {
        const imgArea = imageWidth * imageHeight; // 计算图片面积
        const calculatedFontSize = Math.sqrt(imgArea) / areaFactor; // 根据面积计算字体大小
        return Math.max(minFontSize, Math.min(maxFontSize, calculatedFontSize)); // 限制字体大小在最小和最大值之间
    }

    /**
     * 异步加载图片
     * @param src
     * @param file 图片文件
     * @returns 加载完成的HTMLImageElement
     */
    static async loadImage(src?: string | undefined, file?: File): Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();

            // 如果提供了 `file`，优先使用文件的URL作为图片源
            if (file) {
                image.src = URL.createObjectURL(file);
            } else if (src) {
                // 如果提供了 `src`，则使用 `src` 作为图片源
                image.src = src;
            } else {
                // 如果 `src` 和 `file` 都没有提供，抛出错误
                reject(new Error('No source or file provided for image loading'));
                return;
            }

            image.onload = () => resolve(image); // 图片加载成功时解析 Promise
            image.onerror = (error) => reject(error); // 图片加载失败时拒绝 Promise
        });
    }

    /**
     * 计算文本位置
     * @param position 位置枚举类型
     * @param offsets 位置偏移量
     * @param width 画布宽度
     * @param height 画布高度
     * @returns 包含x和y坐标的位置对象
     */
    static calculatePosition(
        position: Position,
        offsets: PositionOffsets,
        width: number,
        height: number
    ): { x: number; y: number } {
        const canvasWidth = width;
        const canvasHeight = height;
        const {x: offsetX = 0, y: offsetY = 0} = offsets; // 设置默认偏移量
        let x: number, y: number;

        // 根据传入的位置计算x和y的坐标
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

        return {x, y}; // 返回计算出的x和y坐标
    }

    /**
     * 在Canvas上下文中填充文本
     * @param ctx Canvas的2D上下文
     * @param lineText 文本内容
     * @param lineStyle 文本样式
     * @param position 文本的位置
     */
    static fillText(
        ctx: CanvasRenderingContext2D,
        lineText: string,
        lineStyle: {
            color: string;
            isBold: boolean;
            size: number;
            textAlign: CanvasTextAlign;
            textBaseline: CanvasTextBaseline;
        },
        position: { x: number; y: number }
    ) {
        ctx.fillStyle = lineStyle.color; // 设置文本颜色
        ctx.font = `bold ${lineStyle.size}px sans-serif`; // 设置文本字体和大小
        ctx.textAlign = lineStyle.textAlign; // 设置文本对齐方式
        ctx.textBaseline = lineStyle.textBaseline; // 设置文本基线
        ctx.fillText(lineText, position.x, position.y); // 在指定位置绘制文本
    }

    /**
     * 绘制logo
     */
    static async drawLogo(
        ctx: CanvasRenderingContext2D,
        logo: string,
        width: number,
        height: number,
        isMi: boolean = true,
        watermarkHeight: number,
        baseY: number = 0,
        position: Position,
        positionOffsets: PositionOffsets
    ) {
        const logoImage = await this.loadImage(logo);
        const {newLogoWidth, newLogoHeight} = this.resizeLogo({
            logoWidth: logoImage.width,
            logoHeight: logoImage.height,
            width,
            height,
            isMi,
            watermarkHeight,
            maxPercentage: 0.03
        });
        const logoY = baseY + watermarkHeight / 2 - newLogoHeight / 2;
        const logoX = this.calculatePosition(
            position,
            {
                x: positionOffsets.x ? positionOffsets.x + newLogoWidth : positionOffsets.x,
            },
            width,
            height
        ).x;
        ctx.drawImage(logoImage, logoX, logoY, newLogoWidth, newLogoHeight);
    }

    /**
     * 线性插值计算
     * @param min 最小值
     * @param max 最大值
     * @param factor 插值因子
     * @returns 插值后的结果
     */
    static interpolate(min: number, max: number, factor: number): number {
        return min + (max - min) * factor; // 计算插值结果
    }

    /**
     * 根据图片的宽高比计算水印的高度
     * @param imageWidth 图片宽度
     * @param imageHeight 图片高度
     * @param adjustmentFactor 调整因子，默认为1
     * @returns 计算出的水印高度
     */
    static getWatermarkHeight(
        imageWidth: number,
        imageHeight: number,
        adjustmentFactor: number = 1
    ): number {
        const aspectRatio = imageWidth / imageHeight; // 计算图片的宽高比

        let heightRatio: number;

        // 根据宽高比和调整因子计算水印高度比例
        if (aspectRatio < 1) {
            heightRatio = this.interpolate(0.08 * adjustmentFactor, 0.10 * adjustmentFactor, aspectRatio);
        } else if (aspectRatio > 1) {
            heightRatio = this.interpolate(0.12 * adjustmentFactor, 0.15 * adjustmentFactor, aspectRatio - 1);
        } else {
            heightRatio = 0.09 * adjustmentFactor;
        }

        return Math.floor(imageHeight * heightRatio); // 返回水印高度的整数值
    }

    /**
     * 重新计算 logo 的尺寸以适应 canvas
     * @param logoWidth logo 的原始宽度
     * @param logoHeight logo 的原始高度
     * @param maxPercentage logo 占据 canvas 区域的最大百分比
     * @param width canvas 的宽度
     * @param height canvas 的高度
     * @param watermarkHeight 水印高度，当 isMi 为 true 时使用
     * @param isMi 是否为水印模式，默认值为 false
     * @returns 重新计算后的 logo 宽高
     */
    static resizeLogo(
        {
            logoWidth,
            logoHeight,
            maxPercentage,
            width,
            height,
            watermarkHeight,
            isMi = false
        }: {
            logoWidth: number,
            logoHeight: number,
            maxPercentage: number,
            width: number,
            height: number,
            watermarkHeight?: number,
            isMi?: boolean
        }) {
        const canvasHeight = isMi ? watermarkHeight : height;
        const canvasArea = width * (canvasHeight || height);
        const logoArea = logoWidth * logoHeight;
        const maxLogoArea = canvasArea * maxPercentage;
        const scale = Math.sqrt(maxLogoArea / logoArea);
        const newLogoWidth = logoWidth * scale;
        const newLogoHeight = logoHeight * scale;

        return {newLogoWidth, newLogoHeight};
    }

    static RandomImageName(): string {
        // 获取当前时间戳
        const timestamp = Date.now();

        // 生成一个随机字符串
        const randomString = Math.random().toString(36).substring(2, 8);

        // 合成最终的文件名
        return `image_${timestamp}_${randomString}`
    }
}
