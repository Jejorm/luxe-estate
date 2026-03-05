'use client'

import dynamic from 'next/dynamic'

export const DynamicPropertyMap = dynamic(
  () => import('./PropertyMap').then((mod) => mod.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[4/3] bg-slate-100 rounded-lg animate-pulse" />
    ),
  },
)
