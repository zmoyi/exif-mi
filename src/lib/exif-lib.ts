/*
 * Copyright (c) 2024.
 * by 刘铭熙
 */
import exifr from 'exifr'

// exif-data.ts
export interface ExifData {
    // 相机制造商
    make: string;

    // 相机型号
    model: string;

    // X方向分辨率
    xResolution: number;

    // Y方向分辨率
    yResolution: number;

    // 分辨率单位
    resolutionUnit: string;

    // 处理照片的软件
    software: string;

    // 修改日期（照片被修改的日期）
    modifyDate: string; // ISO 8601 日期时间格式

    // 摄影师
    artist: string;

    // 曝光时间
    exposureTime: number; // 曝光时间（秒）

    // 光圈值
    fNumber: number; // 光圈值（f/数值）

    // 曝光程序
    exposureProgram: string; // 曝光程序（例如：光圈优先、快门优先等）

    // ISO感光度
    iso: number; // ISO 感光度

    // 感光度类型
    sensitivityType: number; // 感光度类型（例如：标准ISO、扩展ISO等）

    // 推荐曝光指数
    recommendedExposureIndex: number; // 推荐的曝光指数

    // EXIF版本
    exifVersion: string; // EXIF 版本

    // 原始日期时间
    dateTimeOriginal: string; // ISO 8601 日期时间格式

    // 创建日期
    createDate: string; // ISO 8601 日期时间格式

    // 时区偏移量
    offsetTime: string; // 时区偏移量（例如：+08:00）

    // 原始时区偏移量
    offsetTimeOriginal: string; // 原始时区偏移量（例如：+08:00）

    // 数字化的时区偏移量
    offsetTimeDigitized: string; // 数字化的时区偏移量（例如：+08:00）

    // 快门速度值
    shutterSpeedValue: number; // 快门速度值（秒）

    // 光圈值
    apertureValue: number; // 光圈值（f/数值）

    // 曝光补偿
    exposureCompensation: number; // 曝光补偿（以EV为单位）

    // 测光模式
    meteringMode: string; // 测光模式（例如：平均、中央重点等）

    // 光源类型
    lightSource: string; // 光源类型（例如：日光、荧光灯等）

    // 闪光灯状态
    flash: string; // 闪光灯状态（例如：闪光灯已闪光、闪光灯未闪光等）

    // 焦距
    focalLength: number; // 焦距（以毫米为单位）

    // 原始日期时间的子秒部分
    subSecTimeOriginal: string; // 原始日期时间的子秒部分

    // 数字化的日期时间的子秒部分
    subSecTimeDigitized: string; // 数字化的日期时间的子秒部分

    // 色彩空间
    colorSpace: number; // 色彩空间（例如：sRGB、Adobe RGB等）

    // 焦点平面的X方向分辨率
    focalPlaneXResolution: number; // 焦点平面的X方向分辨率

    // 焦点平面的Y方向分辨率
    focalPlaneYResolution: number; // 焦点平面的Y方向分辨率

    // 焦点平面分辨率单位
    focalPlaneResolutionUnit: string; // 焦点平面分辨率单位（例如：毫米、英寸等）

    // 感应器类型
    sensingMethod: string; // 感应器类型（例如：单芯片彩色区域感应器等）

    // 文件来源
    fileSource: string; // 文件来源（例如：数字相机、扫描仪等）

    // 场景类型
    sceneType: string; // 场景类型（例如：直接拍摄、全景等）

    // CFAPattern
    cfAPattern: Array<number>; // CFAPattern 模式（通常是一个数组）

    customRendered: string; // 用户自定义渲染（例如：标准、自然等）

    // 曝光模式
    exposureMode: string; // 曝光模式（例如：自动、手动等）

    // 白平衡
    whiteBalance: string; // 白平衡（例如：自动、手动等）

    // 35mm格式下的焦距
    focalLengthIn35mmFormat: number; // 35mm格式下的焦距（以毫米为单位）

    // 场景捕捉类型
    sceneCaptureType: string; // 场景捕捉类型（例如：标准、高动态范围等）

    // 增益控制
    gainControl: string; // 增益控制（例如：低增益提升、高增益提升等）

    // 对比度
    contrast: string; // 对比度（例如：正常、高对比度等）

    // 饱和度
    saturation: string; // 饱和度（例如：正常、低饱和度等）

    // 锐度
    sharpness: string; // 锐度（例如：正常、高锐度等）

    // 主体距离范围
    subjectDistanceRange: string; // 主体距离范围（例如：未知、非常远等）

    // 序列号
    serialNumber: string; // 序列号

    // 镜头信息
    lensInfo: Array<number>; // 镜头信息（通常是一个数组）

    // 镜头型号
    lensModel: string; // 镜头型号

    // 镜头序列号
    lensSerialNumber: string; // 镜头序列号
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
            fNumber: this.exif?.fNumber,// 光圈值
            exposureTime: this.exif?.exposureTime,// 曝光时间
            iso: this.exif?.iso,// ISO
            focalLength: this.exif?.focalLength,// 焦距
            make: this.exif?.make,// 相机制作厂商
            model: this.exif?.model,// 相机型号
            dateTimeOriginal: this.exif?.dateTimeOriginal,// 拍摄日期
        }
    }

}