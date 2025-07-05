import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductGridSection from "../components/ProductGridSection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import { AppRoutes } from "@/config/routes";
import { MobileFilterButton } from "@/components/widgets/ProductFilter";
import { DROPDOWN_MENU_CONTENT_STYLE } from "@/components/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import SEO from "@/components/SEO";
import { getPageSEO, generateBreadcrumbStructuredData } from "@/config/seo";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function SearchResultsPage() {
  const query = useQuery().get("q") || "";
  const breadcrumbItems = [
    { label: "Home", href: AppRoutes.home.path },
    { label: "Products", href: AppRoutes.productList.path },
    { label: `Search Result: ${query}` },
  ];
  const [resultCount, setResultCount] = useState(52);

  // SEO configuration
  const seoData = getPageSEO('search', {
    title: query ? `Search Results for "${query}" - Abscotek` : 'Search Results - Abscotek',
    description: query 
      ? `Search results for "${query}" at Abscotek. Find tech products, electronics, and gadgets matching your search.`
      : 'Search results at Abscotek. Find the perfect tech products and electronics that match your needs.',
    keywords: query ? `${query}, search results, tech products, electronics, find products` : undefined,
    path: query ? `/search?q=${encodeURIComponent(query)}` : '/search'
  });

  const breadcrumbStructuredData = generateBreadcrumbStructuredData(
    breadcrumbItems.map(item => ({ name: item.label, path: item.href || '' }))
  );

  return (
    <Layout>
      <SEO 
        {...seoData}
        structuredData={breadcrumbStructuredData}
      />
      <div className="relative w-[92%] md:w-[86%] m-auto h-[2600px] md:h-[2000px] bg-[#131314] overflow-y-auto overflow-hidden">
        <nav className="absolute top-[10px]  md:top-[29px]">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink
                        href={item.href}
                        className="font-body-large-large-regular font-[number:var(--body-large-large-regular-font-weight)] text-defaultgrey-2 text-[length:var(--body-large-large-regular-font-size)] tracking-[var(--body-large-large-regular-letter-spacing)] leading-[var(--body-large-large-regular-line-height)] [font-style:var(--body-large-large-regular-font-style)]"
                      >
                        {item.label}
                      </BreadcrumbLink>
                    ) : (
                      <span className="font-body-large-large-regular font-[number:var(--body-large-large-regular-font-weight)] text-defaultgrey-2 text-[length:var(--body-large-large-regular-font-size)] tracking-[var(--body-large-large-regular-letter-spacing)] leading-[var(--body-large-large-regular-line-height)] [font-style:var(--body-large-large-regular-font-style)]">
                        {item.label}
                      </span>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbItems.length - 1 && (
                    <BreadcrumbSeparator className="text-defaultgrey-2" />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

           
      <div className="inline-flex md:absolute md:w-[80%]  justify-between items-center w-full md:gap-0 gap-2 mt-[100px] right-[0]">
      
      <div className="md:w-[20%] w-[50%]">
       <MobileFilterButton />

       </div>
       <div className=" flex flex-row gap-3 md:w-[30%] w-[50%] justify-end items-center">
        
        <div className=" text-end md:w-20 w-[30%] font-sm font-body-large-large-medium text-sm text-white text-[length:var(--body-large-large-medium-font-size)] tracking-[var(--body-large-large-medium-letter-spacing)] leading-[var(--body-large-large-medium-line-height)] [font-style:var(--body-large-large-medium-font-style)]">
        <p> Sort By
          </p> 
        </div>


        <Select defaultValue="recommend" >
          <SelectTrigger className="w-[70%] p-3.5 rounded-xl border border-solid border-neutral-600 text-sm text-white bg-transparent">
            <SelectValue className="font-body-base-base-regular font-[number:var(--body-base-base-regular-font-weight)] text-white text-[length:var(--body-base-base-regular-font-size)] tracking-[var(--body-base-base-regular-letter-spacing)] leading-[var(--body-base-base-regular-line-height)] [font-style:var(--body-base-base-regular-font-style)]" />
          </SelectTrigger>
          <SelectContent style={DROPDOWN_MENU_CONTENT_STYLE} className="text-sm text-white border-neutral-600">
            <SelectItem value="recommend">Recommend</SelectItem>
            <SelectItem value="price-low-high">Price: Low to High</SelectItem>
            <SelectItem value="price-high-low">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popularity">Popularity</SelectItem>
          </SelectContent>
        </Select>
       </div>


      </div>

      {/* Shopping count - moved to bottom on mobile */}
      <h2 className=" absolute top-[100px] text-sm text-defaultgrey-2 md:block hidden">
        Shopping Options ({resultCount} Results)
      </h2>
        <ProductGridSection />
      </div>
      
      {/* Mobile Shopping count at bottom */}
      <div className="md:hidden absolute block top-[240px]  left-4 right-0 ">
        <h2 className="text-sm text-defaultgrey-2">
          Shopping Options ({resultCount})
        </h2>
      </div>
    </Layout>
  );
} 