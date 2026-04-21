import React, { useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Navbar } from '../components/navbar/Navbar'
import { FilterSidebar } from '../components/plp/FilterSidebar'
import { ProductGrid } from '../components/products/ProductGrid'
import { pageEnter, pageLeave } from '../gsap/pageTransitions'
import { productAPI } from '../services/api'

export function ShopPage() {
  const containerRef = useRef(null)
  const [searchParams] = useSearchParams()
  const categorySlug = searchParams.get('category')
  const [products, setProducts] = React.useState([])
  const [categories, setCategories] = React.useState([])
  const [sort, setSort] = React.useState('newest')
  const [loading, setLoading] = React.useState(false)
  const [total, setTotal] = React.useState(0)
  const categoryAliasMap = {
    'normal-specs': 'prescription-glasses',
    'number-glasses': 'prescription-glasses',
    lenses: 'blue-light-glasses',
    cases: 'sunglasses'
  }

  useEffect(() => {
    pageEnter(containerRef.current)

    return () => {
      pageLeave(containerRef.current)
    }
  }, [])

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const categoriesRes = await productAPI.getCategories()
        const fetchedCategories = categoriesRes.data || []
        setCategories(fetchedCategories)

        const effectiveSlug = categoryAliasMap[categorySlug] || categorySlug
        const matchedCategory = fetchedCategories.find((c) => c.slug === effectiveSlug)
        const params = {
          sort,
          page: 1,
          limit: 12
        }

        if (matchedCategory?.id) {
          params.category = matchedCategory.id
        }

        const productsRes = await productAPI.getAll(params)
        setProducts(productsRes.data?.products || [])
        setTotal(productsRes.data?.total || 0)
      } catch (error) {
        console.error('Failed to load products', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [categorySlug, sort])

  const selectedCategory = categories.find((c) => c.slug === categorySlug)
    || categories.find((c) => c.slug === categoryAliasMap[categorySlug])
  const heading = selectedCategory?.name || 'All Eyewear'

  return (
    <div ref={containerRef} className="page-container min-h-screen bg-page-bg">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container-main mx-auto">
          
          {/* Header Row */}
          <div className="mb-12 flex flex-col justify-between gap-4 border-b border-border-default pb-6 md:flex-row md:items-end">
            <div>
              <div className="text-sm text-text-muted mb-2 font-medium">
                <span>Home</span> <span className="mx-2">/</span> <span className="text-text-primary">{heading}</span>
              </div>
              <h1 className="text-4xl font-serif font-bold text-text-primary">{heading}</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-text-muted">Viewing up to 12 of {total} results</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-primary">Sort By:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border-none bg-transparent text-sm font-medium text-text-muted outline-none hover:text-text-primary cursor-pointer w-[120px]"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="flex flex-col gap-10 lg:flex-row">
            
            {/* Sidebar (Desktop) */}
            <div className="hidden w-[280px] shrink-0 lg:block">
              <div className="sticky top-24">
                 <FilterSidebar />
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="rounded-xl border border-border-default bg-white p-10 text-center text-text-secondary">
                  Loading products...
                </div>
              ) : (
                <ProductGrid products={products} />
              )}
              
              {/* Pagination */}
              <div className="mt-16 flex items-center justify-center gap-2">
                 <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-default text-text-muted hover:border-accent-primary hover:text-accent-primary">
                    ←
                 </button>
                 <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-primary text-white">
                    1
                 </button>
                 <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-default text-text-muted hover:border-accent-primary hover:text-accent-primary">
                    2
                 </button>
                 <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-default text-text-muted hover:border-accent-primary hover:text-accent-primary">
                    3
                 </button>
                 <span className="mx-1 text-text-muted">...</span>
                 <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-default text-text-muted hover:border-accent-primary hover:text-accent-primary">
                    11
                 </button>
                 <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-default text-text-muted hover:border-accent-primary hover:text-accent-primary">
                    →
                 </button>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  )
}

export default ShopPage
