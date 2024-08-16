/*
 * Copyright (c) 2024.
 * by 刘铭熙
 */
import exifr from 'exifr'

// exif-data.ts
export interface ExifData {
    Make: string;
    Model: string;
    XResolution: number;
    YResolution: number;
    ResolutionUnit: string;
    Software: string;
    ModifyDate: string; // ISO 8601 日期时间格式
    Artist: string;
    ExposureTime: number; // 曝光时间（秒）
    FNumber: number; // 光圈值（f/数值）
    ExposureProgram: string; // 曝光程序（例如：光圈优先、快门优先等）
    ISO: number; // ISO 感光度
    SensitivityType: number; // 感光度类型（例如：标准ISO、扩展ISO等）
    RecommendedExposureIndex: number; // 推荐的曝光指数
    ExifVersion: string; // EXIF 版本
    DateTimeOriginal: string; // ISO 8601 日期时间格式
    CreateDate: string; // ISO 8601 日期时间格式
    OffsetTime: string; // 时区偏移量（例如：+08:00）
    OffsetTimeOriginal: string; // 原始时区偏移量（例如：+08:00）
    OffsetTimeDigitized: string; // 数字化的时区偏移量（例如：+08:00）
    ShutterSpeedValue: number; // 快门速度值（秒）
    ApertureValue: number; // 光圈值（f/数值）
    ExposureCompensation: number; // 曝光补偿（以EV为单位）
    MeteringMode: string; // 测光模式（例如：平均、中央重点等）
    LightSource: string; // 光源类型（例如：日光、荧光灯等）
    Flash: string; // 闪光灯状态（例如：闪光灯已闪光、闪光灯未闪光等）
    FocalLength: number; // 焦距（以毫米为单位）
    SubSecTimeOriginal: string; // 原始日期时间的子秒部分
    SubSecTimeDigitized: string; // 数字化的日期时间的子秒部分
    ColorSpace: number; // 色彩空间（例如：sRGB、Adobe RGB等）
    FocalPlaneXResolution: number; // 焦点平面的X方向分辨率
    FocalPlaneYResolution: number; // 焦点平面的Y方向分辨率
    FocalPlaneResolutionUnit: string; // 焦点平面分辨率单位（例如：毫米、英寸等）
    SensingMethod: string; // 感应器类型（例如：单芯片彩色区域感应器等）
    FileSource: string; // 文件来源（例如：数字相机、扫描仪等）
    SceneType: string; // 场景类型（例如：直接拍摄、全景等）
    CFAPattern: Array<number>; // CFAPattern 模式（通常是一个数组）
    CustomRendered: string; // 用户自定义渲染（例如：标准、自然等）
    ExposureMode: string; // 曝光模式（例如：自动、手动等）
    WhiteBalance: string; // 白平衡（例如：自动、手动等）
    FocalLengthIn35mmFormat: number; // 35mm格式下的焦距（以毫米为单位）
    SceneCaptureType: string; // 场景捕捉类型（例如：标准、高动态范围等）
    GainControl: string; // 增益控制（例如：低增益提升、高增益提升等）
    Contrast: string; // 对比度（例如：正常、高对比度等）
    Saturation: string; // 饱和度（例如：正常、低饱和度等）
    Sharpness: string; // 锐度（例如：正常、高锐度等）
    SubjectDistanceRange: string; // 主体距离范围（例如：未知、非常远等）
    SerialNumber: string; // 序列号
    LensInfo: Array<number>; // 镜头信息（通常是一个数组）
    LensModel: string; // 镜头型号
    LensSerialNumber: string; // 镜头序列号
}


export type ExifProps = {
    file: File;
}

export class ExifLib {
    file: File;
    exif: ExifData | undefined;

    constructor(exifProps: ExifProps) {
        this.file = exifProps.file;
    }

    getExif = async () => {
        this.exif = await exifr.parse(this.file);
        return this.exif
    }

    // 获取光圈值，快门，曝光时间，ISO，焦距，相机制作厂商，相机型号，拍摄日期，拍摄时间
    getExifData = () => {
        return {
            fNumber: this.exif?.FNumber,// 光圈值
            exposureTime: this.exif?.ExposureTime,// 曝光时间
            iso: this.exif?.ISO,// ISO
            focalLength: this.exif?.FocalLength,// 焦距
            make: this.exif?.Make,// 相机制作厂商
            model: this.exif?.Model,// 相机型号
            dateTimeOriginal: this.exif?.DateTimeOriginal,// 拍摄日期
        }
    }

}