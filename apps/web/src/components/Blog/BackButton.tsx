'use client'

import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <button 
      onClick={handleBack}
      className="flex items-center text-blue-500 hover:text-blue-700 mb-4 transition-colors font-bold"
    >
      ← Back to Blog Posts
    </button>
  )
}