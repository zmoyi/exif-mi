/*
 * Copyright (c) 2024.
 * by Liumingxi
 */

'use client'
import Image from "next/image";
import bg1 from "../../../public/bg/bg1.jpg";
import logoNikon from "../../../public/logo/nikon.svg";
import bg2 from "../../../public/bg/bg2.jpg";
import bg3 from "../../../public/bg/bg3.jpg";
import bg4 from "../../../public/bg/bg4.jpg";
import {useRouter} from "next/navigation";

type HandleClickProps = {
    label: string;
}
const Template = () => {
    const router = useRouter()
    const handleClick = (handleClickProps: HandleClickProps) => {
        // 根据label跳转不同页面
        switch (handleClickProps.label) {
            case 'mi':
                router.push('/create-mi')
                break;
            case 'text1':
                router.push('/text1');
                break;
            case 'text2':
                router.push('/text2');
                break;
            case 'mi2':
                router.push('/mi2');
                break;
        }
    }
    return (
        <>
            <div className={'lg:columns-2 gap-5 space-y-5'}>
                <div onClick={() => {
                    handleClick({label: 'mi'})
                }} className={'rounded-md overflow-hidden'}>
                    <Image className={'object-cover'} src={bg1} quality={1} placeholder={'blur'} priority={true}
                           alt={'bg'}/>
                    <div className={'w-full h-auto bg-white'}>
                        <div
                            className={'flex flex-1 p-2 flex-row justify-between text-black text-[8px] font-bold items-center'}>
                            <div className={'flex flex-col'}>
                                <p>NIKON CORPORATION NIKON Z 7_2</p>
                                <p>Viltrox AF 85/1.8 Z</p>
                            </div>
                            <div className={'flex flex-row justify-center items-center gap-2'}>
                                <div>
                                    <Image src={logoNikon} alt={'logo'} className={'w-8'}/>
                                </div>
                                <div className={'flex flex-col'}>
                                    <p>ISO600 F/1.8 1/1000s 85mm</p>
                                    <p>{new Date().toDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div onClick={() => {
                    handleClick({label: 'text1'})
                }} className={'relative rounded-md overflow-hidden'}>
                    <Image src={bg2} quality={1} placeholder={'blur'} priority={false} alt={'bg1'}
                           className={'object-cover'}/>
                    <div className={'absolute inset-x-0 bottom-2 text-center text-xs font-mono text-white'}>
                        <p>PHOTO BY <span className={'font-bold'}>EXIF MI</span></p>
                        <p className={'text-white/50 text-[10px]'}>ISO600 F/1.8 1/1000s
                            85mm {new Date().toDateString()}</p>
                    </div>
                </div>
                <div onClick={() => {
                    handleClick({label: 'text2'})
                }} className={'relative rounded-md overflow-hidden'}>
                    <Image src={bg3} quality={1} placeholder={'blur'} priority={false} alt={'bg1'}
                           className={'object-cover'}/>
                    <div className={'absolute inset-y-1/2 inset-x-0 text-center text-white text-xs font-serif'}>
                        <p>© Photo By <span className={'font-bold'}>EXIF MI</span></p>
                    </div>
                </div>
                <div onClick={() => {
                    handleClick({label: 'mi2'})
                }} className={'rounded-md overflow-hidden'}>
                    <Image src={bg4} quality={1} placeholder={'blur'} priority={false} alt={'bg4'}
                           className={'object-cover'}/>
                    <div className={'w-full h-auto bg-white'}>
                        <div
                            className={'flex flex-1 p-2 flex-row justify-center text-black text-[8px] font-bold items-center'}>
                            <div className={'flex flex-col items-center'}>
                                <div>
                                    <Image src={logoNikon} alt={'logo'} className={'w-8'}/>
                                </div>
                                <p>NIKON CORPORATION NIKON Z 7_2</p>
                                <p>Viltrox AF 85/1.8 Z</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Template