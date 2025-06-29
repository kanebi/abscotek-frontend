import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Gift, Search, ShoppingBag, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import useStore from "@/store/useStore";

export default function Frame() {
    const user = useStore((state) => state.user); // Assumes user object has { avatar, balance, ... }
    const defaultTopBackground = "rgba(36, 36, 36, 1)";

    return (
        <header className="relative w-full h-[84px] bg-neutral-900">
            {/* Desktop Header */}
            <div className="hidden md:flex md:min-w-[90%] items-center justify-between absolute top-3.5 left-[86px] w-[calc(100%-172px)]">
                <div className="inline-flex items-center gap-[52px] relative flex-[0_0_auto]">
                    <div className="inline-flex items-center gap-[10.1px] relative flex-[0_0_auto]">
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
                        <div className="relative w-[98.7px] h-8">
                            <div className="relative w-[99px] h-8 ">
                                <div className="absolute w-[99px] h-[30px]  bottom-0 left-0 bg-[url(/images/layer-2.svg)] bg-[100%_100%] bg-no-repeat" />
                            </div>
                        </div>
                    </div>
                    <div
                        className="flex flex-col w-[295px] items-start justify-center gap-2.5 px-4 py-3.5 relative rounded-xl overflow-hidden group"
                        style={{ background: `var(--defaulttop-background, ${defaultTopBackground})` }}
                    >
                        <div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto]">
                            <Search className="relative w-5 h-5 text-[#858585]" />
                            <input type="text" placeholder="Search" style={{ backgroundColor: 'transparent', border: 'none', height: 'inherit', width: 'inherit', outline: 'none' }} className="relative w-fit mt-[-1.00px] font-body-base-base-regular font-[number:var(--body-base-base-regular-font-weight)] text-[#858585] text-[length:var(--body-base-base-regular-font-size)] tracking-[var(--body-base-base-regular-letter-spacing)] leading-[var(--body-base-base-regular-line-height)] whitespace-nowrap [font-style:var(--body-base-base-regular-font-style)]" />
                        </div>
                    </div>
                </div>
                <div className="inline-flex items-start gap-3 relative flex-[0_0_auto]">
                    <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                        <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                            <Button
                                variant="secondary"
                                className="inline-flex flex-col items-start px-5 py-3 relative flex-[0_0_auto] rounded-xl overflow-hidden h-auto border-0 transition-colors hover:!bg-[rgba(36,36,36,0.8)]"
                                style={{ background: `var(--defaulttop-background, ${defaultTopBackground})` }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(36,36,36,0.8)'}
                                onMouseOut={e => e.currentTarget.style.background = `var(--defaulttop-background, ${defaultTopBackground})`}
                            >
                                <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                                    <img
                                        className="w-6 h-6 text-white "
                                        alt="Group"
                                        src="/images/ion-gift-sharp.svg"
                                    />
                                    <div className="relative w-fit mt-[-1.00px] font-body-large-large-medium font-[number:var(--body-large-large-medium-font-weight)] text-white text-[length:var(--body-large-large-medium-font-size)] tracking-[var(--body-large-large-medium-letter-spacing)] leading-[var(--body-large-large-medium-line-height)] whitespace-nowrap [font-style:var(--body-large-large-medium-font-style)]">
                                        Refers & Earn
                                    </div>
                                </div>
                            </Button>
                        </div>
                               {user ? (
                            <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                                <div className="flex flex-col w-[34px] items-center justify-center relative">
                                    <span className="relative w-fit mt-[-1.00px] font-body-base-base-semibold font-[number:var(--body-base-base-semibold-font-weight)] text-white text-[length:var(--body-base-base-semibold-font-size)] tracking-[var(--body-base-base-semibold-letter-spacing)] leading-[var(--body-base-base-semibold-line-height)] whitespace-nowrap [font-style:var(--body-base-base-semibold-font-style)]">
                                        TON
                                    </span>
                                    <span className="relative self-stretch font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-neutralneutral-100 text-[length:var(--body-base-base-medium-font-size)] text-center tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] [font-style:var(--body-base-base-medium-font-style)]">
                                        ${user.balance ?? 0}
                                    </span>
                                </div>
                                <Avatar className="relative w-12 h-12 bg-[#4e5462] rounded-xl overflow-hidden">
                                    <AvatarImage
                                        className="w-12 h-12 object-cover"
                                        alt={user.name || "Avatar sign IN"}
                                        src={user.avatar || "/images/avatar.png"}
                                    />
                                    <AvatarFallback className="bg-[#4e5462] text-white">
                                        {user.name ? user.name[0].toUpperCase() : "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </div>)
                            : (
                                <Button className="inline-flex items-center justify-center gap-2.5 px-7 py-[13px] relative flex-[0_0_auto] bg-primaryp-300 rounded-xl h-auto transition-colors hover:bg-primaryp-300/90">
                                    <div className="relative w-fit mt-[-1.00px] font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-white text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] whitespace-nowrap [font-style:var(--body-base-base-medium-font-style)]">
                                        Connect Wallet
                                    </div>
                                </Button>
                            )}
                        <Button
                            variant="secondary"
                            size="icon"
                            className="relative w-12 h-15 py-[20px] rounded-xl overflow-hidden border-0 transition-colors hover:!bg-[rgba(36,36,36,0.8)]"
                            style={{ background: `var(--defaulttop-background, ${defaultTopBackground})` }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(36,36,36,0.8)'}
                            onMouseOut={e => e.currentTarget.style.background = `var(--defaulttop-background, ${defaultTopBackground})`}
                        >
                            <img
                                className="w-6 h-6 text-white absolute top-0 left-0 right-0 bottom-0 m-auto"
                                alt="Group"
                                src="/images/solar-bag-3-bold.svg"
                            />
                        </Button>
                    </div>
                </div>
            </div>
            <Separator className="hidden md:block absolute w-[1440px] h-px top-[83px] left-0 bg-white/10" />

            {/* Mobile Header */}
            <div className="flex md:hidden w-full h-[94px] bg-neutral-900 items-center justify-center relative">
                <nav className="flex w-full  justify-between items-center relative px-[15px]">
                    <div className="inline-flex gap-[9.85px] flex-[0_0_auto] items-center relative">
                        <div className="relative w-[29.69px] h-[54.6px]">
                            <div className="relative w-[30px] h-[55px]">
                                <img
                                    className="absolute w-[18px] h-4 top-[19px] left-1.5"
                                    alt="Vector"
                                    src="/images/layer-2.svg"
                                />
                                <img
                                    className="absolute w-[30px] h-[55px] top-0 left-0"
                                    alt="Brand logo"
                                    src="/images/group-161972.svg"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="inline-flex gap-2 flex-[0_0_auto] items-center relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="flex flex-col w-10 h-10 items-center justify-center gap-[11.11px] px-[13.33px] py-[11.11px] bg-defaulttop-background rounded-[13.33px] overflow-hidden transition-colors hover:!bg-[rgba(36,36,36,0.8)]"
                            style={{ background: `var(--defaulttop-background, ${defaultTopBackground})` }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(36,36,36,0.8)'}
                            onMouseOut={e => e.currentTarget.style.background = `var(--defaulttop-background, ${defaultTopBackground})`}
                        >
                            <Search className="relative w-5 h-5 text-[#858585]" />
                        </Button>
                        {user ? (
                            <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                                <div className="flex flex-col w-[34px] items-center justify-center relative">
                                    <div className="relative w-fit mt-[-1.00px] font-body-small-small-semibold font-[number:var(--body-small-small-semibold-font-weight)] text-white text-[length:var(--body-small-small-semibold-font-size)] tracking-[var(--body-small-small-semibold-letter-spacing)] leading-[var(--body-small-small-semibold-line-height)] whitespace-nowrap [font-style:var(--body-small-small-semibold-font-style)]">
                                        TON
                                    </div>
                                    <div className="relative self-stretch font-body-small-small-medium font-[number:var(--body-small-small-medium-font-weight)] text-neutralneutral-100 text-[length:var(--body-small-small-medium-font-size)] text-center tracking-[var(--body-small-small-medium-letter-spacing)] leading-[var(--body-small-small-medium-line-height)] [font-style:var(--body-small-small-medium-font-style)]">
                                        ${user.balance ?? 0}
                                    </div>
                                </div>
                                <Avatar className="w-10 h-10 bg-[#4e5462] rounded-[10px] overflow-hidden">
                                    <AvatarImage
                                        src={user.avatar || "/images/avatar.png"}
                                        alt={user.name || "Avatar"}
                                        className="w-10 h-10 object-cover"
                                    />
                                    <AvatarFallback className="w-10 h-10 bg-[#4e5462]">
                                        {user.name ? user.name[0].toUpperCase() : "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        ) : (
                            <Button className="inline-flex justify-center gap-2.5 px-6 py-3 flex-[0_0_auto] bg-primaryp-300 rounded-xl items-center transition-colors hover:bg-primaryp-400 h-auto">
                                <span className="relative w-fit mt-[-1.00px] font-body-small-small-medium font-[number:var(--body-small-small-medium-font-weight)] text-white text-[length:var(--body-small-small-medium-font-size)] tracking-[var(--body-small-small-medium-letter-spacing)] leading-[var(--body-small-small-medium-line-height)] whitespace-nowrap [font-style:var(--body-small-small-medium-font-style)]">
                                    Connect Wallet
                                </span>
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative w-10 h-10 items-center justify-center gap-[11.11px] px-[13.33px] py-[11.11px] bg-defaulttop-background rounded-[13.33px] overflow-hidden transition-colors hover:!bg-[rgba(36,36,36,0.8)]"
                            style={{ background: `var(--defaulttop-background, ${defaultTopBackground})` }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(36,36,36,0.8)'}
                            onMouseOut={e => e.currentTarget.style.background = `var(--defaulttop-background, ${defaultTopBackground})`}
                        >
                            <img
                                className="w-5 h-5 text-white absolute top-0 left-0 right-0 bottom-0 m-auto"
                                alt="Bag"
                                src="/images/solar-bag-3-bold.svg"
                            />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative w-10 h-10 items-center justify-center gap-[11.11px] px-[13.33px] py-[11.11px] bg-defaulttop-background rounded-[13.33px] overflow-hidden transition-colors hover:!bg-[rgba(36,36,36,0.8)]"
                            style={{ background: `var(--defaulttop-background, ${defaultTopBackground})` }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(36,36,36,0.8)'}
                            onMouseOut={e => e.currentTarget.style.background = `var(--defaulttop-background, ${defaultTopBackground})`}
                        >
                            <img
                                className="text-white absolute top-0 left-0 right-0 bottom-0 m-auto"
                                alt="Menu"
                                src="/images/hugeicons_menu-09.svg"
                            />
                        </Button>
                    </div>
                </nav>
            </div>
        </header>
    );
}
