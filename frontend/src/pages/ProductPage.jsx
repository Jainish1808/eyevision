import React, { useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Navbar } from '../components/navbar/Navbar'
import { ImageGallery } from '../components/pdp/ImageGallery'
import { ProductDetail } from '../components/pdp/ProductDetail'
import { ComboSuggestions } from '../components/pdp/ComboSuggestions'
import { pageEnter, pageLeave } from '../gsap/pageTransitions'
import { cartAPI, productAPI } from '../services/api'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ProductPage() {
  const containerRef = useRef(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = React.useState(null)
  const [related, setRelated] = React.useState([])
  const [combos, setCombos] = React.useState([])
  const [suggestions, setSuggestions] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [isAdding, setIsAdding] = React.useState(false)

  useEffect(() => {
    pageEnter(containerRef.current)
    
    // Pin image gallery block on desktop
    const mm = gsap.matchMedia()
    let pinScrollTrigger = null

    mm.add('(min-width: 1024px)', () => {
      // Small timeout to ensure DOM is fully rendered
      setTimeout(() => {
          pinScrollTrigger = ScrollTrigger.create({
            trigger: '.pdp-layout',
            start: 'top top+=64', // Accounts for navbar
            end: 'bottom bottom',
            pin: '.pdp-image-col',
            pinSpacing: false
          })
      }, 100)
    })

    return () => {
      if (pinScrollTrigger) pinScrollTrigger.kill()
      mm.revert()
      pageLeave(containerRef.current)
    }
  }, [])

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true)
      setError('')
      try {
        const [productRes, relatedRes, combosRes, suggestionsRes] = await Promise.all([
          productAPI.getById(id),
          productAPI.getRelated(id, 6),
          productAPI.getCombos(id, 4),
          productAPI.getSuggestions(id, 6)
        ])

        setProduct(productRes.data)
        setRelated(relatedRes.data || [])
        setCombos(combosRes.data?.combos || [])
        setSuggestions(suggestionsRes.data || [])
      } catch (err) {
        setError(err?.response?.data?.detail || 'Unable to load product details.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const handleAddToCart = async ({ productId, quantity = 1, variant, prescription } = {}) => {
    const targetProductId = productId || product?.id
    if (!targetProductId) return

    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate('/auth')
      return
    }

    setIsAdding(true)
    try {
      await cartAPI.add(targetProductId, quantity, { variant, prescription })
    } catch (err) {
      console.error('Add to cart failed', err)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div ref={containerRef} className="page-container min-h-screen bg-page-bg">
      <Navbar />
      
      <main className="pt-24 pb-12">
        {isLoading ? (
          <div className="container-main mx-auto rounded-xl border border-border-default bg-white p-10 text-center text-text-secondary">
            Loading product details...
          </div>
        ) : error ? (
          <div className="container-main mx-auto rounded-xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
            {error}
          </div>
        ) : (
          <div className="container-main pdp-layout mx-auto flex flex-col gap-12 lg:flex-row relative items-start">
          
            <div className="pdp-image-col w-full lg:w-1/2">
               <ImageGallery images={product?.images || [product?.primary_image].filter(Boolean)} />
            </div>

            <div className="pdp-info w-full lg:w-1/2 lg:pl-8">
               <ProductDetail product={product} onAddToCart={handleAddToCart} isAdding={isAdding} />
            </div>

          </div>
        )}
      </main>

      <ComboSuggestions 
        combos={combos} 
        suggestions={suggestions}
        related={related}
        onAddSuggestion={handleAddToCart} 
      />
    </div>
  )
}

export default ProductPage
