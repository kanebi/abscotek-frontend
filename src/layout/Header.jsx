import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search, Heart } from "lucide-react";
import React from "react";
import useStore from "@/store/useStore";
import WalletConnectButton from "@/components/widgets/WalletConnectButton";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { PRODUCT_CATEGORIES } from "@/config/categories"
import SliderCart from "@/components/ui/SliderCart";
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '@/config/routes';
import AvatarBlock from "@/components/ui/avatar";
import UserPopover from "@/components/ui/UserPopover";
import ReferModal from '@/components/ui/ReferModal';
import ComingSoonModal from '@/components/modals/ComingSoonModal';
import {DROPDOWN_MENU_CONTENT_STYLE} from "@/components/constants";
import MobileSearchModal from "@/components/widgets/MobileSearchModal";


export default function Frame() {
    const user = useStore((state) => state.currentUser);
    const isAuthenticated = useStore((state) => state.isAuthenticated);
    const userCurrency = useStore((state) => state.userCurrency);
    const setUserCurrency = useStore((state) => state.setUserCurrency);
    const { authenticateAndLogin } = useWeb3Auth();

    const [referModalOpen, setReferModalOpen] = React.useState(false);
    const [comingSoonOpen, setComingSoonOpen] = React.useState(false);
    const [comingSoonTitle, setComingSoonTitle] = React.useState('Coming Soon');
    const [searchOpen, setSearchOpen] = React.useState(false);
    const openComingSoon = (title) => {
      setComingSoonTitle(title);
      setComingSoonOpen(true);
    };
    const defaultTopBackground = "rgba(36, 36, 36, 1)";
    const navigate = useNavigate();

    // Use store's isAuthenticated as the source of truth
    // This ensures the UI reflects the session state from localStorage
    const showUserMenu = isAuthenticated && user;

    return (
        <header className="overflow-hidden relative w-full md:h-[156px] h-[221px] bg-neutral-900">
            {/* Desktop Header */}
            <div className="hidden md:flex w-[86%] items-center justify-between mt-3.5 mx-auto">
                <div className="inline-flex items-center gap-[52px] relative flex-[0_0_auto] mr-6">
                    <div 
                        className="inline-flex items-center gap-[10.1px] relative flex-[0_0_auto] cursor-pointer"
                        onClick={() => navigate(AppRoutes.home.path)}
                    >
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
                            <input
                            onKeyDown={(e)=>e.key==='Enter' && navigate(`${AppRoutes.search.path}?q=${encodeURIComponent(e.target.value)}`)}
                           
                            type="text" placeholder="Search" style={{ backgroundColor: 'transparent', border: 'none', height: 'inherit', width: 'inherit', outline: 'none' }} className="relative w-fit mt-[-1.00px] font-body-base-base-regular font-[number:var(--body-base-base-regular-font-weight)] text-[#858585] text-[length:var(--body-base-base-regular-font-size)] tracking-[var(--body-base-base-regular-letter-spacing)] leading-[var(--body-base-base-regular-line-height)] whitespace-nowrap [font-style:var(--body-base-base-regular-font-style)]" />
                        </div>
                    </div>
                </div>
                <div className="inline-flex items-start gap-3 relative flex-[0_0_auto] mr-4">
                    <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                        <div className="inline-flex items-center gap-1.5 md:gap-2 flex-wrap">
                            <Button
                                variant="secondary"
                                className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl overflow-hidden h-auto border-0 transition-colors hover:!bg-[rgba(36,36,36,0.8)]"
                                style={{ background: `var(--defaulttop-background, ${defaultTopBackground})` }}
                                onClick={() => setReferModalOpen(true)}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(36,36,36,0.8)'}
                                onMouseOut={e => e.currentTarget.style.background = `var(--defaulttop-background, ${defaultTopBackground})`}
                            >
                                <img className="w-4 h-4 md:w-5 md:h-5" alt="" src="/images/ion-gift-sharp.svg" />
                                <span className="text-xs md:text-sm font-medium text-white whitespace-nowrap">Refers & Earn</span>
                            </Button>
                            <style>{`
                                .repair-device-btn { background: linear-gradient(90deg, #2a2a2c 0%, #1a3a2e 25%, #2a2a2c 50%, #1a2a3a 75%, #2a2a2c 100%); background-size: 200% 100%; animation: repairGradient 4s ease-in-out infinite; color: #a0e0c0; border: none; font-weight: 500; }
                                .repair-device-btn:hover { color: #c8f0d8; box-shadow: 0 0 20px rgba(160, 224, 192, 0.15); }
                                @keyframes repairGradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
                                .giveaway-btn { background: linear-gradient(135deg, #FF5059 0%, #ff6b73 25%, #FF5059 50%, #ff3d47 75%, #FF5059 100%); background-size: 200% 200%; animation: giveawayShine 2.5s ease-in-out infinite; color: white; border: none; font-weight: 500; box-shadow: 0 0 15px rgba(255, 80, 89, 0.4); }
                                .giveaway-btn::before { content: ''; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%); animation: shimmer 2s infinite; }
                                .giveaway-btn:hover { box-shadow: 0 0 25px rgba(255, 80, 89, 0.6); }
                                @keyframes giveawayShine { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
                                @keyframes shimmer { 0% { transform: translateX(-100%); opacity: 0.5; } 100% { transform: translateX(100%); opacity: 0.5; } }
                            `}</style>
                            <button onClick={() => openComingSoon('Repair Device')} className="repair-device-btn inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl overflow-hidden h-auto relative text-xs md:text-sm">
                                <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="hidden sm:inline whitespace-nowrap">Repair Device</span>
                            </button>
                            <button onClick={() => openComingSoon('Giveaway')} className="giveaway-btn inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl overflow-hidden h-auto relative text-xs md:text-sm">
                                <svg className="w-4 h-4 md:w-5 md:h-5 relative z-10 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                                </svg>
                                <span className="hidden sm:inline relative z-10 whitespace-nowrap">Giveaway</span>
                            </button>
                        </div>
                        {/* Wishlist Icon */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(AppRoutes.wishlist.path)}
                            className="relative w-10 h-10 rounded-xl hover:bg-[rgba(36,36,36,0.8)] transition-colors"
                            style={{ background: `var(--defaulttop-background, ${defaultTopBackground})` }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(36,36,36,0.8)'}
                            onMouseOut={e => e.currentTarget.style.background = `var(--defaulttop-background, ${defaultTopBackground})`}
                        >
                            <Heart className="w-5 h-5 text-white" />
                        </Button>

                        {showUserMenu ? (
                            <UserPopover user={user}>
                                <div className="cursor-pointer">
                                    <AvatarBlock user={user} />
                                </div>
                            </UserPopover>
                        ) : (
                            <WalletConnectButton onConnect={authenticateAndLogin} />
                            )}
                        <SliderCart />

                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="flex md:hidden w-full h-[113px] bg-neutral-900 items-center justify-center relative">
                <nav className="flex w-full  justify-between items-center relative px-[15px]">
                    <div 
                        className="inline-flex gap-[9.85px] flex-[0_0_auto] items-center relative cursor-pointer"
                        onClick={() => navigate(AppRoutes.home.path)}
                    >
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
                    <div className="inline-flex gap-1.5 md:gap-2 flex-[0_0_auto] items-center relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="flex flex-col w-10 h-10 items-center justify-center gap-[11.11px] px-[13.33px] py-[11.11px] bg-defaulttop-background rounded-[13.33px] overflow-hidden transition-colors hover:!bg-[rgba(36,36,36,0.8)]"
                            style={{ background: `var(--defaulttop-background, ${defaultTopBackground})` }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(36,36,36,0.8)'}
                            onMouseOut={e => e.currentTarget.style.background = `var(--defaulttop-background, ${defaultTopBackground})`}
                            onClick={() => setSearchOpen(true)}
                        >
                            <Search className="relative w-5 h-5 text-[#858585]" />
                        </Button>
                        <button onClick={() => openComingSoon('Repair Device')} className="repair-device-btn flex w-10 h-10 items-center justify-center rounded-[13.33px] overflow-hidden flex-shrink-0" title="Repair Device">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                        <button onClick={() => openComingSoon('Giveaway')} className="giveaway-btn flex w-10 h-10 items-center justify-center rounded-[13.33px] overflow-hidden flex-shrink-0" title="Giveaway">
                            <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                            </svg>
                        </button>
                        {showUserMenu ? (
                            <UserPopover user={user}>
                                <div className="cursor-pointer">
                                    <AvatarBlock user={user} />
                                </div>
                            </UserPopover>
                        ) : (
                            <WalletConnectButton onConnect={authenticateAndLogin} />
                        )}

                        {/* Wishlist Icon - Mobile */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(AppRoutes.wishlist.path)}
                            className="flex flex-col w-10 h-10 items-center justify-center gap-[11.11px] px-[13.33px] py-[11.11px] bg-defaulttop-background rounded-[13.33px] overflow-hidden transition-colors hover:!bg-[rgba(36,36,36,0.8)]"
                            style={{ background: `var(--defaulttop-background, ${defaultTopBackground})` }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(36,36,36,0.8)'}
                            onMouseOut={e => e.currentTarget.style.background = `var(--defaulttop-background, ${defaultTopBackground})`}
                        >
                            <Heart className="relative w-5 h-5 text-white" />
                        </Button>


                        <SliderCart />
                        {/* Menu button - currently disabled */}
                        {/* <Button
                            variant="ghost"
                            size="icon"
                            disabled
                            className="relative w-10 h-10 items-center justify-center gap-[11.11px] px-[13.33px] py-[11.11px] bg-defaulttop-background rounded-[13.33px] overflow-hidden opacity-50 cursor-not-allowed"
                            style={{ background: `var(--defaulttop-background, ${defaultTopBackground})` }}
                        >
                            <img
                                className="text-white absolute top-0 left-0 right-0 bottom-0 m-auto"
                                alt="Menu"
                                src="/images/hugeicons_menu-09.svg"
                            />
                        </Button> */}
                    </div>
                </nav>
                {/* Mobile Search Modal */}
                <MobileSearchModal open={searchOpen} onOpenChange={setSearchOpen} />
            </div>
            <Separator className=" sm:block   w-full h-px mt-[15px] left-0 bg-white/10" />
            {/* Navigation Bar */}
            <div className=" md:w-[86%] w-full py-2 px-[17px] md:px-0 md:mx-auto">
                <NavigationBar />

            </div>
            <ReferModal open={referModalOpen} onClose={() => setReferModalOpen(false)} />
            <ComingSoonModal open={comingSoonOpen} onOpenChange={setComingSoonOpen} title={comingSoonTitle} />
        </header>
    );
}


export function NavigationBar() {
    const navigate = useNavigate();
    const [showCategoriesCard, setShowCategoriesCard] = React.useState(false);
    const categoriesCardRef = React.useRef(null);

    // Close categories card when clicking outside (backdrop handles this now)
    // Main navigation items (visible in header)
    const mainNavItems = ["Laptops", "Phone", "Smartwatches", "Tablets", "Audio", "Headphones", "TVs & Monitors"];
    
    // Get all other categories for "More" dropdown (exclude main nav items)
    const moreCategories = PRODUCT_CATEGORIES.filter(cat => {
        // Map main nav items to match category names
        const categoryMap = {
            "Laptops": ["Laptops"],
            "Phone": ["Smartphones"],
            "Smartwatches": ["Smart Watches"],
            "Tablets": ["Tablets"],
            "Audio": ["Speakers", "Audio Equipment"],
            "Headphones": ["Headphones & Earbuds"],
            "TVs & Monitors": ["TVs & Monitors"]
        };
        
        // Check if category is in any of the main nav items
        const isInMainNav = Object.values(categoryMap).some(mainCats => 
            mainCats.some(mainCat => mainCat.toLowerCase() === cat.toLowerCase())
        );
        
        return !isInMainNav;
    });
    
    const userCurrency = useStore((state) => state.userCurrency);
    const setUserCurrency = useStore((state) => state.setUserCurrency);
    const CurrencyOptions = [
        { label: "USDC", value: "USDC" },
        { label: "NGN", value: "NGN" },
        { label: "USD", value: "USD" },
        { label: "GHC", value: "GHC" }
    ];
    const currencyIconMap = {
        NGN: { src: "/images/ngn-icon.svg" },
        USD: { src: "/images/usd-icon.svg" },
        GHC: { src: "/images/ghc-icon.svg" },
        USDC: { src: "/images/usdc-icon.svg" },
    };

    // Map navigation item names to actual category names
    const navToCategoryMap = {
        "Laptops": "Laptops",
        "Phone": "Smartphones",
        "Smartwatches": "Smart Watches",
        "Tablets": "Tablets",
        "Audio": "Speakers",
        "Headphones": "Headphones & Earbuds",
        "TVs & Monitors": "TVs & Monitors"
    };

    const handleNavigation = (category) => {
        // Use mapped category if it exists, otherwise use the category as-is
        const actualCategory = navToCategoryMap[category] || category;
        navigate(`${AppRoutes.productList.path}?category=${encodeURIComponent(actualCategory)}`);
    };

    let bg = '#00A478'
    return (
        <nav className="text-defaultwhite">
            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center justify-between max-w-full py-2">
                {/* Left side - Price indicator */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-defaultgrey whitespace-nowrap">Today Price:</span>
                    <div className="flex items-center gap-2">
                        <DropdownMenu modal >
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={`text-defaultwhite w-36 relative hover:text-defaultwhite hover:bg-defaulttop-background h-auto font-normal outline-none border-none hover:outline-none flex items-center gap-1 `}
                                >
                                    <div className="flex items-center gap-2 pl-2">
                                        <img src={currencyIconMap[userCurrency || 'USDC']?.src} className="w-4 h-4" />
                                        <span className="text-sm font-medium">{userCurrency || 'USDC'}</span>
                                    </div>
                                    <img src="/images/dropdown.svg" alt="Dropdown Icon" className=" absolute right-0" />
                                </Button>
                            </DropdownMenuTrigger >
                            <DropdownMenuContent   style={DROPDOWN_MENU_CONTENT_STYLE} className="text-sm text-white border-neutral-600" align="start">
                                {CurrencyOptions.map((c) => (
                                    <DropdownMenuItem key={c.value} onClick={() => setUserCurrency(c.value)}>
                                        <div className="flex items-center gap-2" >
                                            <img src={currencyIconMap[c.value]?.src} className="w-4 h-4" />
                                            <span>{c.label}</span>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Right side - Navigation menu */}
                <div className="flex items-center gap-2">
                    {mainNavItems.map((item) => (
                        <Button
                            key={item} variant="ghost"
                            onClick={() => handleNavigation(item)}
                            className="text-defaultwhite hover:bg-defaulttop-background hover:text-defaultwhite px-4 py-2 text-sm font-normal h-auto cursor-pointer"
                        >
                            {item}
                        </Button>
                    ))}

                    {/* More button - Desktop - Shows categories card */}
                    {moreCategories.length > 0 && (
                        <div className="relative">
                            <Button
                                variant="ghost"
                                onClick={() => setShowCategoriesCard(!showCategoriesCard)}
                                className="text-defaultwhite hover:bg-defaulttop-background hover:text-defaultwhite px-4 py-2 text-sm font-normal h-auto cursor-pointer"
                            >
                                More
                                <img src="/images/dropdown.svg" alt="Dropdown" className="ml-1 w-3 h-3" />
                            </Button>
                            {showCategoriesCard && (
                                <>
                                    {/* Backdrop with blur */}
                                    <div 
                                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
                                        onClick={() => setShowCategoriesCard(false)}
                                    />
                                    {/* Categories Card */}
                                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                                        <div 
                                            className="bg-[#1F1F21] rounded-lg border border-neutral-700 p-6 shadow-xl min-w-[400px] max-w-[600px] max-h-[80vh] overflow-y-auto pointer-events-auto"
                                            onClick={(e) => e.stopPropagation()}
                                            ref={categoriesCardRef}
                                        >
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {mainNavItems.map((item) => (
                                                    <Button
                                                        key={item} 
                                                        variant="outline"
                                                        onClick={() => {
                                                            handleNavigation(item);
                                                            setShowCategoriesCard(false);
                                                        }}
                                                        className="text-xs px-3 py-1.5 h-auto border-neutral-600 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-500"
                                                    >
                                                        {item}
                                                    </Button>
                                                ))}
                                            </div>
                                            <div className="border-t border-neutral-700 my-4"></div>
                                            <h4 className="text-white text-sm font-semibold mb-3">More Categories</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {moreCategories.map((category) => (
                                                    <Button
                                                        key={category}
                                                        variant="outline"
                                                        onClick={() => {
                                                            handleNavigation(category);
                                                            setShowCategoriesCard(false);
                                                        }}
                                                        className="text-xs px-3 py-1.5 h-auto border-neutral-600 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-500"
                                                    >
                                                        {category}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="flex lg:hidden flex-col gap-2  pb-10">
                {/* Top row - Categories */}
                <div className="w-full relative">
                    <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <style>{`
                            .mobile-nav-categories::-webkit-scrollbar {
                                display: none;
                            }
                            .mobile-nav-categories {
                                -ms-overflow-style: none;
                                scrollbar-width: none;
                            }
                        `}</style>
                        <div className="flex items-center gap-2 mobile-nav-categories">
                            {mainNavItems.map((item) => (
                                <Button
                                    key={item} 
                                    variant="ghost"
                                    onClick={() => handleNavigation(item)}
                                    className="text-defaultwhite hover:bg-defaulttop-background hover:text-defaultwhite px-3 py-1.5 text-xs font-normal h-auto cursor-pointer whitespace-nowrap flex-shrink-0 max-w-[120px] truncate"
                                    title={item}
                                >
                                    {item}
                                </Button>
                            ))}
                            
                            {/* More button for mobile - Shows categories card */}
                            {moreCategories.length > 0 && (
                                <div className="flex-shrink-0 sticky right-0 bg-neutral-900 pl-2 -mr-2">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowCategoriesCard(!showCategoriesCard)}
                                        className="text-defaultwhite hover:bg-defaulttop-background hover:text-defaultwhite px-3 py-1.5 text-xs font-normal h-auto cursor-pointer whitespace-nowrap flex-shrink-0"
                                    >
                                        More
                                        <img src="/images/dropdown.svg" alt="Dropdown" className="ml-1 w-3 h-3" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Categories Card - Mobile */}
                    {showCategoriesCard && (
                        <>
                            {/* Backdrop with blur */}
                            <div 
                                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
                                onClick={() => setShowCategoriesCard(false)}
                            />
                            {/* Categories Card */}
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                                <div 
                                    className="bg-[#1F1F21] rounded-lg border border-neutral-700 p-6 shadow-xl w-full max-w-[90vw] max-h-[80vh] overflow-y-auto pointer-events-auto"
                                    onClick={(e) => e.stopPropagation()}
                                    ref={categoriesCardRef}
                                >
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {mainNavItems.map((item) => (
                                            <Button
                                                key={item} 
                                                variant="outline"
                                                onClick={() => {
                                                    handleNavigation(item);
                                                    setShowCategoriesCard(false);
                                                }}
                                                className="text-xs px-3 py-1.5 h-auto border-neutral-600 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-500"
                                            >
                                                {item}
                                            </Button>
                                        ))}
                                    </div>
                                    <div className="border-t border-neutral-700 my-4"></div>
                                    <h4 className="text-white text-sm font-semibold mb-3">More Categories</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {moreCategories.map((category) => (
                                            <Button
                                                key={category}
                                                variant="outline"
                                                onClick={() => {
                                                    handleNavigation(category);
                                                    setShowCategoriesCard(false);
                                                }}
                                                className="text-xs px-3 py-1.5 h-auto border-neutral-600 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-500"
                                            >
                                                {category}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Bottom row - Currency selector */}
                <div className="flex items-center justify-between w-full px-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-defaultgrey whitespace-nowrap">Today Price:</span>
                        <DropdownMenu modal >
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={`text-defaultwhite w-28 relative hover:text-defaultwhite hover:bg-defaulttop-background h-auto font-normal outline-none border-none hover:outline-none flex items-center gap-1 text-xs`}
                                >
                                    <div className="flex items-center gap-1.5 pl-1">
                                        <img src={currencyIconMap[userCurrency || 'USDC']?.src} className="w-3 h-3" />
                                        <span className="text-xs font-medium">{userCurrency || 'USDC'}</span>
                                    </div>
                                    <img src="/images/dropdown.svg" alt="Dropdown Icon" className="absolute right-0 w-2 h-2" />
                                </Button>
                            </DropdownMenuTrigger >
                            <DropdownMenuContent   style={DROPDOWN_MENU_CONTENT_STYLE} className="text-sm text-white border-neutral-600" align="start">
                                {CurrencyOptions.map((c) => (
                                    <DropdownMenuItem key={c.value} onClick={() => setUserCurrency(c.value)}>
                                        <div className="flex items-center gap-2" >
                                            <img src={currencyIconMap[c.value]?.src} className="w-4 h-4" />
                                            <span>{c.label}</span>
                                        </div>
                                    </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    )
}
