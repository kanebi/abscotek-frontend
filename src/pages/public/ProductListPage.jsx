import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import ProductGridSection from "../components/ProductGridSection";
import { MobileFilterButton } from "@/components/widgets/ProductFilter";
import Layout from "@/components/Layout";
import { DROPDOWN_MENU_CONTENT_STYLE } from "../../components/constants";
import { AppRoutes } from "@/config/routes";
import { useSearchParams } from "react-router-dom";

export default function Desktop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category');

  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { label: "Home", href: AppRoutes.home.path },
    { label: "Products", href: AppRoutes.productList.path }
  ]);
  React.useEffect(()=>{
  if(category){
    setBreadcrumbItems([...breadcrumbItems, { label: category, href: `${AppRoutes.productList.path}?category=${category}` }]);
  }
},[category])

  const [resultCount, setResultCount] = useState(52);

  return (
    <Layout >

    <div className="relative w-[92%] md:w-[86%] m-auto h-[2600px] md:h-[2000px] bg-[#131314] overflow-y-auto overflow-hidden">

      <nav className="absolute top-[10px]  md:top-[29px]">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={item.href}
                    className="font-body-large-large-regular font-[number:var(--body-large-large-regular-font-weight)] text-defaultgrey-2 text-[length:var(--body-large-large-regular-font-size)] tracking-[var(--body-large-large-regular-letter-spacing)] leading-[var(--body-large-large-regular-line-height)] [font-style:var(--body-large-large-regular-font-style)]"
                  >
                    {item.label}
                  </BreadcrumbLink>
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
      
      {/* Mobile Shopping count at bottom */}
      <div className="md:hidden absolute top-[65px] left-0 right-0 ">
        <h2 className="text-sm text-defaultgrey-2">
          Shopping Options ({resultCount})
        </h2>
      </div>
    </div>
    </Layout>

  );
}
