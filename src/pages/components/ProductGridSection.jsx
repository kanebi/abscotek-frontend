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

const ProductGridSection = ({activePage=1, totalPages=3}) => {
  const navigate = useNavigate();
  // Product data
  const products = [
    {
      id: 1,
      name: "New Apple iPhone 16 Plus ESIM 128GB",
      price: "450.36 USDT",
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: "New Apple iPhone 16 Plus ESIM 128GB",
      price: "450.36 USDT",
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      name: "New Apple iPhone 16 Plus ESIM 128GB",
      price: "450.36 USDT",
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 4,
      name: "New Apple iPhone 16 Plus ESIM 128GB",
      price: "450.36 USDT",
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 5,
      name: "New Apple iPhone 16 Plus ESIM 128GB",
      price: "450.36 USDT",
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 6,
      name: "New Apple iPhone 16 Plus ESIM 128GB",
      price: "450.36 USDT",
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 7,
      name: "New Apple iPhone 16 Plus ESIM 128GB",
      price: "450.36 USDT",
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 8,
      name: "New Apple iPhone 16 Plus ESIM 128GB",
      price: "450.36 USDT",
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 9,
      name: "New Apple iPhone 16 Plus ESIM 128GB",
      price: "450.36 USDT",
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 10,
      name: "New Apple iPhone 16 Plus ESIM 128GB",
      price: "450.36 USDT",
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 11,
      name: "New Apple iPhone 16 Plus ESIM 128GB",
      price: "450.36 USDT",
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 12,
      name: "New Apple iPhone 16 Plus ESIM 128GB",
      price: "450.36 USDT",
      image: 'https://via.placeholder.com/150',
    },
  ];

  // Group products into rows of 3 for desktop, 2 for mobile
  const productRows = [];
  for (let i = 0; i < products.length; i += 3) {
    productRows.push(products.slice(i, i + 3));
  }

  return (
    <div className="flex flex-col w-[100%]  items-start absolute top-[156px] ">
      <Separator
        className="w-full h-px mt-[-1.00px] bg-neutral-600 relative self-stretch object-cover"
       
      />

      <div className="flex w-[100%] items-start justify-between relative flex-1 grow">
        {/* Sidebar filters */}
        <aside className="hidden md:flex flex-col w-[25%] items-start gap-6 pt-8 pb-0 px-0 relative">
          <ProductFilter />
        </aside>

        {/* Vertical divider */}
        <div className="hidden md:block w-px bg-neutral-700 self-stretch" />


        {/* Product grid */}
        <div className="w-full md:ml-1 md:w-[73%] h-full inline-flex flex-col items-center justify-center gap-4 pt-8 pb-0 px-0 relative flex-[0_0_auto]">
          <div className="grid grid-cols-2 md:gap-6 gap-3 md:grid-cols-3 relative flex-[0_0_auto] w-full ">
            {products.map((product) => (
                  <Card
                  onClick={()=>navigate(`${AppRoutes.productDetail.path.replace(':id',product.id)}`)}
                    key={product.id}
                    className="flex   w-[100%] p-0  flex-col  items-start gap-4 relative bg-transparent border-none"
                  >
                    <CardContent style={{padding:'0px'}} className="p-0">
                      <div className="relative self-stretch w-full h-[230px] md:h-[267.2px]  bg-neutral-800 rounded-[15.95px] overflow-hidden">
                        <img
                          className="absolute w-[296px] h-[267px] top-0 left-0 object-cover"
                          alt={product.name}
                          src={'https://via.placeholder.com/150'}
                        />
                      </div>

                      <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto] mt-4">
                        <div className="flex flex-col w-full items-start gap-[9.57px] relative flex-[0_0_auto]">
                          <div className="relative self-stretch mt-[-0.80px] [font-family:'Mona_Sans-Regular',Helvetica] font-normal text-defaultwhite text-[17.6px] tracking-[0] leading-[21.1px]">
                            {product.name}
                          </div>

                          <div className="relative self-stretch [font-family:'Mona_Sans-SemiBold',Helvetica] font-semibold text-defaultwhite text-[17.6px] tracking-[0] leading-[21.1px]">
                            {product.price}
                          </div>
                        </div>

                        <Button className="flex items-center justify-center gap-2.5 px-7 py-[13px] relative self-stretch w-full flex-[0_0_auto] bg-primaryp-300 rounded-xl h-auto">
                          <span className="font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-white text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] whitespace-nowrap [font-style:var(--body-base-base-medium-font-style)]">
                            Add To Cart
                          </span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
            ))}
          </div>

          {/* Pagination */}
          <Pagination  className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
            
            <PaginationPrevious
              label={'  '}
              className="relative bg-[url('/images/mdi_arrow-backward.svg')] bg-no-repeat bg-center w-6 h-6  hover:bg-primaryp-300 hover:text-white overflow-hidden flex items-center justify-center [font-family:'Mona_Sans-SemiBold',Helvetica] font-semibold text-defaultgrey-2 text-lg tracking-[0] leading-[21.6px]"
            >
              {' '}
            </PaginationPrevious>

            <PaginationContent className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                {[...Array(totalPages)].map((item,index)=>(
                 
              <PaginationItem style={index===activePage?ACTIVE_PAGINATION_ITEM_STYLE:PAGINATION_ITEM_STYLE} className="rounded-full">
                <PaginationLink className="relative hover:bg-primaryp-300 hover:text-white overflow-hidden flex items-center justify-center [font-family:'Mona_Sans-SemiBold',Helvetica] font-semibold text-defaultgrey-2 text-lg tracking-[0] leading-[21.6px]">
                  {index+1}
                </PaginationLink>
              </PaginationItem>
                ))}
            </PaginationContent>

            <PaginationNext
              className="relative bg-[url('/images/mdi_arrow-forward.svg')] bg-no-repeat bg-center w-6 h-6  hover:bg-primaryp-300 hover:text-white overflow-hidden flex items-center justify-center [font-family:'Mona_Sans-SemiBold',Helvetica] font-semibold text-defaultgrey-2 text-lg tracking-[0] leading-[21.6px]"
              aria-label="Go to next page"
              label={'  '}
            >

            </PaginationNext>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default ProductGridSection;
