import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Breadcrumb from "../../components/ui/CustomBreadCrumb";
import { Button } from "../../components/ui/button";
import AmountCurrency from "../../components/ui/AmountCurrency";
import Layout from "../../components/Layout";
import { Minus, Plus, Loader2 } from "lucide-react";
import Carousel from "../../components/ui/Carousel";
import ProductList from "../../components/ProductList";
import SEO from "../../components/SEO";
import { getPageSEO, generateProductStructuredData, generateBreadcrumbStructuredData } from "../../config/seo";
import productService from "../../services/productService";
import useStore from "../../store/useStore";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedSpec, setSelectedSpec] = useState(null); // Single selected spec index
    const [addingToWishlist, setAddingToWishlist] = useState(false);
    const [totalPrice, setTotalPrice] = useState(null);

    const { addToCart, cartUpdating, addToWishlist: addToWishlistStore, isAuthenticated } = useStore();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await productService.getProduct(id);
                setProduct(data);
                setTotalPrice(data.price);
                if (data.variants && data.variants.length > 0) {
                    setSelectedVariant(data.variants[0]);
                    setTotalPrice(data.variants[0].price || data.price);
                }
                // Fetch related products in parallel
                try {
                    const related = await productService.getRelatedProducts(id, 8);
                    setRelatedProducts(Array.isArray(related) ? related : []);
                } catch (e) {
                    console.warn('Failed to fetch related products', e);
                    setRelatedProducts([]);
                }
            } catch (err) {
                setError(err);
                console.error("Failed to fetch product:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
            if (selectedVariant) {
            // Use variant price if available, otherwise use product price
            const variantPrice = selectedVariant.price || product?.price || 0;
            setTotalPrice(variantPrice);
            // When variant is selected, clear spec selection
            setSelectedSpec(null);
        } else if (product) {
            setTotalPrice(product.price || 0);
        }
    }, [selectedVariant, product]);

    // When variant is selected, clear spec
    useEffect(() => {
        if (selectedVariant && selectedSpec !== null) {
            setSelectedSpec(null);
        }
    }, [selectedVariant]);

    const handleQuantityChange = (amount) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };

    const handleAddToCart = () => {
        if (product) {
            const variantName = selectedVariant?.name || null;
            // Only include spec if no variant is selected (variants disable specs)
            const specs = !selectedVariant && selectedSpec !== null && product.specs
                ? [product.specs[selectedSpec]].filter(Boolean)
                : null;
            addToCart(product._id, quantity, product.currency, variantName, specs);
        }
    };

    const selectSpec = (index) => {
        // If selecting a spec, clear variant
        if (selectedVariant) {
            setSelectedVariant(null);
        }
        setSelectedSpec(prev => prev === index ? null : index);
    };

    // Helper to check if a spec value is a color
    const isColorSpec = (label, value) => {
        const colorLabels = ['color', 'colour', 'couleur'];
        return colorLabels.some(cl => label.toLowerCase().includes(cl));
    };

    // Helper to check if a spec value is a size
    const isSizeSpec = (label, value) => {
        const sizeLabels = ['size', 'taille', 'dimension'];
        return sizeLabels.some(sl => label.toLowerCase().includes(sl));
    };

    // Helper to get color value from attributes
    const getColorValue = (colorName) => {
        const colorMap = {
            'Red': '#EF4444',
            'Blue': '#3B82F6',
            'Green': '#10B981',
            'Yellow': '#F59E0B',
            'Purple': '#8B5CF6',
            'Pink': '#EC4899',
            'Black': '#000000',
            'White': '#FFFFFF',
            'Gray': '#6B7280',
            'Orange': '#F97316',
        };
        return colorMap[colorName] || '#6B7280';
    };

    // Helper to get attribute value by name
    const getAttributeValue = (variant, attrName) => {
        if (!variant?.attributes) return null;
        const attr = variant.attributes.find(a => a.name === attrName);
        return attr?.value || null;
    };

    const handleAddToWishlist = async () => {
        if (!product) return;
        
        // Check if user is authenticated
        if (!isAuthenticated) {
            alert('Please login to add items to your wishlist');
            return;
        }
        
        setAddingToWishlist(true);
        try {
            // Use store's addToWishlist which handles the API call
            await addToWishlistStore(product._id);
            // Show success state for 2 seconds
            setTimeout(() => {
                setAddingToWishlist(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to add to wishlist:", error);
            setAddingToWishlist(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                        <p className="text-white">Loading product...</p>
                    </div>
                </div>
            </Layout>
        );
    }
    if (error) return <Layout><div className="text-center text-red-500 py-8">Error: {error.message}</div></Layout>;
    if (!product) return <Layout><div className="text-center text-white py-8">Product not found.</div></Layout>;

    // Use fetched product data
    const p = product;

    // SEO configuration for product page
    const breadcrumbs = [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: p.name, path: `/product/${p._id}` }
    ];

    const seoData = getPageSEO('products', {
        title: `${p.name} - Abscotek`,
        description: `${p.name} available at Abscotek. ${p.description || 'Premium tech product with latest features.'} Price: ${p.price} ${p.currency}.`,
        keywords: `${p.name}, tech product, electronics, smartphone, laptop, ${p.currency} payment`,
        path: `/product/${p._id}`,
        image: p.images?.[0] || '/android-chrome-512x512.png'
    });

    // Helper: map products to ProductList expected props
    const mapToListItems = (items) => (items || []).map(item => ({
        image: item.images?.[0] || item.image,
        name: item.name,
        price: item.price,
        currency: item.currency || 'USDT',
        description: item.description,
        _id: item._id
    }));

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
                            {/* Badge overlay on image */}
                            {p && p.badge && !p.outOfStock && (
                                <div className="absolute top-3 left-3 bg-rose-500 px-2 py-1 rounded-md shadow-lg z-10">
                                    <span className="text-white text-xs font-medium">{p.badge}</span>
                                </div>
                            )}
                        </div>
                       
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                        <div className="self-stretch flex flex-col justify-center items-start gap-6">
                            <div className="self-stretch flex flex-col gap-4">
                                <div className="text-gray-200 text-2xl font-medium font-sans leading-loose">{p.name}</div>
                                <div className="text-white text-xl font-semibold font-sans leading-relaxed">
                                    <AmountCurrency amount={totalPrice || p.price || 0} fromCurrency={p.currency || 'USDT'} />
                                </div>
                                {p.description && (
                                    <div className="text-gray-300 text-sm font-normal font-sans leading-relaxed whitespace-pre-wrap">
                                        {p.description}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-6">
                                {/* Variant Selector */}
                                {p.variants && p.variants.length > 0 && (
                                    <div className="w-full flex flex-col gap-4">
                                        <div className="text-gray-200 text-base font-medium font-sans leading-normal">Select Variant</div>
                                        
                                        {/* All Variants in a single list */}
                                        <div className="space-y-2">
                                            {p.variants.map((variant) => {
                                                const isSelected = selectedVariant?._id === variant._id || selectedVariant?.name === variant.name;
                                                const inStock = (variant.stock || 0) > 0;
                                                return (
                                                    <button
                                                        key={variant.name || variant._id}
                                                        onClick={() => {
                                                            if (!inStock) return;
                                                            // Toggle selection - if already selected, deselect
                                                            if (isSelected) {
                                                                setSelectedVariant(null);
                                                            } else {
                                                                // When selecting variant, clear spec
                                                                setSelectedSpec(null);
                                                                setSelectedVariant(variant);
                                                            }
                                                        }}
                                                        disabled={!inStock}
                                                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                                                            isSelected 
                                                                ? 'border-rose-500 bg-rose-500/10 text-rose-400' 
                                                                : inStock
                                                                ? 'border-neutral-600 text-gray-300 hover:border-neutral-400 hover:bg-neutral-800'
                                                                : 'border-neutral-700 text-neutral-500 cursor-not-allowed opacity-50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium">{variant.name}</span>
                                                            <span className="text-sm">
                                                                <AmountCurrency 
                                                                    amount={variant.price || p.price || 0} 
                                                                    fromCurrency={variant.currency || p.currency || 'USDT'} 
                                                                />
                                                            </span>
                                                        </div>
                                                        {variant.attributes && variant.attributes.length > 0 && (
                                                            <div className="text-xs text-gray-400 mt-1">
                                                                {variant.attributes.map(attr => `${attr.name}: ${attr.value}`).join(', ')}
                                                            </div>
                                                        )}
                                                        {!inStock && <span className="text-xs text-red-400 ml-2">(Out of Stock)</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Specs Selector - Only show if no variant is selected */}
                                {!selectedVariant && p.specs && p.specs.length > 0 && (
                                    <div className="w-full flex flex-col gap-4">
                                        <div className="text-gray-200 text-base font-medium font-sans leading-normal">Select Specifications</div>
                                        
                                        {/* Group specs by type */}
                                        {(() => {
                                            const colorSpecs = p.specs.filter((spec, idx) => isColorSpec(spec.label, spec.value));
                                            const sizeSpecs = p.specs.filter((spec, idx) => isSizeSpec(spec.label, spec.value));
                                            const otherSpecs = p.specs.filter((spec, idx) => 
                                                !isColorSpec(spec.label, spec.value) && !isSizeSpec(spec.label, spec.value)
                                            );

                                            return (
                                                <div className="space-y-4">
                                                    {/* Color Specs */}
                                                    {colorSpecs.length > 0 && (
                                                        <div>
                                                            <label className="text-gray-300 text-sm mb-2 block">
                                                                {colorSpecs[0].label}
                                                            </label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {colorSpecs.map((spec, idx) => {
                                                                    const originalIdx = p.specs.indexOf(spec);
                                                                    const isSelected = selectedSpec === originalIdx;
                                                                    const colorValue = getColorValue(spec.value);
                                                                    return (
                                                                        <button
                                                                            key={originalIdx}
                                                                            onClick={() => selectSpec(originalIdx)}
                                                                            className={`w-10 h-10 rounded-full border-2 transition-all ${
                                                                                isSelected 
                                                                                    ? 'border-rose-500 ring-2 ring-rose-500/50 scale-110' 
                                                                                    : 'border-neutral-600 hover:border-neutral-400'
                                                                            }`}
                                                                            style={{ backgroundColor: colorValue }}
                                                                            title={spec.value}
                                                                        />
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Size Specs */}
                                                    {sizeSpecs.length > 0 && (
                                                        <div>
                                                            <label className="text-gray-300 text-sm mb-2 block">
                                                                {sizeSpecs[0].label}
                                                            </label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {sizeSpecs.map((spec, idx) => {
                                                                    const originalIdx = p.specs.indexOf(spec);
                                                                    const isSelected = selectedSpec === originalIdx;
                                                                    return (
                                                                        <button
                                                                            key={originalIdx}
                                                                            onClick={() => selectSpec(originalIdx)}
                                                                            className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                                                                                isSelected 
                                                                                    ? 'border-rose-500 bg-rose-500/10 text-rose-400' 
                                                                                    : 'border-neutral-600 text-gray-300 hover:border-neutral-400 hover:bg-neutral-800'
                                                                            }`}
                                                                        >
                                                                            {spec.value}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Other Specs */}
                                                    {otherSpecs.length > 0 && (
                                                        <div>
                                                            <label className="text-gray-300 text-sm mb-2 block">Other Options</label>
                                                            <div className="space-y-2">
                                                                {otherSpecs.map((spec, idx) => {
                                                                    const originalIdx = p.specs.indexOf(spec);
                                                                    const isSelected = selectedSpec === originalIdx;
                                                                    return (
                                                                        <button
                                                                            key={originalIdx}
                                                                            onClick={() => selectSpec(originalIdx)}
                                                                            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                                                                                isSelected 
                                                                                    ? 'border-rose-500 bg-rose-500/10 text-rose-400' 
                                                                                    : 'border-neutral-600 text-gray-300 hover:border-neutral-400 hover:bg-neutral-800'
                                                                            }`}
                                                                        >
                                                                            <div className="flex items-center justify-between">
                                                                                <span className="font-medium">{spec.label}</span>
                                                                                <span className="text-sm">{spec.value}</span>
                                                                            </div>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                                
                                {/* Quantity selector */}
                                <div className="w-36 flex flex-col gap-2">
                                    <div className="text-white text-sm font-medium font-sans leading-tight">Quantity</div>
                                    <div className="p-3 outline outline-1 outline-gray-200 flex flex-col items-center rounded-lg">
                                        <div className="flex items-end gap-9">
                                            <button onClick={() => handleQuantityChange(-1)} className="w-6 h-6 flex items-center justify-center"><Minus color="#f1f1f1" /></button>
                                            <span className="text-white text-base font-medium font-sans">{quantity}</span>
                                            <button onClick={() => handleQuantityChange(1)} className="w-6 h-6 flex items-center justify-center"><Plus color="#f1f1f1" /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                                {p && p.outOfStock ? (<div className="inline-flex flex-col justify-start items-start gap-4">
                                    <div className="justify-start text-white text-base font-semibold font-['Mona_Sans'] leading-normal">Out of stock</div>
                                    <Button onClick={handleAddToWishlist} disabled={addingToWishlist} className="w-full px-7 py-3 bg-rose-500 rounded-xl inline-flex justify-center items-center gap-2.5">
                                        {addingToWishlist && <Loader2 size={16} className="mr-2 animate-spin" />}
                                        <div className="justify-start text-white text-sm font-medium font-['Mona_Sans'] leading-tight">{addingToWishlist ? 'Adding...' : 'Add to Wishlist'}</div>
                                    </Button>
                                </div>) :
                            <Button onClick={handleAddToCart} disabled={cartUpdating} className="w-full max-w-xs px-7 py-4 bg-rose-500 rounded-xl flex justify-center items-center gap-2.5 text-white text-sm font-medium font-sans leading-tight">
                              {cartUpdating && <Loader2 size={16} className="mr-2 animate-spin" />}
                              {cartUpdating ? 'Adding...' : 'Add To Cart'}
                            </Button>
                        }
                        
                        </div>
                        <div className="self-stretch flex flex-col gap-3">
                            <div className="text-gray-200 text-xl font-semibold font-sans leading-normal">Shipping policy</div>
                            <div className="text-gray-200 text-sm font-normal font-sans leading-tight">We ship all over Nigeria at a very Affordable Rate.<br/>Same day delivery on Lagos order placed before 12pm , Next day delivery for items placed after 12:00pm.....<br/>Next day delivery for Ogun, Oyo, Ekiti, Kwara and Benin orders.....<br/>2-3 days delivery to Every other part of Nigeria.</div>
                        </div>
                    </div>
                    {/* You may also like - use ProductList widget */}
                    <div className="w-full">
                        <ProductList width={'w-full'} title="You may also like" products={mapToListItems(relatedProducts)} />
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
                                            <AmountCurrency amount={totalPrice} fromCurrency={p.currency} />
                                        </div>
                                        {p.description && (
                                            <div className="text-gray-300 text-base font-normal leading-relaxed whitespace-pre-wrap">
                                                {p.description}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-6">
                                        {/* Variant Selector - Desktop */}
                                        {p.variants && p.variants.length > 0 && (
                                            <div className="w-full flex flex-col gap-4">
                                                <div className="text-gray-200 text-base font-medium">Select Variant</div>
                                                
                                                {/* All Variants in a single list */}
                                                <div className="space-y-2">
                                                    {p.variants.map((variant) => {
                                                        const isSelected = selectedVariant?._id === variant._id || selectedVariant?.name === variant.name;
                                                        const inStock = (variant.stock || 0) > 0;
                                                        return (
                                                            <button
                                                                key={variant.name || variant._id}
                                                                onClick={() => {
                                                                    if (!inStock) return;
                                                                    // Toggle selection - if already selected, deselect
                                                                    if (isSelected) {
                                                                        setSelectedVariant(null);
                                                                    } else {
                                                                        // When selecting variant, clear spec
                                                                        setSelectedSpec(null);
                                                                        setSelectedVariant(variant);
                                                                    }
                                                                }}
                                                                disabled={!inStock}
                                                                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                                                                    isSelected 
                                                                        ? 'border-rose-500 bg-rose-500/10 text-rose-400' 
                                                                        : inStock
                                                                        ? 'border-neutral-600 text-gray-300 hover:border-neutral-400 hover:bg-neutral-800'
                                                                        : 'border-neutral-700 text-neutral-500 cursor-not-allowed opacity-50'
                                                                }`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-medium">{variant.name}</span>
                                                                    <span className="text-sm">
                                                                        <AmountCurrency 
                                                                            amount={variant.price || p.price || 0} 
                                                                            fromCurrency={variant.currency || p.currency || 'USDT'} 
                                                                        />
                                                                    </span>
                                                                </div>
                                                                {variant.attributes && variant.attributes.length > 0 && (
                                                                    <div className="text-xs text-gray-400 mt-1">
                                                                        {variant.attributes.map(attr => `${attr.name}: ${attr.value}`).join(', ')}
                                                                    </div>
                                                                )}
                                                                {!inStock && <span className="text-xs text-red-400 ml-2">(Out of Stock)</span>}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Specs Selector - Desktop - Only show if no variant is selected */}
                                        {!selectedVariant && p.specs && p.specs.length > 0 && (
                                            <div className="w-full flex flex-col gap-4">
                                                <div className="text-gray-200 text-base font-medium">Select Specifications</div>
                                                
                                                {/* Group specs by type */}
                                                {(() => {
                                                    const colorSpecs = p.specs.filter((spec, idx) => isColorSpec(spec.label, spec.value));
                                                    const sizeSpecs = p.specs.filter((spec, idx) => isSizeSpec(spec.label, spec.value));
                                                    const otherSpecs = p.specs.filter((spec, idx) => 
                                                        !isColorSpec(spec.label, spec.value) && !isSizeSpec(spec.label, spec.value)
                                                    );

                                                    return (
                                                        <div className="space-y-4">
                                                            {/* Color Specs */}
                                                            {colorSpecs.length > 0 && (
                                                                <div>
                                                                    <label className="text-gray-300 text-sm mb-2 block">
                                                                        {colorSpecs[0].label}
                                                                    </label>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {colorSpecs.map((spec, idx) => {
                                                                            const originalIdx = p.specs.indexOf(spec);
                                                                            const isSelected = selectedSpec === originalIdx;
                                                                            const colorValue = getColorValue(spec.value);
                                                                            return (
                                                                                <button
                                                                                    key={originalIdx}
                                                                                    onClick={() => selectSpec(originalIdx)}
                                                                                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                                                                                        isSelected 
                                                                                            ? 'border-rose-500 ring-2 ring-rose-500/50 scale-110' 
                                                                                            : 'border-neutral-600 hover:border-neutral-400'
                                                                                    }`}
                                                                                    style={{ backgroundColor: colorValue }}
                                                                                    title={spec.value}
                                                                                />
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Size Specs */}
                                                            {sizeSpecs.length > 0 && (
                                                                <div>
                                                                    <label className="text-gray-300 text-sm mb-2 block">
                                                                        {sizeSpecs[0].label}
                                                                    </label>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {sizeSpecs.map((spec, idx) => {
                                                                            const originalIdx = p.specs.indexOf(spec);
                                                                            const isSelected = selectedSpec === originalIdx;
                                                                            return (
                                                                                <button
                                                                                    key={originalIdx}
                                                                                    onClick={() => selectSpec(originalIdx)}
                                                                                    className={`px-5 py-2.5 rounded-lg border-2 transition-all text-sm font-medium ${
                                                                                        isSelected 
                                                                                            ? 'border-rose-500 bg-rose-500/10 text-rose-400' 
                                                                                            : 'border-neutral-600 text-gray-300 hover:border-neutral-400 hover:bg-neutral-800'
                                                                                    }`}
                                                                                >
                                                                                    {spec.value}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Other Specs */}
                                                            {otherSpecs.length > 0 && (
                                                                <div>
                                                                    <label className="text-gray-300 text-sm mb-2 block">Other Options</label>
                                                                    <div className="space-y-2">
                                                                        {otherSpecs.map((spec, idx) => {
                                                                            const originalIdx = p.specs.indexOf(spec);
                                                                            const isSelected = selectedSpec === originalIdx;
                                                                            return (
                                                                                <button
                                                                                    key={originalIdx}
                                                                                    onClick={() => selectSpec(originalIdx)}
                                                                                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                                                                                        isSelected 
                                                                                            ? 'border-rose-500 bg-rose-500/10 text-rose-400' 
                                                                                            : 'border-neutral-600 text-gray-300 hover:border-neutral-400 hover:bg-neutral-800'
                                                                                    }`}
                                                                                >
                                                                                    <div className="flex items-center justify-between">
                                                                                        <span className="font-medium">{spec.label}</span>
                                                                                        <span className="text-sm">{spec.value}</span>
                                                                                    </div>
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                        
                                        {/* Quantity selector (static for now) */}
                                        <div className="w-36 flex flex-col gap-2">
                                            <div className="text-white text-sm font-medium   ">Quantity</div>
                                            <div className="p-3 outline outline-1 outline-gray-300 flex flex-col items-center rounded-lg">
                                                <div className="flex items-end gap-9">
                                                    <button onClick={() => handleQuantityChange(-1)} className="w-6 h-6 flex items-center justify-center"><Minus color="#f1f1f1" /></button>
                                                    <span className="text-white text-base font-medium   ">{quantity}</span>
                                                    <button onClick={() => handleQuantityChange(1)} className="w-6 h-6 flex items-center justify-center"><Plus color="#f1f1f1" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {p && p.outOfStock ? (<div className="inline-flex flex-col justify-start items-start gap-4">
                                    <div className="justify-start text-white text-base font-semibold font-['Mona_Sans'] leading-normal">Out of stock</div>
                                    <Button onClick={handleAddToWishlist} disabled={addingToWishlist} className="w-96 px-7 py-3 bg-rose-500 rounded-xl inline-flex justify-center items-center gap-2.5">
                                        {addingToWishlist && <Loader2 size={16} className="mr-2 animate-spin" />}
                                        <div className="justify-start text-white text-sm font-medium font-['Mona_Sans'] leading-tight">{addingToWishlist ? 'Adding...' : 'Add to Wishlist'}</div>
                                    </Button>
                                </div>) :
                                    <Button onClick={handleAddToCart} disabled={cartUpdating} className="w-[400px] h-12 bg-rose-500 rounded-xl text-white text-base font-medium flex items-center justify-center gap-2">
                                      {cartUpdating && <Loader2 size={16} className="animate-spin" />}
                                      {cartUpdating ? 'Adding...' : 'Add To Cart'}
                                    </Button>
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
                            <div className="text-white text-2xl font-semibold    leading-loose whitespace-pre-wrap break-words max-w-full">{p.description}</div>
                            {/* Specs Selection - Only show if no variant is selected */}
                            {!selectedVariant && p.specs && p.specs.length > 0 && (
                            <div className="flex flex-col gap-6">
                                    <div className="text-rose-500 text-xl font-semibold leading-relaxed">Specifications</div>
                                    <div className="flex flex-col gap-3">
                                        {p.specs.map((spec, idx) => {
                                            const isSelected = selectedSpec === idx;
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => selectSpec(idx)}
                                                    disabled={!!selectedVariant}
                                                    className={`flex gap-2 p-3 rounded-lg border-2 transition-all text-left ${
                                                        isSelected
                                                            ? 'border-rose-500 bg-rose-500/10'
                                                            : selectedVariant
                                                            ? 'border-neutral-700 bg-neutral-800/50 opacity-50 cursor-not-allowed'
                                                            : 'border-neutral-600 hover:border-neutral-400'
                                                    }`}
                                                >
                                                    <div className="w-28 text-white text-base font-medium">{spec.label}</div>
                                                    <div className="flex-1 text-white text-base font-normal">{spec.value}</div>
                                                    {isSelected && (
                                                        <div className="text-rose-400 text-sm">✓</div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            {/* Show specs as read-only if variant is selected */}
                            {selectedVariant && p.specs && p.specs.length > 0 && (
                                <div className="flex flex-col gap-6">
                                    <div className="text-rose-500 text-xl font-semibold leading-relaxed">Product Specifications</div>
                                    <div className="flex flex-col gap-3">
                                        {p.specs.map((spec, idx) => (
                                            <div
                                                key={idx}
                                                className="flex gap-2 p-3 rounded-lg border border-neutral-700 bg-neutral-800/30"
                                            >
                                                <div className="w-28 text-gray-400 text-base font-medium">{spec.label}</div>
                                                <div className="flex-1 text-white text-base font-normal">{spec.value}</div>
                                    </div>
                                ))}
                            </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* You may also like */}
                    <ProductList width={'full'} title="You may also like" products={mapToListItems(relatedProducts)} />
                </div>
            </div>
        </Layout>
    );
}