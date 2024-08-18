/**
 * 定义文本样式类型，包括颜色、是否加粗、字体大小、文本对齐方式和基线对齐方式。
 */
type LineStyle = {
    color?: string,                 // 文本颜色，可选
    isBold?: boolean,               // 是否加粗，可选
    size?: number,                  // 字体大小，可选
    textAlign: CanvasTextAlign,     // 文本对齐方式
    textBaseline: CanvasTextBaseline, // 文本基线对齐方式
}

/**
 * 定义文本位置类型，包括位置标识和偏移量。
 */
type LinePosition = {
    position: Position,             // 文本位置
    positionOffsets: PositionOffsets // 位置偏移量
}

/**
 * 定义单行文本属性，包括文本内容、样式和位置。
 */
type lineTextProps = {
    lineText: string,               // 文本内容
    lineStyle: LineStyle,           // 文本样式
    linePosition: LinePosition      // 文本位置
}

/**
 * 定义画布绘制属性，包括文本数组、Logo、样式和可选的Canvas元素。
 */
type MiCanvasProps = {
    lineTexts: lineTextProps[],     // 多行文本数组
    logoSrc?: string,               // Logo图片路径，可选
    style: {
        color: string,              // 背景颜色
    }
    miCanvas?: HTMLCanvasElement,   // 可选的Canvas元素
}

/**
 * 定义水印绘制所需的属性，包括Canvas上下文、水印高度、背景颜色和文本数组。
 */
type Watermark = {
    ctx: CanvasRenderingContext2D,  // Canvas 2D上下文
    logoSrc?: string,                // Logo图片路径
    watermarkHeight: number,        // 水印高度
    backgroundColor: string,        // 背景颜色
    lineTexts: lineTextProps[],     // 多行文本数组
}

/**
 * 定义用于创建水印Canvas的属性，包括水印高度、背景颜色和文本数组。
 */
type WatermarkCanvas = {
    logoSrc?: string,                // Logo图片路径
    watermarkHeight: number,        // 水印高度
    backgroundColor: string,        // 背景颜色
    lineTexts: lineTextProps[],     // 多行文本数组
}

/**
 * 定义填充文本所需的属性，包括Canvas上下文、文本内容、样式和位置。
 */
type FillTextProps = {
    ctx: CanvasRenderingContext2D,  // Canvas 2D上下文
    lineText: string,               // 文本内容
    lineStyle: LineStyle,           // 文本样式
    linePosition: {
        x: number,                  // 文本位置X坐标
        y: number,                  // 文本位置Y坐标
    }
}

/**
 * 定义文本在画布中的位置枚举类型。
 */
type Position =
    'topLeft'       // 左上角
    | 'bottomLeft'  // 左下角
    | 'topRight'    // 右上角
    | 'bottomRight' // 右下角
    | 'topCenter'   // 顶部中心
    | 'bottomCenter' // 底部中心
    | 'middleLeft'  // 左侧中间
    | 'middleRight' // 右侧中间
    | 'center';     // 中心

/**
 * 定义位置偏移量类型，包括X和Y轴的偏移量。
 */
type PositionOffsets = {
    x?: number;     // X轴偏移量，可选
    y?: number;     // Y轴偏移量，可选
}

/**
 * 导出所有类型，使其可以在其他模块中使用。
 */
export type {
    MiCanvasProps,
    lineTextProps,
    Watermark,
    WatermarkCanvas,
    FillTextProps,
    LineStyle,
    LinePosition,
    Position,
    PositionOffsets
}
