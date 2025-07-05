import React from "react";
import { X, Instagram } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const socialLinks = [
    {
        icon: <img src="/images/ant-design-x-outlined.svg"  alt="Twitter" className="w-6 h-6" />,
        label: "Twitter",
        href: "#"
    },
    {
        icon: <img src="/images/ri-instagram-fill.svg" alt="Instagram"   className="w-6 h-6" />,
        label: "Instagram", 
        href: "#"
    }
];

const contactInfo = [
    {
        label: "Service Hours:",
        value: "Monday - Sunday 8AM to 5PM"
    },
    {
        label: "Phone Number:",
        value: "+234 806 856 9286"
    },
    {
        label: "WhatsApp Number",
        value: "+234 803 868 2705"
    }
];

export default function Footer() {
    return (
        <footer className="bg-neutral-900 w-full">
            {/* Desktop Footer */}
            <div className="hidden md:flex flex-col items-start gap-2.5 px-[81px] py-[52px]">
                <div className="flex flex-col w-full items-end gap-[60px] flex-[0_0_auto]">
                    <div className="flex items-start justify-between w-full flex-[0_0_auto]">
                        <div className="flex flex-col w-[331px] items-start justify-center gap-5">
                            <div className="flex flex-col items-start gap-4 w-full flex-[0_0_auto]">
                                <div className="inline-flex items-center gap-[10.1px] flex-[0_0_auto]">
                                    <div className="relative w-[30.45px] h-14">
                                        <div className="relative w-[30px] h-14">
                                            <img
                                                className="absolute w-[18px] h-[17px] top-5 left-1.5"
                                                alt="Vector"
                                        src="/images/layer-2.svg"
                                            />
                                            <img
                                                className="absolute w-[30px] h-14 top-0 left-0"
                                                alt="Group"
                                        src="/images/group-161972.svg"
                                            />
                                        </div>
                                    </div>
                                    <div className="relative w-[98.7px] h-7">
                                        <div className="relative w-[99px] h-7">
                                            <div className="absolute w-[99px] h-[17px] top-0 left-0 bg-[100%_100%]" />
                                            {/* <div className="absolute w-20 h-2.5 top-[18px] left-[18px] bg-[url(/images/group-161972.svg)] bg-[100%_100%]" /> */}
                                      
                        <div className="relative w-[98.7px] h-8">
                            <div className="relative w-[99px] h-8 ">
                                <div className="absolute w-[99px] h-[30px]  bottom-0 left-0 bg-[url(/images/layer-2.svg)] bg-[100%_100%] bg-no-repeat" />
                            </div>
                        </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="font-body-base-base-regular font-[number:var(--body-base-base-regular-font-weight)] text-defaultgrey text-[length:var(--body-base-base-regular-font-size)] tracking-[var(--body-base-base-regular-letter-spacing)] leading-[var(--body-base-base-regular-line-height)] [font-style:var(--body-base-base-regular-font-style)]">
                                    Welcome to the First Onchain Marketplace for all your tech
                                    devices and accessories. Make yourself at hom among other Top
                                    Chads
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-[37px] flex-[0_0_auto]">
                                {socialLinks.map((social, index) => (
                                    <div key={index} className="inline-flex items-center gap-2 flex-[0_0_auto]">
                                        <div className="flex flex-col w-10 items-center justify-center gap-2.5 px-2 py-2 bg-defaulttop-background rounded-xl">
                                            {social.icon} 
                                        </div>
                                        <span className="w-fit font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-[#dedede] text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] whitespace-nowrap [font-style:var(--body-base-base-medium-font-style)]">
                                            {social.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col w-[299px] items-start gap-[17px]">
                            {contactInfo.map((info, index) => (
                                <div key={index} className="inline-flex flex-col items-start gap-1 flex-[0_0_auto]">
                                    <div className="mt-[-1.00px] font-body-large-large-regular font-[number:var(--body-large-large-regular-font-weight)] text-neutralneutral-100 text-[length:var(--body-large-large-regular-font-size)] tracking-[var(--body-large-large-regular-letter-spacing)] leading-[var(--body-large-large-regular-line-height)] [font-style:var(--body-large-large-regular-font-style)]">
                                        {info.label}
                                    </div>
                                    <div className="w-fit font-body-large-large-medium font-[number:var(--body-large-large-medium-font-weight)] text-white text-[length:var(--body-large-large-medium-font-size)] tracking-[var(--body-large-large-medium-letter-spacing)] leading-[var(--body-large-large-medium-line-height)] whitespace-nowrap [font-style:var(--body-large-large-medium-font-style)]">
                                        {info.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col w-[399px] items-start gap-1">
                            <div className="mt-[-1.00px] font-body-large-large-regular font-[number:var(--body-large-large-regular-font-weight)] text-neutralneutral-100 text-[length:var(--body-large-large-regular-font-size)] tracking-[var(--body-large-large-regular-letter-spacing)] leading-[var(--body-large-large-regular-line-height)] [font-style:var(--body-large-large-regular-font-style)]">
                                Office Address:
                            </div>
                            <div className="font-body-large-large-medium font-[number:var(--body-large-large-medium-font-weight)] text-white text-[length:var(--body-large-large-medium-font-size)] tracking-[var(--body-large-large-medium-letter-spacing)] leading-[var(--body-large-large-medium-line-height)] [font-style:var(--body-large-large-medium-font-style)]">
                                6 Otigba Street, Domino plaza, Computer Village, Ikeja, Lagos,
                                Nigeria.
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-9 w-full flex-[0_0_auto]">
                        <Separator className="self-stretch w-full h-px mt-[-1.00px] bg-gray-600" />

                        <div className="font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-defaultwhite text-[length:var(--body-base-base-medium-font-size)] text-center tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] [font-style:var(--body-base-base-medium-font-style)]">
                            Copyright ©2025 Absoc Tech Limited ALL RIGHTS RESERVED.
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Footer */}
            <div className="flex md:hidden items-center gap-2.5 px-4 py-12">
                <div className="flex flex-col items-end gap-[60px] flex-1 grow w-full">
                    <div className="flex flex-col items-start gap-8 self-stretch w-full">
                        <div className="flex flex-col w-[331px] items-start justify-center gap-5">
                            <div className="flex flex-col items-start gap-4 self-stretch w-full">
                                <div className="inline-flex items-center gap-[10.1px]">
                                    <div className="relative w-[30.45px] h-14">
                                        <div className="relative w-[30px] h-14">
                                            <img className="absolute w-[18px] h-[17px] top-5 left-1.5" alt="Vector" src="/images/layer-2.svg" />
                                            <img className="absolute w-[30px] h-14 top-0 left-0" alt="Group" src="/images/group-161972.svg" />
                                        </div>
                                    </div>
                                    <div className="relative w-[114.42px] h-7">
                                        <img
                                            className="absolute w-[113px] h-[18px] top-0 left-0 object-contain"
                                            alt="Logo text"
                                            src="/images/layer-2.svg"
                                        />
                                    </div>
                                </div>
                                <p className="self-stretch font-body-base-base-regular font-[number:var(--body-base-base-regular-font-weight)] text-defaultgrey text-[length:var(--body-base-base-regular-font-size)] tracking-[var(--body-base-base-regular-letter-spacing)] leading-[var(--body-base-base-regular-line-height)] [font-style:var(--body-base-base-regular-font-style)]">
                                    Welcome to the largest NFT marketplace based on The Open Network. Make yourself at home among other NFT enthusiasts.
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-[37px]">
                                {socialLinks.map((social, index) => (
                                    <div key={index} className="inline-flex items-center gap-2">
                                        <div className={`flex flex-col w-10 items-center justify-center gap-2.5 px-2 py-2 bg-defaulttop-background rounded-xl`}>
                                            {social.icon}
                                        </div>
                                        <span className="font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-[#dedede] text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] whitespace-nowrap [font-style:var(--body-base-base-medium-font-style)]">
                                            {social.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col w-[299px] items-start gap-[17px]">
                            {contactInfo.map((info, index) => (
                                <div key={index} className="inline-flex flex-col items-start gap-1">
                                    <div className="self-stretch mt-[-1.00px] font-body-large-large-regular font-[number:var(--body-large-large-regular-font-weight)] text-neutralneutral-100 text-[length:var(--body-large-large-regular-font-size)] tracking-[var(--body-large-large-regular-letter-spacing)] leading-[var(--body-large-large-regular-line-height)] [font-style:var(--body-large-large-regular-font-style)]">
                                        {info.label}
                                    </div>
                                    <div className="font-body-large-large-medium font-[number:var(--body-large-large-medium-font-weight)] text-white text-[length:var(--body-large-large-medium-font-size)] tracking-[var(--body-large-large-medium-letter-spacing)] leading-[var(--body-large-large-medium-line-height)] whitespace-nowrap [font-style:var(--body-large-large-medium-font-style)]">
                                        {info.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col w-[399px] items-start gap-1 mr-[-19.00px]">
                            <div className="self-stretch mt-[-1.00px] font-body-large-large-regular font-[number:var(--body-large-large-regular-font-weight)] text-neutralneutral-100 text-[length:var(--body-large-large-regular-font-size)] tracking-[var(--body-large-large-regular-letter-spacing)] leading-[var(--body-large-large-regular-line-height)] [font-style:var(--body-large-large-regular-font-style)]">
                                Office Address:
                            </div>
                            <div className="self-stretch font-body-large-large-medium font-[number:var(--body-large-large-medium-font-weight)] text-white text-[length:var(--body-large-large-medium-font-size)] tracking-[var(--body-large-large-medium-letter-spacing)] leading-[var(--body-large-large-medium-line-height)] [font-style:var(--body-large-large-medium-font-style)]">
                                Shop E8 Diamond Plaza beside UBA Bank, Oremeji st, Computer Village Ikeja Lagos
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-9 self-stretch w-full">
                        <Separator className="self-stretch w-full h-px mt-[-1.00px] bg-gray-600" />
                        <div className="self-stretch font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-defaultwhite text-[length:var(--body-base-base-medium-font-size)] text-center tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] [font-style:var(--body-base-base-medium-font-style)]">
                            Copyright ©2024 Absoc Tech Limited ALL RIGHTS RESERVED.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}