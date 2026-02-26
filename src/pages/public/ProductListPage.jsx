import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState, useEffect, useMemo } from "react";
import ProductGridSection from "../components/ProductGridSection";
import { MobileFilterButton, ProductFilter } from "@/components/widgets/ProductFilter";
import Layout from "@/components/Layout";
import { DROPDOWN_MENU_CONTENT_STYLE } from "../../components/constants";
import { AppRoutes } from "@/config/routes";
import { useNavigate, useSearchParams } from "react-router-dom";
import SEO from "@/components/SEO";
import { getPageSEO, generateBreadcrumbStructuredData } from "@/config/seo";
import productService from "@/services/productService";
import EmptyProducts from "@/components/widgets/EmptyProducts";
import { PRODUCT_CATEGORIES } from "@/config/categories";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Desktop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Normalize category segment for API (e.g. phones -> Smartphones)
  const normalizeCategorySegment = (cat) => {
    if (!cat || !cat.trim()) return null;
    const categoryMap = {
      'phones': 'Smartphones', 'phone': 'Smartphones', 'Phones': 'Smartphones', 'Phone': 'Smartphones'
    };
    return categoryMap[cat.trim()] || cat.trim();
  };
  const rawCategory = searchParams.get('category') || undefined;
  const category = rawCategory
    ? rawCategory.split(',').map(normalizeCategorySegment).filter(Boolean).join(',') || undefined
    : undefined;
  const page = Number(searchParams.get('page') || 1);
  const sortParam = searchParams.get('sort') || undefined; // price:asc | price:desc | newest | popularity

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const sort = useMemo(() => {
    switch (sortParam) {
      case 'price-low-high':
        return 'price:asc';
      case 'price-high-low':
        return 'price:desc';
      case 'newest':
        return 'newest';
      case 'popularity':
        return 'popularity';
      default:
        return undefined;
    }
  }, [sortParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Get all filter params from URL
        const filterParams = {};
        for (let [key, value] of searchParams.entries()) {
          if (['color', 'size', 'minPrice', 'maxPrice', 'brand'].includes(key)) {
            filterParams[key] = value;
          }
        }

        const params = {
          category: category, // Use normalized category
          page,
          limit: 12,
          sort,
          ...filterParams
        };

        const data = await productService.getProducts(params);
        if (Array.isArray(data)) {
          setProducts(data);
          setTotalPages(1);
        } else {
          setProducts(data.items || []);
          const total = data.total || (data.items || []).length;
          const limit = data.limit || 12;
          setTotalPages(Math.max(1, Math.ceil(total / limit)));
        }
      } catch (err) {
        setError(err);
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, page, sort, searchParams]);

  const [resultCount, setResultCount] = useState(0);
  useEffect(() => { setResultCount(products.length); }, [products]);

  const onPageChange = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(nextPage));
    setSearchParams(next);
  };

  const onSortChange = (value) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', value);
    next.set('page', '1');
    setSearchParams(next);
  };

  // Navigation mapping (same as Header)
  const mainNavItems = ["Laptops", "Phone", "Smartwatches", "Tablets", "Audio", "Headphones", "TVs & Monitors"];
  const navToCategoryMap = {
    "Laptops": "Laptops",
    "Phone": "Smartphones",
    "Smartwatches": "Smart Watches",
    "Tablets": "Tablets",
    "Audio": "Speakers",
    "Headphones": "Headphones & Earbuds",
    "TVs & Monitors": "TVs & Monitors"
  };
  
  // Get other categories for "More" section
  const moreCategories = PRODUCT_CATEGORIES.filter(cat => {
    const categoryMap = {
      "Laptops": ["Laptops"],
      "Phone": ["Smartphones"],
      "Smartwatches": ["Smart Watches"],
      "Tablets": ["Tablets"],
      "Audio": ["Speakers", "Audio Equipment"],
      "Headphones": ["Headphones & Earbuds"],
      "TVs & Monitors": ["TVs & Monitors"]
    };
    const isInMainNav = Object.values(categoryMap).some(mainCats => 
      mainCats.some(mainCat => mainCat.toLowerCase() === cat.toLowerCase())
    );
    return !isInMainNav;
  });

  const handleCategoryClick = (navItem) => {
    const actualCategory = navToCategoryMap[navItem] || navItem;
    const next = new URLSearchParams(searchParams);
    next.set('category', actualCategory);
    next.set('page', '1');
    setSearchParams(next);
  };

  // SEO configuration
  const seoTitle = category ? `${category} - Tech Products | Abscotek` : 'Tech Products & Electronics - Abscotek';
  const seoDescription = category 
    ? `Browse ${category} products at Abscotek. Find premium tech gadgets, electronics, and accessories with USDC payment options.`
    : 'Browse our extensive collection of premium tech products including smartphones, laptops, tablets, and accessories. Latest models available with USDC payment.';
  
  const seoData = getPageSEO('products', {
    title: seoTitle,
    description: seoDescription,
    keywords: category ? `${category}, tech products, electronics, ${category} products, USDC payment` : undefined,
    path: category ? `/products?category=${category}` : '/products'
  });

  const breadcrumbItemsInitial = [
    { label: "Home", href: AppRoutes.home.path },
    { label: "Products", href: AppRoutes.productList.path }
  ];
  const breadcrumbItems = category 
    ? [...breadcrumbItemsInitial, { label: category, href: `${AppRoutes.productList.path}?category=${category}` }]
    : breadcrumbItemsInitial;
  const breadcrumbStructuredData = generateBreadcrumbStructuredData(
    breadcrumbItems.map(item => ({ name: item.label, path: item.href }))
  );

  if (error) return <Layout><div>Error: {error.message}</div></Layout>;

  const showEmpty = !loading && (!products || products.length === 0);

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
        <MobileFilterButton onFiltersChange={() => {}} />
      </div>
      <div className=" flex flex-row gap-3 md:w-[30%] w-[50%] justify-end items-center">
        <div className=" text-end md:w-20 w-[30%] font-sm font-body-large-large-medium text-sm text-white text-[length:var(--body-large-large-medium-font-size)] tracking-[var(--body-large-large-medium-letter-spacing)] leading-[var(--body-large-large-medium-line-height)] [font-style:var(--body-large-large-medium-font-style)]">
          <p> Sort By</p>
        </div>
        <Select value={sortParam || 'recommend'} onValueChange={onSortChange}>
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

      {/* Desktop Filter Panel */}
      <div className="hidden md:block absolute left-0 top-[156px] w-[20%]">
          {/* <ProductFilter /> */}
      </div>

      {loading ? (
        <div className="absolute top-[156px] w-full md:w-[73%] md:right-0 md:ml-1 p-4 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-10 w-10 animate-spin text-red-500" aria-hidden="true" />
        </div>
      ) : showEmpty ? (
        <div className="absolute top-[156px] w-full md:w-[73%] md:right-0 md:ml-1 p-4">
          <EmptyProducts
            onPrimaryAction={() => {
              const next = new URLSearchParams(searchParams);
              next.delete('category');
              next.delete('sort');
              next.delete('color');
              next.delete('size');
              next.delete('minPrice');
              next.delete('maxPrice');
              next.delete('brand');
              next.set('page', '1');
              setSearchParams(next);
            }}
            onSecondaryAction={() => navigate(AppRoutes.home.path)}
          />
        </div>
      ) : (
        <ProductGridSection
          products={products}
          activePage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

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
