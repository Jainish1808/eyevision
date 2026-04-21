import React, { useState } from 'react'
import { Filter, X } from 'lucide-react'

export function FilterSidebar({ onFilterChange }) {
  const [openSection, setOpenSection] = useState('brand')

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? '' : section)
  }

  const filters = {
    brand: ['Ray-Ban', 'Oakley', 'Gucci', 'Persol', 'Tom Ford', 'Oliver Peoples'],
    shape: ['Round', 'Square', 'Aviator', 'Cat Eye', 'Wayfarer', 'Rectangle'],
    gender: ['Men', 'Women', 'Unisex'],
    color: ['Black', 'Tortoise', 'Gold', 'Silver', 'Clear', 'Blue'],
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between border-b border-border-default pb-4">
        <h3 className="font-semibold text-text-primary flex items-center gap-2"><Filter size={18} /> Filters</h3>
        <button className="text-xs font-semibold text-text-muted hover:text-text-primary">Clear All</button>
      </div>

      <div className="flex flex-col gap-4">
        {Object.entries(filters).map(([key, options]) => (
          <div key={key} className="border-b border-border-default pb-4">
            <button
              onClick={() => toggleSection(key)}
              className="flex w-full items-center justify-between text-left font-medium capitalize text-text-primary mb-2"
            >
              {key}
              <span className={`transition-transform ${openSection === key ? 'rotate-180' : ''}`}>
                <ChevronDownIcon />
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openSection === key ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
               <div className="flex flex-col gap-2 pt-2">
                 {options.map((opt) => (
                   <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                     <span className="relative flex h-4 w-4 items-center justify-center rounded border border-border-strong group-hover:border-accent-primary">
                       <input type="checkbox" className="peer absolute h-full w-full opacity-0 cursor-pointer" />
                       <span className="absolute inset-0 bg-accent-primary scale-0 transition-transform peer-checked:scale-100 rounded-sm m-0.5" />
                     </span>
                     <span className="text-sm text-text-secondary group-hover:text-text-primary">{opt}</span>
                   </label>
                 ))}
               </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Price Slider Stub */}
      <div className="pt-4">
         <h4 className="font-medium text-text-primary mb-4">Price Range</h4>
         <div className="h-1 w-full bg-border-default rounded-full relative mb-4">
           <div className="absolute left-1/4 right-1/4 h-full bg-accent-primary rounded-full" />
           <div className="absolute left-1/4 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-accent-primary shadow" />
           <div className="absolute right-1/4 top-1/2 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-accent-primary shadow" />
         </div>
         <div className="flex justify-between text-xs text-text-muted font-medium">
           <span>$50</span>
           <span>$300+</span>
         </div>
      </div>

      <button className="w-full bg-accent-primary hover:bg-accent-hover text-white py-3 rounded-lg mt-8 text-btn font-semibold transition-colors">
        Apply Filters
      </button>

    </div>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.59 0.589966L6 5.16997L1.41 0.589966L0 1.99997L6 7.99997L12 1.99997L10.59 0.589966Z" fill="currentColor" />
    </svg>
  )
}

export default FilterSidebar
