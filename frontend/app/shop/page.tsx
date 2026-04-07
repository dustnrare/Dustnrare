import { Suspense } from 'react'
import ShopContent from './ShopContent'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  )
}