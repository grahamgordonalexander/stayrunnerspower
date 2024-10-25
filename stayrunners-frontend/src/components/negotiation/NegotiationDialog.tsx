// src/components/negotiation/NegotiationDialog.tsx
'use client'

import { useState } from 'react'
import { Dialog } from '@/components/ui/dialog'

interface NegotiationDialogProps {
  isOpen: boolean
  onClose: () => void
  currentOffer: number
  onAccept: () => void
  onCounter: (amount: number) => void
  onReject: () => void
}

export default function NegotiationDialog({
  isOpen,
  onClose,
  currentOffer,
  onAccept,
  onCounter,
  onReject,
}: NegotiationDialogProps) {
  const [counterOffer, setCounterOffer] = useState(currentOffer)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-medium">Current Offer: ${currentOffer}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Counter Offer</label>
            <input
              type="number"
              value={counterOffer}
              onChange={(e) => setCounterOffer(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => onAccept()}
              className="flex-1 py-2 bg-green-500 text-white rounded-md"
            >
              Accept
            </button>
            <button
              onClick={() => onCounter(counterOffer)}
              className="flex-1 py-2 bg-blue-500 text-white rounded-md"
            >
              Counter
            </button>
            <button
              onClick={() => onReject()}
              className="flex-1 py-2 bg-red-500 text-white rounded-md"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
