import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import ProductFilter from "@/components/widgets/ProductFilter";
import { ACTIVE_PAGINATION_ITEM_STYLE, PAGINATION_ITEM_STYLE } from "@/components/constants";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "@/config/routes";
import AmountCurrency from "@/components/ui/AmountCurrency";
import useStore from "@/store/useStore";
import { Heart, Loader2 } from "lucide-react";

const ProductGridSection = ({ products = [], activePage = 1, totalPages = 1, onPageChange }) => {
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(null);
  const { addToCart, wishlist, addToWishlist, removeFromWishlist, isAuthenticated } = useStore();

  // Normalize incoming products to UI shape without changing visual UI
  const normalized = (products || []).map((p) => ({
    id: p?._id || p?.id || p?.slug,
    name: p?.name,
    price: p?.price,
    description: p?.description,
    currency: p?.currency || "USDC",
    image: p?.images?.[0] || p?.image || "https://via.placeholder.com/300x240",
    stock: p?.stock || 0,
  }));

  const handleNavigate = (id) => {
    if (!id) return;
    navigate(AppRoutes.productDetail.path.replace(":id", id));
  };

  const handleAddToCart = async (productId) => {
    if (!productId) return;
    setAddingToCart(productId);
    try {
      await addToCart(productId, 1);
      setTimeout(() => {
        setAddingToCart(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setAddingToCart(null);
    }
  };

  const handleWishlistToggle = async (e, productId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate(AppRoutes.home.path);
      return;
    }
    
    const isInWishlist = wishlist?.items?.some(item => 
      (item.product?._id || item.product?.id) === productId
    );

    try {
      if (isInWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist?.items?.some(item => 
      (item.product?._id || item.product?.id) === productId
    );
  };

  return (
    <div className="flex flex-col w-[100%]  items-start absolute top-[156px] ">
      <Separator className="w-full h-px mt-[-1.00px] bg-neutral-600 relative self-stretch object-cover" />

      <div className="flex w-[100%] items-start justify-between relative flex-1 grow">
        {/* Sidebar filters */}
        <aside className="hidden md:flex flex-col w-[25%] items-start gap-6 pt-8 pb-0 px-0 relative">
          <ProductFilter />
        </aside>

        {/* Vertical divider */}
        <div className="hidden md:block w-px bg-neutral-700 self-stretch" />

        {/* Product grid - flexbox for responsive layout (avoids grid overlap on Android) */}
        <div className="w-full md:ml-1 md:w-[73%] h-full inline-flex flex-col items-center justify-center gap-4 pt-8 pb-0 px-0 relative flex-[0_0_auto]">
          <div className="flex flex-wrap gap-3 md:gap-6 w-full">
            {normalized.map((product) => (
              <Card
                key={product.id}
                className={`flex flex-col items-start gap-4 relative bg-transparent border-none p-0 min-w-0 max-w-full ${
                  normalized.length === 1
                    ? 'w-[50%] md:w-[30%]'
                    : 'min-[140px] flex-[1_1_calc(50%-6px)] md:flex-[1_1_calc(33.333%-16px)]'
                }`}
              >
                <CardContent style={{ padding: "0px" }} className="p-0 w-full min-w-0">
                  <div className="relative w-full aspect-[296/267] bg-neutral-800 rounded-[15.95px] overflow-hidden" onClick={() => handleNavigate(product.id)}>
                    <img
                      className="w-full h-full object-cover"
                      alt={product.name}
                      src={product.image}
                    />
                    {/* {product.stock > 0 && ( */}
                      <button
                        onClick={(e) => handleWishlistToggle(e, product.id)}
                        className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 bg-neutral-900/20 hover:bg-neutral-900 rounded-full flex items-center justify-center transition-all z-10"
                      >
                        <Heart
                          size={18}
                          className={`${
                            isInWishlist(product.id)
                              ? "fill-red-500 text-red-500"
                              : "text-neutral-700"
                          }`}
                        />
                      </button>
                    {/* )} */}
                  </div>

                  <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto] mt-4">
                    <div className="flex flex-col w-full items-start gap-[9.57px] relative flex-[0_0_auto]">
                      <div className="relative self-stretch mt-[-0.80px] [font-family:'Mona_Sans-Regular',Helvetica] font-normal text-defaultwhite text-[17.6px] tracking-[0] leading-[21.1px] truncate" onClick={() => handleNavigate(product.id)}>
                        {product.name}
                      </div>
                      <div className="relative self-stretch [font-family:'Mona_Sans-Regular',Helvetica] font-normal text-defaultwhite text-[14px] tracking-[0] leading-[18px] h-[15px] overflow-hidden whitespace-nowrap text-ellipsis max-w-[156px] md:max-w-[236px]" onClick={() => handleNavigate(product.id)}>
                        {product.description}
                      </div>

                      <div className="relative self-stretch [font-family:'Mona_Sans-SemiBold',Helvetica] font-semibold text-defaultwhite text-[17.6px] tracking-[0] leading-[21.1px]">
                        <AmountCurrency amount={product.price} fromCurrency="USD" />
                      </div>
                    </div>

                    <Button
                      onClick={() => handleAddToCart(product.id)}
                      className="flex items-center justify-center gap-2.5 px-7 py-[13px] relative self-stretch w-full flex-[0_0_auto] bg-primaryp-300 rounded-xl h-auto"
                      disabled={addingToCart === product.id}
                    >
                      {addingToCart === product.id && <Loader2 size={16} className="animate-spin" />}
                      <span className="font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-white text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] whitespace-nowrap [font-style:var(--body-base-base-medium-font-style)]">
                        {addingToCart === product.id ? "Adding..." : "Add To Cart"}
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
              <PaginationPrevious
                onClick={() => onPageChange && onPageChange(Math.max(1, activePage - 1))}
                label={"  "}
                className="relative bg-[url('/images/mdi_arrow-backward.svg')] bg-no-repeat bg-center w-6 h-6  hover:bg-primaryp-300 hover:text-white overflow-hidden flex items-center justify-center [font-family:'Mona_Sans-SemiBold',Helvetica] font-semibold text-defaultgrey-2 text-lg tracking-[0] leading-[21.6px]"
              >
                {" "}
              </PaginationPrevious>

              <PaginationContent className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index} style={index + 1 === activePage ? ACTIVE_PAGINATION_ITEM_STYLE : PAGINATION_ITEM_STYLE} className="rounded-full">
                    <PaginationLink
                      onClick={() => onPageChange && onPageChange(index + 1)}
                      className="relative hover:bg-primaryp-300 hover:text-white overflow-hidden flex items-center justify-center [font-family:'Mona_Sans-SemiBold',Helvetica] font-semibold text-defaultgrey-2 text-lg tracking-[0] leading-[21.6px]"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </PaginationContent>

              <PaginationNext
                onClick={() => onPageChange && onPageChange(Math.min(totalPages, activePage + 1))}
                className="relative bg-[url('/images/mdi_arrow-forward.svg')] bg-no-repeat bg-center w-6 h-6  hover:bg-primaryp-300 hover:text-white overflow-hidden flex items-center justify-center [font-family:'Mona_Sans-SemiBold',Helvetica] font-semibold text-defaultgrey-2 text-lg tracking-[0] leading-[21.6px]"
                aria-label="Go to next page"
                label={"  "}
              ></PaginationNext>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGridSection;
