'use client'
 
import { useFormStatus } from 'react-dom'
 
export function SubmitButton() {
  const { pending } = useFormStatus()
 
  return (
    <button aria-disabled={pending} type="submit" className="bg-indigo-500 py-2 px-3 text-white rounded">
      {pending ? 'Pending....' : 'Add Todo'}
    </button>
  )
}