import React from "react";
import Breadcrumb from "../../components/ui/_Breadcrumb";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import AmountCurrency from "../../components/ui/AmountCurrency";
import Layout from "../../components/Layout";
import { Minus, Plus } from "lucide-react";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "../../components/ui/select";
import Carousel from "../../components/ui/Carousel";
import ProductList from "../../components/ProductList";
import SEO from "../../components/SEO";
import { getPageSEO, generateProductStructuredData, generateBreadcrumbStructuredData } from "../../config/seo";

export default function ProductDetail({ product }) {
    // Example product fallback
    const p = product || {
        name: "New Apple iPhone 16 Plus ESIM 128GB",
        price: 450.36,
        currency: "USDT",
        badge: "ESim",
        outOfStock: true,
        images: [
            "https://placehold.co/915x515",
            "https://placehold.co/185x104",
            "https://placehold.co/185x104",
            "https://placehold.co/185x104",
            "https://placehold.co/185x104"
        ],
        description: "Apple iPhone 15 Pro Specifications",
        specs: [
            { label: "SIM:", value: "Dual-SIM and eSIM" },
            { label: "NETWORK:", value: "GSM / CDMA / HSPA / EVDO / LTE / 5G" },
            { label: "OPERATING SYSTEM:", value: "iOS 17" },
            { label: "CHIP SET:", value: "Apple A17 Pro (3 nm)" },
            { label: "CPU:", value: "Hexa-core (2x3.78 GHz + 4x2.11 GHz)" },
            { label: "MEMORY:", value: "8GB, 512GB" },
            { label: "DISPLAY:", value: "6.1 inches, 91.3 cm2 (~88.2% screen-to-body ratio) 1179 x 2556 pixels, 19.5:9 ratio (~461 ppi density)" }
        ]
    };

    // SEO configuration for product page
    const breadcrumbs = [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: p.name, path: `/product/${p.id || 'current'}` }
    ];

    const seoData = getPageSEO('products', {
        title: `${p.name} - Abscotek`,
        description: `${p.name} available at Abscotek. ${p.description || 'Premium tech product with latest features.'} Price: ${p.price} ${p.currency}.`,
        keywords: `${p.name}, tech product, electronics, smartphone, laptop, ${p.currency} payment`,
        path: `/product/${p.id || 'current'}`,
        image: p.images?.[0] || '/android-chrome-512x512.png'
    });

    // Responsive layout: mobile and desktop
    return (
        <Layout>
            <SEO 
                {...seoData}
                structuredData={[
                    generateProductStructuredData(p),
                    generateBreadcrumbStructuredData(breadcrumbs)
                ]}
            />
            <div className="md:w-[86%] w-[94%]  mx-auto flex flex-col gap-10 py-8">
                <Breadcrumb items={[
                    { label: "Home", to: "/" },
                    { label: "Products", to: "/products" },
                    { label: p.name }
                ]} />
                {/* Mobile layout */}
                <div className="flex flex-col lg:hidden self-stretch gap-10">
                    <div className="flex flex-col gap-2 w-full">
                        {/* Responsive Carousel for mobile */}
                        <div className="w-full h-auto relative overflow-hidden rounded-t-xl">
                            <Carousel images={p.images} alt={p.name} />
                        </div>
                       
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                        <div className="self-stretch flex flex-col justify-center items-start gap-6">
                            <div className="self-stretch flex flex-col gap-4">
                                <div className="self-stretch flex flex-col gap-2">
                                    <div className="text-gray-200 text-2xl font-medium font-sans leading-loose">{p.name}</div>
                                    <div className="text-white text-xl font-semibold font-sans leading-relaxed"><AmountCurrency amount={p.price} fromCurrency={p.currency} /></div>
                                </div>
                                <div className="flex flex-col gap-6">
                                    {/* Color selector as shadcn/ui select */}
                                    <div className="w-full max-w-xs rounded-lg flex flex-col gap-2">
                                        <div className="text-gray-200 text-base font-medium font-sans leading-normal">Color</div>
                                        <Select>
                                            <SelectTrigger className="w-full px-3.5 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-700 flex items-center gap-2 border-none text-base font-sans">
                                                <SelectValue defaultValue={'Grey'} placeholder="Select Color" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-lg mt-1">
                                                <SelectItem value="Grey" className="text-gray-400 text-base font-normal px-4 py-2 cursor-pointer">Grey</SelectItem>
                                                <SelectItem value="Black" className="text-gray-400 text-base font-normal px-4 py-2 cursor-pointer">Black</SelectItem>
                                                <SelectItem value="Blue" className="text-gray-400 text-base font-normal px-4 py-2 cursor-pointer">Blue</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {/* Quantity selector */}
                                    <div className="w-36 flex flex-col gap-2">
                                        <div className="text-white text-sm font-medium font-sans leading-tight">Quantity</div>
                                        <div className="p-3 outline outline-1 outline-gray-200 flex flex-col items-center rounded-lg">
                                            <div className="flex items-end gap-9">
                                                <button className="w-6 h-6 flex items-center justify-center"><Minus color="#f1f1f1" /></button>
                                                <span className="text-white text-base font-medium font-sans">1</span>
                                                <button className="w-6 h-6 flex items-center justify-center"><Plus color="#f1f1f1" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                          
                            {p && p.badge && !p.outOfStock && (
                                    <div className="w-40 h-10 bg-rose-500 rounded-lg inline-flex items-center justify-center">
                                        <span className="text-white text-sm font-normal leading-tight">{p.badge}</span>
                                    </div>
                                )}
                                {p && p.outOfStock ? (<div className="inline-flex flex-col justify-start items-start gap-4">
                                    <div className="justify-start text-white text-base font-semibold font-['Mona_Sans'] leading-normal">Out of stock</div>
                                    <div className="w-full px-7 py-3 bg-rose-500 rounded-xl inline-flex justify-center items-center gap-2.5">
                                        <div className="justify-start text-white text-sm font-medium font-['Mona_Sans'] leading-tight">Add Reminder</div>
                                    </div>
                                </div>) :
                            <Button className="w-full max-w-xs px-7 py-4 bg-rose-500 rounded-xl flex justify-center items-center gap-2.5 text-white text-sm font-medium font-sans leading-tight">Add To Cart</Button>
                        }
                        
                        </div>
                        <div className="self-stretch flex flex-col gap-3">
                            <div className="text-gray-200 text-xl font-semibold font-sans leading-normal">Shipping policy</div>
                            <div className="text-gray-200 text-sm font-normal font-sans leading-tight">We ship all over Nigeria at a very Affordable Rate.<br/>Same day delivery on Lagos order placed before 12pm , Next day delivery for items placed after 12:00pm.....<br/>Next day delivery for Ogun, Oyo, Ekiti, Kwara and Benin orders.....<br/>2-3 days delivery to Every other part of Nigeria.</div>
                        </div>
                    </div>
                    {/* You may also like - use ProductList widget */}
                    <div className="w-full">
                        <ProductList width={'w-full'} title="You may also like" products={Array(4).fill({
                            image: p.images[0],
                            name: p.name,
                            price: p.price,
                            currency: p.currency
                        })} />
                    </div>
                </div>
                {/* Desktop layout (unchanged) */}
                <div className="hidden lg:flex flex-col gap-20 ">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-28">
                        {/* Images */}
                        <Carousel images={p.images} alt={p.name} />

                        {/* Details */}
                        <div className="w-[491px] flex flex-col gap-6">
                            <div className="flex flex-col gap-8">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-4">
                                        <h1 className="text-white text-[32px] font-semibold    leading-10">{p.name}</h1>
                                        <div className="text-white text-[28px] font-semibold    leading-[44px]">
                                            <AmountCurrency amount={p.price} fromCurrency={p.currency} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-6">
                                        {/* Color selector as shadcn/ui dropdown */}
                                        <div className="w-64 rounded-lg flex flex-col gap-2">
                                            <div className="text-gray-200 text-base font-medium   ">Color</div>
                                            <Select>
                                                <SelectTrigger className="self-stretch px-3.5 py-5 rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-700 inline-flex flex-col justify-start items-start gap-2.5 border-none">
                                                    <SelectValue defaultValue={'Grey'} placeholder="Select Color" />
                                                </SelectTrigger>
                                                <SelectContent className=" rounded-lg mt-1 ">
                                                    <SelectItem value="Grey" className="text-gray-400 text-base font-normal    px-4 py-2 cursor-pointer">Grey</SelectItem>
                                                    <SelectItem value="Black" className="text-gray-400 text-base font-normal    px-4 py-2 cursor-pointer">Black</SelectItem>
                                                    <SelectItem value="Blue" className="text-gray-400 text-base font-normal    px-4 py-2 cursor-pointer">Blue</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {/* Quantity selector (static for now) */}
                                        <div className="w-36 flex flex-col gap-2">
                                            <div className="text-white text-sm font-medium   ">Quantity</div>
                                            <div className="p-3 outline outline-1 outline-gray-300 flex flex-col items-center rounded-lg">
                                                <div className="flex items-end gap-9">
                                                    <button className="w-6 h-6 flex items-center justify-center"><Minus color="#f1f1f1" /></button>
                                                    <span className="text-white text-base font-medium   ">1</span>
                                                    <button className="w-6 h-6 flex items-center justify-center"><Plus color="#f1f1f1" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {p && p.badge && !p.outOfStock && (
                                    <div className="w-40 h-10 bg-rose-500 rounded-lg inline-flex items-center justify-center">
                                        <span className="text-white text-sm font-normal leading-tight">{p.badge}</span>
                                    </div>
                                )}
                                {p && p.outOfStock ? (<div className="inline-flex flex-col justify-start items-start gap-4">
                                    <div className="justify-start text-white text-base font-semibold font-['Mona_Sans'] leading-normal">Out of stock</div>
                                    <div className="w-96 px-7 py-3 bg-rose-500 rounded-xl inline-flex justify-center items-center gap-2.5">
                                        <div className="justify-start text-white text-sm font-medium font-['Mona_Sans'] leading-tight">Add Reminder</div>
                                    </div>
                                </div>) :
                                    <Button className="w-[400px] h-12 bg-rose-500 rounded-xl text-white text-base font-medium   ">Add To Cart</Button>
                                }
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="text-gray-200 text-xl font-semibold   ">Shipping policy</div>
                                <div className="text-gray-300 text-sm font-normal    leading-snug">We ship all over Nigeria at a very Affordable Rate.<br />Same day delivery on Lagos order placed before 12pm , Next day delivery for items placed after 12:00pm.....<br />Next day delivery for Ogun, Oyo, Ekiti, Kwara and Benin orders.....<br />2-3 days delivery to Every other part of Nigeria.</div>
                            </div>
                        </div>
                    </div>
                    {/* Description & Specs */}
                    <div className="flex flex-col gap-12">
                        <div className="flex items-center gap-8">
                            <div className="text-rose-500 text-xl font-semibold    leading-relaxed">Description</div>
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="text-white text-2xl font-semibold    leading-loose">{p.description}</div>
                            <div className="flex flex-col gap-6">
                                {p.specs.map((spec, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <div className="w-28 text-white text-base font-medium   ">{spec.label}</div>
                                        <div className="flex-1 text-white text-base font-normal   ">{spec.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* You may also like */}
                    <ProductList width={'full'} title="You may also like" products={Array(4).fill({
                        image: p.images[0],
                        name: p.name,
                        price: p.price,
                        currency: p.currency
                    })} />
                </div>
            </div>
        </Layout>
    );
}
