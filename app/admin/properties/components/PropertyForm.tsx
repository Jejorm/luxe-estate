'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Property, PropertyType, PropertyTagType } from '@/lib/properties'
import { DynamicPropertyMap } from '@/components/DynamicPropertyMap'

interface PropertyFormProps {
  initialData?: Property | null
}

export default function PropertyForm({ initialData }: PropertyFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State for db fields
  const [title, setTitle] = useState(initialData?.title || '')
  const [priceNumeric, setPriceNumeric] = useState(
    initialData?.price_numeric?.toString() || '',
  )
  const [priceDisplay, setPriceDisplay] = useState(
    initialData?.price_display || '',
  )
  const [isRent, setIsRent] = useState(initialData?.is_rent || false)
  const [propertyType, setPropertyType] = useState<PropertyType | ''>(
    initialData?.property_type || '',
  )
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [tag, setTag] = useState(initialData?.tag || '')
  const [tagType, setTagType] = useState<PropertyTagType | ''>(
    initialData?.tag_type || '',
  )
  const [isFeatured, setIsFeatured] = useState<boolean>(
    initialData?.is_featured || false,
  )
  const [isActive, setIsActive] = useState<boolean>(
    initialData?.is_active ?? true,
  )

  const [location, setLocation] = useState(initialData?.location || '')
  const [lat, setLat] = useState(initialData?.lat?.toString() || '')
  const [lng, setLng] = useState(initialData?.lng?.toString() || '')

  const [area, setArea] = useState(initialData?.area || '')
  const [beds, setBeds] = useState(initialData?.beds || 0)
  const [baths, setBaths] = useState(initialData?.baths || 0)
  const [images, setImages] = useState<string[]>(initialData?.images || [])

  // State for non-db form fields from template template
  const [description, setDescription] = useState('')
  const [yearBuilt, setYearBuilt] = useState('')
  const [parking, setParking] = useState(0)

  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return

      const newImages = [...images]
      for (const file of Array.from(e.target.files)) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `property-images/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath)
        newImages.push(data.publicUrl)
      }
      setImages(newImages)
    } catch (error) {
      console.error('Error uploading image', error)
      alert('Error uploading image!')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove))
  }

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      title,
      price_numeric: priceNumeric ? Number(priceNumeric) : null,
      price_display: priceDisplay || `$${priceNumeric}`,
      is_rent: isRent,
      property_type: propertyType || null,
      slug:
        slug ||
        title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, ''),
      tag,
      tag_type: tagType || null,
      is_featured: isFeatured,
      is_active: isActive,
      location,
      lat: lat ? Number(lat) : 0,
      lng: lng ? Number(lng) : 0,
      area,
      beds,
      baths,
      images,
      // description, parking, yearBuilt omitted since not in DB interface yet
    }

    try {
      if (initialData?.id) {
        // Update
        const { error } = await supabase
          .from('properties')
          .update(payload)
          .eq('id', initialData.id)
        if (error) throw error
      } else {
        // Insert
        const { error } = await supabase.from('properties').insert([payload])
        if (error) throw error
      }
      router.push('/admin/properties')
      router.refresh()
    } catch (err) {
      console.error('Submission error:', err)
      alert('Failed to save property')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-background-light text-nordic-dark min-h-screen selection:bg-hint-green selection:text-nordic-dark font-sans pb-24 md:pb-0">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
          <div className="space-y-4">
            <nav aria-label="Breadcrumb" className="flex">
              <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
                <li>
                  <Link
                    href="/admin/properties"
                    className="hover:text-mosque transition-colors"
                  >
                    Properties
                  </Link>
                </li>
                <li>
                  <span className="material-symbols-outlined text-xs text-gray-400">
                    chevron_right
                  </span>
                </li>
                <li aria-current="page" className="text-nordic-dark">
                  {initialData ? 'Edit Property' : 'Add New'}
                </li>
              </ol>
            </nav>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-nordic-dark tracking-tight mb-2">
                {initialData ? 'Edit Property' : 'Add New Property'}
              </h1>
              <p className="text-base text-gray-500 max-w-2xl font-normal">
                Fill in the details below to {initialData ? 'update' : 'create'}{' '}
                a new listing. Fields marked with * are mandatory.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-nordic-dark hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50 h-fit"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-mosque hover:bg-nordic-dark text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm disabled:opacity-50 h-fit"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              Save Property
            </button>
          </div>
        </header>

        <form className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Main Column */}
          <div className="xl:col-span-8 space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-linear-to-r from-hint-green/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic-dark">
                  <span className="material-symbols-outlined text-lg">
                    info
                  </span>
                </div>
                <h2 className="text-xl font-bold text-nordic-dark">
                  Basic Information
                </h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="group">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-nordic-dark mb-1.5"
                  >
                    Property Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Modern Penthouse with Ocean View"
                    className="w-full text-base px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-nordic-dark mb-1.5"
                    >
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        id="price"
                        required
                        value={priceNumeric}
                        onChange={(e) => setPriceNumeric(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-7 pr-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-nordic-dark mb-1.5"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      value={isRent ? 'for-rent' : 'for-sale'}
                      onChange={(e) => setIsRent(e.target.value === 'for-rent')}
                      className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic-dark focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base cursor-pointer"
                    >
                      <option value="for-sale">For Sale</option>
                      <option value="for-rent">For Rent</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-nordic-dark mb-1.5"
                    >
                      Property Type
                    </label>
                    <select
                      id="type"
                      value={propertyType}
                      onChange={(e) =>
                        setPropertyType(e.target.value as PropertyType)
                      }
                      className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic-dark focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base cursor-pointer"
                    >
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="villa">Villa</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="condo">Condo</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="loft">Loft</option>
                      <option value="estate">Estate</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-linear-to-r from-hint-green/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic-dark">
                  <span className="material-symbols-outlined text-lg">
                    description
                  </span>
                </div>
                <h2 className="text-xl font-bold text-nordic-dark">Description</h2>
              </div>
              <div className="p-8">
                <div className="mb-3 flex gap-2 border-b border-gray-100 pb-2">
                  <button
                    type="button"
                    className="p-1.5 text-gray-400 hover:text-nordic-dark hover:bg-gray-50 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      format_bold
                    </span>
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-gray-400 hover:text-nordic-dark hover:bg-gray-50 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      format_italic
                    </span>
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-gray-400 hover:text-nordic-dark hover:bg-gray-50 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      format_list_bulleted
                    </span>
                  </button>
                </div>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the property features, neighborhood, and unique selling points..."
                  className="w-full px-4 py-3 rounded-md border border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base leading-relaxed resize-y min-h-[200px]"
                />
                <div className="mt-2 text-right text-xs text-gray-400">
                  {description.length} / 2000 characters
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-hint-green/30 flex justify-between items-center bg-linear-to-r from-hint-green/10 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic-dark">
                    <span className="material-symbols-outlined text-lg">
                      image
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-nordic-dark">Gallery</h2>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded">
                  JPG, PNG, WEBP
                </span>
              </div>
              <div className="p-8">
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 p-10 text-center hover:bg-hint-green/10 hover:border-mosque/40 transition-colors cursor-pointer group">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-mosque group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined text-2xl">
                        {uploading ? 'hourglass_empty' : 'cloud_upload'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-medium text-nordic-dark">
                        {uploading
                          ? 'Uploading...'
                          : 'Click or drag images here'}
                      </p>
                      <p className="text-xs text-gray-400">
                        Max file size 5MB per image
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg overflow-hidden relative group shadow-sm"
                    >
                      <Image
                        src={img}
                        alt={`Property image ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-nordic-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                        <button
                          onClick={() => removeImage(idx)}
                          type="button"
                          className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">
                            delete
                          </span>
                        </button>
                      </div>
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 bg-mosque text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                  <div className="aspect-square rounded-lg border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:text-mosque hover:border-mosque hover:bg-hint-green/10 transition-all cursor-pointer">
                    <span className="material-symbols-outlined">add</span>
                    <span className="text-[10px] mt-1 font-medium">
                      Add More
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-4 space-y-8">
            {/* Location */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-linear-to-r from-hint-green/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic-dark">
                  <span className="material-symbols-outlined text-lg">
                    place
                  </span>
                </div>
                <h2 className="text-lg font-bold text-nordic-dark">Location</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-nordic-dark mb-1.5"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Street Address, City, Zip"
                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="lat"
                      className="block text-sm font-medium text-nordic-dark mb-1.5"
                    >
                      Latitud
                    </label>
                    <input
                      type="number"
                      id="lat"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      placeholder="ej. -34.6037"
                      step="any"
                      className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lng"
                      className="block text-sm font-medium text-nordic-dark mb-1.5"
                    >
                      Longitud
                    </label>
                    <input
                      type="number"
                      id="lng"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      placeholder="ej. -58.3816"
                      step="any"
                      className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm"
                    />
                  </div>
                </div>
                {lat && lng && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng)) ? (
                  <div className="w-full mt-2">
                    <DynamicPropertyMap
                      lat={Number(lat)}
                      lng={Number(lng)}
                      address={location || 'Location Preview'}
                    />
                  </div>
                ) : (
                  <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS55FY7gfArnlTpNsdabJk9nBO5uQJgOwIsl8beO34JRZ9dMmjLoIkTuTUO72Y9L5tUmQqTReQWebUWadAWwLusGmRQiIict5sqY--yRaOxuYpTzfR4vv4RKh1ex6oxY64e0kbSeMudNO6pv-gG0WzVWs-pDfvQm5IoTQ1mT-tAV49LDkXAHZl317M1-D7eZw3N8o2ExKWTgg6oMAXOFVnkApIqnb7TZHekwSw8pWQxpJV2EKI8EQKQbQXJaSbjN8gB1n8b-ueWj8"
                      alt="Map view of city streets"
                      width={400}
                      height={200}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="bg-white/90 text-nordic-dark px-3 py-1.5 rounded shadow-sm backdrop-blur-sm text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-mosque">
                          map
                        </span>{' '}
                        Preview
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-linear-to-r from-hint-green/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic-dark">
                  <span className="material-symbols-outlined text-lg">
                    straighten
                  </span>
                </div>
                <h2 className="text-lg font-bold text-nordic-dark">Details</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label
                      htmlFor="area"
                      className="text-sm font-medium text-nordic-dark mb-1 block"
                    >
                      Area (m²)
                    </label>
                    <input
                      type="text"
                      id="area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="0"
                      className="w-full text-left px-3 py-2 border border-gray-200 rounded text-nordic-dark focus:ring-1 focus:ring-mosque transition-all text-sm"
                    />
                  </div>
                  <div className="group">
                    <label
                      htmlFor="year"
                      className="text-sm font-medium text-nordic-dark mb-1 block"
                    >
                      Year Built
                    </label>
                    <input
                      type="number"
                      id="year"
                      value={yearBuilt}
                      onChange={(e) => setYearBuilt(e.target.value)}
                      placeholder="YYYY"
                      className="w-full text-left px-3 py-2 border border-gray-200 rounded text-nordic-dark focus:ring-1 focus:ring-mosque transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="bedsInput"
                      className="text-sm font-medium text-nordic-dark flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-gray-400 text-sm">
                        bed
                      </span>{' '}
                      Bedrooms
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm h-8">
                      <button
                        onClick={() => setBeds(Math.max(0, beds - 1))}
                        type="button"
                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-200"
                      >
                        -
                      </button>
                      <input
                        id="bedsInput"
                        type="number"
                        readOnly
                        value={beds}
                        className="w-10 text-center border-none bg-transparent text-nordic-dark p-0 focus:ring-0 text-sm font-medium"
                      />
                      <button
                        onClick={() => setBeds(beds + 1)}
                        type="button"
                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="bathsInput"
                      className="text-sm font-medium text-nordic-dark flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-gray-400 text-sm">
                        shower
                      </span>{' '}
                      Bathrooms
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm h-8">
                      <button
                        onClick={() => setBaths(Math.max(0, baths - 1))}
                        type="button"
                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-200"
                      >
                        -
                      </button>
                      <input
                        id="bathsInput"
                        type="number"
                        readOnly
                        value={baths}
                        className="w-10 text-center border-none bg-transparent text-nordic-dark p-0 focus:ring-0 text-sm font-medium"
                      />
                      <button
                        onClick={() => setBaths(baths + 1)}
                        type="button"
                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="parkingInput"
                      className="text-sm font-medium text-nordic-dark flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-gray-400 text-sm">
                        directions_car
                      </span>{' '}
                      Parking
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm h-8">
                      <button
                        onClick={() => setParking(Math.max(0, parking - 1))}
                        type="button"
                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-200"
                      >
                        -
                      </button>
                      <input
                        id="parkingInput"
                        type="number"
                        readOnly
                        value={parking}
                        className="w-10 text-center border-none bg-transparent text-nordic-dark p-0 focus:ring-0 text-sm font-medium"
                      />
                      <button
                        onClick={() => setParking(parking + 1)}
                        type="button"
                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-nordic-dark mb-3 uppercase tracking-wider text-gray-500">
                    Amenities
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-mosque border border-gray-300 rounded focus:ring-mosque"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-nordic-dark transition-colors">
                        Swimming Pool
                      </span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-mosque border border-gray-300 rounded focus:ring-mosque"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-nordic-dark transition-colors">
                        Garden
                      </span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-mosque border border-gray-300 rounded focus:ring-mosque"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-nordic-dark transition-colors">
                        Air Conditioning
                      </span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-mosque border border-gray-300 rounded focus:ring-mosque"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-nordic-dark transition-colors">
                        Smart Home
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Visibility */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-linear-to-r from-hint-green/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic-dark">
                  <span className="material-symbols-outlined text-lg">visibility</span>
                </div>
                <h2 className="text-lg font-bold text-nordic-dark">Visibility</h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-4">
                  Hidden properties won&apos;t appear on the public site or search filters.
                </p>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200 ${
                    isActive
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                  }`}
                >
                  <span className="flex items-center gap-2 font-medium text-sm">
                    <span className="material-symbols-outlined text-lg">
                      {isActive ? 'visibility' : 'visibility_off'}
                    </span>
                    {isActive ? 'Published — Visible to users' : 'Hidden — Not visible publicly'}
                  </span>
                  <span
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      isActive ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                        isActive ? 'translate-x-4' : 'translate-x-1'
                      }`}
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-xl md:hidden z-40 flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/properties')}
              className="flex-1 py-3 rounded-lg border border-gray-300 bg-white text-nordic-dark font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-lg bg-mosque text-white font-medium flex justify-center items-center gap-2 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
