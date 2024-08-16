import {ExifData} from "@/lib/exif-lib";

export interface KonvaLibProps {
    file: File;
    exif: ExifData;
    isMi?: boolean;
}

export class KonvaLib {
    private file: File; // 图片文件
    private exif: ExifData; // 图片的EXIF数据
    private image: HTMLImageElement = new Image(); // HTMLImageElement对象，用于加载图片
    private isMi: boolean; // 是否显示水印

    /**
     * 构造函数
     * @param file 图片文件
     * @param exif 图片的EXIF数据
     * @param isMi 是否显示水印，默认为true
     */
    constructor({file, exif, isMi = true}: KonvaLibProps) {
        this.file = file;
        this.exif = exif;
        this.isMi = isMi;
    }

    /**
     * 创建并返回包含图片和可选水印的Canvas元素
     * @param canvas 可选的Canvas元素，如果不提供则创建新的
     * @returns 包含绘制图片和水印的Canvas元素
     */
    async createStage(canvas?: HTMLCanvasElement): Promise<HTMLCanvasElement> {
        // 加载图片
        this.image = await this.loadImage();

        // 如果没有提供canvas，创建新的canvas元素
        if (!canvas) {
            canvas = document.createElement('canvas');
        }

        // 计算水印的高度
        const watermarkHeight = this.getWatermarkHeight();
        // 根据是否需要水印来计算画布的高度
        const imageCanvasHeight = this.isMi ? watermarkHeight + this.image.height : this.image.height;

        // 设置画布宽高
        canvas.width = this.image.width;
        canvas.height = imageCanvasHeight;

        // 获取画布的2D上下文
        const ctx = this.getCanvasContext(canvas);

        // 在画布上绘制图片
        this.renderImage(ctx);

        // 如果需要水印，绘制水印
        if (this.isMi) {
            this.renderWatermark(ctx, watermarkHeight);
        }

        return canvas;
    }

    /**
     * 在Canvas的上下文中绘制图片
     * @param ctx Canvas的2D上下文
     */
    private renderImage(ctx: CanvasRenderingContext2D): void {
        ctx.imageSmoothingEnabled = true; // 启用图像平滑
        ctx.clearRect(0, 0, this.image.width, this.image.height); // 清空画布
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height); // 绘制图片
    }

    /**
     * 在Canvas的上下文中绘制水印
     * @param ctx Canvas的2D上下文
     * @param watermarkHeight 水印的高度
     */
    private renderWatermark(ctx: CanvasRenderingContext2D, watermarkHeight: number): void {
        const watermarkCanvas = this.createWatermarkCanvas(watermarkHeight); // 创建水印画布
        // 在原图下方绘制水印
        ctx.drawImage(watermarkCanvas, 0, this.image.height, this.image.width, watermarkHeight);
    }

    /**
     * 创建用于绘制水印的Canvas元素
     * @param watermarkHeight 水印的高度
     * @returns 包含水印的Canvas元素
     */
    private createWatermarkCanvas(watermarkHeight: number): HTMLCanvasElement {
        const canvas = document.createElement('canvas'); // 创建新的canvas元素
        canvas.width = this.image.width;
        canvas.height = watermarkHeight;

        const ctx = this.getCanvasContext(canvas); // 获取canvas的2D上下文
        ctx.fillStyle = '#ffffff'; // 设置填充颜色为白色
        ctx.fillRect(0, 0, canvas.width, canvas.height); // 填充整个画布

        ctx.fillStyle = '#000000'; // 设置文本颜色为黑色
        ctx.font = `bold ${this.calculateFontSize()}px Arial`; // 设置字体
        ctx.textAlign = "center"; // 设置文本对齐方式为居中
        ctx.textBaseline = "middle"; // 设置文本基线为中间
        ctx.fillText(this.exif.Make, canvas.width / 2, canvas.height / 2); // 绘制水印文本

        return canvas;
    }

    /**
     * 根据图片的宽高比计算水印的高度
     * @returns 水印的高度
     */
    private getWatermarkHeight(): number {
        const aspectRatio = this.image.width / this.image.height; // 计算图片的宽高比
        if (aspectRatio < 1) {
            return Math.floor(this.image.height * 0.08); // 竖屏图片，水印高度为图片高度的8%
        } else if (aspectRatio > 1) {
            return Math.floor(this.image.height * 0.13); // 横屏图片，水印高度为图片高度的13%
        } else {
            return Math.floor(this.image.height * 0.09); // 方形图片，水印高度为图片高度的9%
        }
    }

    /**
     * 计算适合的水印字体大小
     * @param minFontSize 最小字体大小
     * @param maxFontSize 最大字体大小
     * @param areaFactor 面积因子，用于计算字体大小
     * @returns 计算出的字体大小
     */
    private calculateFontSize(minFontSize = 20, maxFontSize = 100, areaFactor = 60): number {
        const imgArea = this.image.width * this.image.height; // 计算图片面积
        const calculatedFontSize = Math.sqrt(imgArea) / areaFactor; // 根据图片面积计算字体大小
        return Math.max(minFontSize, Math.min(maxFontSize, calculatedFontSize)); // 限制字体大小在最小和最大值之间
    }

    /**
     * 获取Canvas的2D上下文
     * @param canvas Canvas元素
     * @returns Canvas的2D上下文
     */
    private getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Canvas rendering context is null'); // 如果获取上下文失败，抛出错误
        }
        return ctx;
    }

    /**
     * 异步加载图片
     * @returns 加载完成的HTMLImageElement
     */
    private async loadImage(): Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.src = URL.createObjectURL(this.file); // 设置图片的源为文件的URL
            image.onload = () => resolve(image); // 图片加载成功时解析Promise
            image.onerror = (error) => reject(error); // 图片加载失败时拒绝Promise
        });
    }
}
