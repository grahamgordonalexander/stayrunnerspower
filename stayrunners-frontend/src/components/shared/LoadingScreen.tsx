// src/components/shared/LoadingScreen.tsx
import LoadingSpinner from './LoadingSpinner'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
