import * as React from "react";
import { Card } from "./card";

import { motion, AnimatePresence } from "framer-motion";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

function MobileCarousel({ images = [], alt = "" }) {
    const [current, setCurrent] = React.useState(0);
    const [focused, setFocused] = React.useState(false);
    const total = images.length;
    const swiperRef = React.useRef(null);

    const prev = () => {
        if (swiperRef.current) {
            swiperRef.current.slideTo((current - 1 + total) % total);
        }
    };
    const next = () => {
        if (swiperRef.current) {
            swiperRef.current.slideTo((current + 1) % total);
        }
    };
    const goTo = (idx) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(idx);
        }
    };

    if (!images.length) return null;

    return (
        <div className="flex flex-col gap-3 block md:hidden">
            <div className="w-full h-[357px] bg-white rounded-xl overflow-hidden relative">
                <div
                    className="relative w-full h-full flex items-center justify-center select-none"
                    tabIndex={0}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onMouseEnter={() => setFocused(true)}
                    onMouseLeave={() => setFocused(false)}
                >
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={0}
                        slidesPerView={1}
                        onSlideChange={(swiper) => setCurrent(swiper.activeIndex)}
                        initialSlide={current}
                        pagination={{ clickable: true }}
                        className="w-full h-full rounded-xl"
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                    >
                        {images.map((img, idx) => (
                            <SwiperSlide key={idx}>
                                <img
                                    src={img}
                                    alt={alt + ' slide ' + (idx + 1)}
                                    className="w-full h-full object-cover object-center rounded-xl absolute left-0 top-0"
                                    draggable={false}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {total > 1 && focused && (
                        <>
                            <button
                                onClick={prev}
                                className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center z-10"
                                aria-label="Previous"
                            >
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={next}
                                className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center z-10"
                                aria-label="Next"
                            >
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </>
                    )}
                    {/* {total > 1 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    className={`w-1.5 h-1.5 rounded-full ${i === current ? "bg-white" : "bg-white/40"}`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    )} */}
                </div>
            </div>
            <div className="flex gap-2 py-2 w-full align-content-center justify-items-center justify-center overflow-x-auto px-3  overflow-hidden">
                {images.map((img, idx) => (
                    <Card key={idx} className={`w-32 h-20 min-w-[80px] bg-white rounded-lg overflow-hidden relative ${idx === current ? 'ring-2 ring-primary' : ''}`}>
                        <img onClick={() => goTo(idx)} className="absolute left-0 top-0 w-full h-full object-cover object-center cursor-pointer" src={img} alt={alt + ' thumb ' + (idx + 1)} />
                    </Card>
                ))}
            </div>
        </div>
    );
}

function DesktopCarousel({ images = [], alt = "" }) {
    const [current, setCurrent] = React.useState(0);
    const [focused, setFocused] = React.useState(false);
    const total = images.length;
    const swiperRef = React.useRef(null);

    const prev = () => {
        if (swiperRef.current) {
            swiperRef.current.slideTo((current - 1 + total) % total);
        }
    };
    const next = () => {
        if (swiperRef.current) {
            swiperRef.current.slideTo((current + 1) % total);
        }
    };
    const goTo = (idx) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(idx);
        }
    };

    if (!images.length) return null;

    return (
        <div className="flex flex-col gap-5 hidden md:flex">
            <div className="w-[541px] h-[466px] bg-white rounded-3xl overflow-hidden relative">
                <div
                    className="relative w-full h-full flex items-center justify-center select-none"
                    tabIndex={0}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onMouseEnter={() => setFocused(true)}
                    onMouseLeave={() => setFocused(false)}
                >
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={0}
                        slidesPerView={1}
                        onSlideChange={(swiper) => setCurrent(swiper.activeIndex)}
                        initialSlide={current}
                        pagination={{ clickable: true }}
                        className="w-full h-full rounded-3xl"
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                    >
                        {images.map((img, idx) => (
                            <SwiperSlide key={idx}>
                                <img
                                    src={img}
                                    alt={alt + ' slide ' + (idx + 1)}
                                    className="w-full h-full object-cover object-center rounded-3xl absolute left-0 top-0"
                                    draggable={false}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {total > 1 && focused && (
                        <>
                            <button
                                onClick={prev}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center z-10"
                                aria-label="Previous"
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={next}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center z-10"
                                aria-label="Next"
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="flex gap-3 justify-center overflow-hidden overflow-x-auto scrollbar-thin ">
                {images.map((img, idx) => (
                    <Card key={idx} className={`w-24 h-24 bg-white rounded-lg overflow-hidden relative ${idx === current ? 'ring-2 ring-primary' : ''}`}>
                        <img onClick={() => goTo(idx)} className="absolute left-0 top-0 w-full h-full object-cover object-center cursor-pointer" src={img} alt={alt + ' thumb ' + (idx + 1)} />
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default function Carousel({ images = [], alt = "" }) {
    return (
        <>
            <MobileCarousel images={images} alt={alt} />
            <DesktopCarousel images={images} alt={alt} />
        </>
    );
}

