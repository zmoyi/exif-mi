import {lineTextProps, MiCanvasProps, Watermark, WatermarkCanvas} from "@/lib/lib-type";
import {CanvasUtils} from "@/lib/CanvasUtils";
import {ExifData} from "@/lib/exif-lib";

export interface KonvaLibProps {
    file: File;
    exif: ExifData;
    isMi?: boolean;
}

export class KonvaLib {
    file: File; // 图片文件
    isMi: boolean; // 是否显示水印
    baseX: number;
    private image: HTMLImageElement = new Image(); // HTMLImageElement对象，用于加载图片

    /**
     * 构造函数
     * @param file 图片文件
     * @param isMi 是否显示水印，默认为true
     */
    constructor({file, isMi = true}: KonvaLibProps) {
        this.file = file;
        this.isMi = isMi;
        this.baseX = 0;
    }

    /**
     * 创建并返回包含图片和可选水印的Canvas元素
     * @param props 画布和水印相关的属性
     * @returns 包含绘制图片和水印的Canvas元素
     */
    async createStage(props: MiCanvasProps): Promise<{ canvas: HTMLCanvasElement }> {
        let canvas = props.miCanvas;
        const backgroundColor = props.style.color ?? '#ffffff';

        // 加载图片
        this.image = await CanvasUtils.loadImage(undefined, this.file);
        this.baseX = this.image.width * 0.02;

        // 如果没有提供canvas，创建新的canvas元素
        if (!canvas) {
            canvas = document.createElement('canvas');
        }

        // 计算水印的高度
        const watermarkHeight = CanvasUtils.getWatermarkHeight(this.image.width, this.image.height);
        // 根据是否需要水印来计算画布的高度
        const imageCanvasHeight = this.isMi ? watermarkHeight + this.image.height : this.image.height;

        // 设置画布宽高
        canvas.width = this.image.width;
        canvas.height = imageCanvasHeight;

        // 获取画布的2D上下文
        const ctx = CanvasUtils.getCanvasContext(canvas);
        // 在画布上绘制图片
        this.renderImage(ctx);

        // 如果需要水印，绘制水印
        if (this.isMi) {
            await this.renderWatermark({
                ctx,
                logoSrc: props.logoSrc,
                watermarkHeight,
                backgroundColor,
                lineTexts: props.lineTexts
            });
        }

        return {canvas};
    }

    /**
     * 在Canvas的上下文中绘制图片
     * @param ctx Canvas的2D上下文
     */
    private renderImage(ctx: CanvasRenderingContext2D): void {
        ctx.clearRect(0, 0, this.image.width, this.image.height); // 清空画布
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height); // 在画布上绘制图片
    }

    /**
     * 绘制水印
     * @param props 水印相关的属性
     */
    private async renderWatermark(props: Watermark): Promise<void> {
        const {ctx, watermarkHeight} = props;

        const watermarkCanvas = await this.createWatermarkCanvas(props); // 创建水印画布
        // 将水印画布绘制到图片的底部
        ctx.drawImage(watermarkCanvas, 0, this.image.height, this.image.width, watermarkHeight);
    }

    /**
     * 创建一个包含水印的Canvas元素
     * @param props 水印画布相关的属性
     * @returns 包含水印的Canvas元素
     */
    private async createWatermarkCanvas(props: WatermarkCanvas): Promise<HTMLCanvasElement> {
        const {watermarkHeight, backgroundColor, lineTexts, logoSrc} = props;
        const canvas = document.createElement('canvas');
        canvas.width = this.image.width;
        canvas.height = watermarkHeight;

        const ctx = CanvasUtils.getCanvasContext(canvas);


        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height); // 设置水印背景色
        // 获取文本中最长的文本宽度
        const maxWidth = this.getMaxTextWidth(ctx, lineTexts);
        if (logoSrc) {
            await CanvasUtils.drawLogo(
                ctx,
                logoSrc,
                this.image.width,
                this.image.height,
                true,
                watermarkHeight,
                0,
                'middleRight',
                {
                    x: maxWidth + this.baseX * 2,
                    y: 0
                }
            )
        }
        // 绘制每行水印文本
        lineTexts.forEach(line => {
            this.drawWatermarkText(ctx, line, maxWidth, watermarkHeight);
        });


        return canvas; // 返回包含水印的Canvas元素
    }

    /**
     * 计算给定文本数组中，所有文本中最长的文本宽度
     * @param ctx Canvas的2D上下文
     * @param lineTexts 文本数组
     * @returns 最长的文本宽度
     */
    private getMaxTextWidth(ctx: CanvasRenderingContext2D, lineTexts: lineTextProps[]): number {
        return Math.max(
            ...lineTexts
                .filter(item => item.linePosition.position === 'middleRight')
                .map(item => {
                    const fontSize = CanvasUtils.calculateFontSize(
                        this.image.width,
                        this.image.height
                    ) + (item.lineStyle.size ?? 0);

                    ctx.font = `${item.lineStyle.isBold ? 'bold' : ''} ${fontSize}px sans-serif`;
                    return ctx.measureText(item.lineText).width;
                })
        );
    }

    /**
     * 在Canvas上绘制水印文本
     * @param ctx Canvas的2D上下文
     * @param line 单行文本的属性
     * @param maxWidth 文本的最大宽度
     * @param watermarkHeight 水印的高度
     */
    private drawWatermarkText(
        ctx: CanvasRenderingContext2D,
        line: lineTextProps,
        maxWidth: number,
        watermarkHeight: number
    ): void {
        const maxTextWidth = line.linePosition.positionOffsets.x
            ? maxWidth + line.linePosition.positionOffsets.x
            : maxWidth;

        const offsetX = (() => {
            switch (line.linePosition.position) {
                case 'middleRight':
                    return maxTextWidth + this.baseX;
                case 'middleLeft':
                    return this.baseX; // middleLeft 考虑 baseX 的偏移
                default:
                    // 检查 positionOffsets.x 是否存在，并且是一个因子
                    const posX = line.linePosition.positionOffsets.x;
                    return posX !== undefined
                        ? (posX <= 1 ? posX * this.image.width : posX) // 如果是因子，按比例计算偏移量
                        : 0; // 如果没有定义，返回 0 作为默认偏移
            }
        })();
        const offsetY = (() => {
            const posY = line.linePosition.positionOffsets.y;
            return posY !== undefined
                ? (posY <= 1 ? posY * watermarkHeight : posY) // 如果是因子，按比例计算偏移量
                : 0; // 如果没有定义，返回 0 作为默认偏移
        })();


        // 计算文本的位置
        const {x, y} = CanvasUtils.calculatePosition(
            line.linePosition.position,
            {
                x: offsetX,
                y: offsetY
            },
            this.image.width,
            watermarkHeight
        );

        // 绘制文本
        CanvasUtils.fillText(ctx, line.lineText, {
            color: line.lineStyle.color ?? '#000000',
            isBold: line.lineStyle.isBold ?? false,
            size: CanvasUtils.calculateFontSize(this.image.width, this.image.height) + (line.lineStyle.size ?? 0),
            textAlign: line.lineStyle.textAlign ?? 'center',
            textBaseline: line.lineStyle.textBaseline ?? 'middle',
        }, {x, y});
    }

}
