import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import useStore from "@/store/useStore";
import { ChevronDown, TrendingUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import SliderCart from "@/components/ui/SliderCart";


export default function Frame() {
    const user = useStore((state) => state.user); // Assumes user object has { avatar, balance, ... }
    const defaultTopBackground = "rgba(36, 36, 36, 1)";

    return (
        <header className="overflow-hidden relative w-full md:h-[156px] h-[184px] bg-neutral-900">
            {/* Desktop Header */}
            <div className="hidden md:flex w-[86%] items-center justify-between mt-3.5 mx-auto">
                <div className="inline-flex items-center gap-[52px] relative flex-[0_0_auto]">
                    <div className="inline-flex items-center gap-[10.1px] relative flex-[0_0_auto]">
                        <div className="relative w-[30.45px] h-14">
                            <div className="relative w-[30px] h-14">
                               
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
                            <div className="inline-flex items-center gap-4 relative flex-[0_0_auto]">

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
                        <SliderCart />

                    </div>
                </div>
            </div>

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

                        <SliderCart />
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
            <Separator className=" sm:block   w-full h-px mt-[15px] left-0 bg-white/10" />
            {/* Navigation Bar */}
            <div className=" md:w-[86%] w-full py-2 px-[17px] md:px-0 md:mx-auto">
                <NavigationBar />

            </div>


        </header>
    );
}


export function NavigationBar() {
    const navItems = ["Computer", "Phone", "Web3 Accessories", "Web3 Gaming", "Smartwatches", "Tablets", "Audio"]
    const TodayPrices = [
        { Label: "USDT: $1.01", value: "usdt", rate: "1.01", iconSrc: "/images/usdt-icon.svg", bg: '#00A478' },
        { Label: "BTC: $43,250", value: "btc", rate: "43250", iconSrc: "/images/btc-icon.svg", bg: '#F7931A' },
        { Label: "ETH: $2,580", value: "eth", rate: "2580", iconSrc: "/images/eth-icon.svg", bg: '#3C3C3D' }
    ]
    const [selectedPrice, setSelectedPrice] = React.useState(TodayPrices[0]);

    return (
        <nav className=" text-defaultwhite">
            <div className="flex items-center  justify-between max-w-full   py-2">
                {/* Left side - Price indicator */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-defaultgrey whitespace-nowrap">Today Price:</span>
                    <div className="flex items-center gap-2">
                        {/* <TrendingUp className="w-4 h-4 text-primaryp-300" /> */}
                        <DropdownMenu modal >
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={`text-defaultwhite w-36 relative hover:text-defaultwhite hover:bg-defaulttop-background h-auto font-normal outline-none border-none hover:outline-none flex items-center gap-1 `}
                                >
                                    <div className={`absolute bg-[${selectedPrice?.bg}] bg-opacity-15 left-0 rounded-full overflow-hidden p-2 `}>
                                        <img src={selectedPrice.iconSrc} className="w-4 h-4" />
                                       
                                    </div>

                                    <span className="pl-3 text-sm font-medium">{selectedPrice.Label}</span>
                                    <img src="/images/dropdown.svg" alt="Dropdown Icon" className=" absolute right-0" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {TodayPrices.map((price) => (
                                    <DropdownMenuItem key={price.value} className=" hover:var(--bg-defaulttop-background)">
                                        <div className="flex items-center gap-2" >
                                            <img src={price.iconSrc} alt={price.Label} className="w-4 h-4" />
                                            <span>{price.Label}</span>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Right side - Navigation menu */}
                <div className="hidden lg:flex items-center gap-2 ">
                    {navItems.map((item) => (
                        <Button
                            key={item} variant="ghost"
                            className="text-defaultwhite hover:bg-defaulttop-background hover:text-defaultwhite px-4 py-2 text-sm font-normal h-auto"
                        >
                            {item}
                        </Button>
                    ))}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden lg:hidden hidden ">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-defaultwhite hover:bg-defaulttop-background p-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-defaulttop-background border-defaultgrey w-48">
                            {navItems.map((item) => (
                                <DropdownMenuItem key={item} className="text-defaultwhite hover:bg-defaulttop-background">
                                    {item}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    )
}
