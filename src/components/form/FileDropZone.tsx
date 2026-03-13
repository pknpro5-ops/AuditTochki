'use client'

import { useState, useRef, useCallback } from 'react'
import { UploadCloudIcon } from '@/components/ui/Icons'

interface FileDropZoneProps {
  onFileChange: (file: File | null) => void
  uploadedFileName: string | null
  error?: string
}

export function FileDropZone({ onFileChange, uploadedFileName, error }: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [localError, setLocalError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): boolean => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowed.includes(file.type)) {
      setLocalError('Допустимы только PDF, JPG, PNG')
      return false
    }
    if (file.size > 10 * 1024 * 1024) {
      setLocalError('Файл слишком большой. Максимум 10 МБ.')
      return false
    }
    setLocalError('')
    return true
  }, [])

  const handleFile = useCallback((file: File) => {
    if (validateFile(file)) {
      onFileChange(file)
    }
  }, [validateFile, onFileChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const displayError = error || localError

  return (
    <div>
      <div
        className={`dropzone ${isDragOver ? 'drag-over' : ''} ${displayError ? 'border-red-400' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
          className="hidden"
        />
        {uploadedFileName ? (
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-green-600">{uploadedFileName}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onFileChange(null)
                if (inputRef.current) inputRef.current.value = ''
              }}
              className="text-xs text-[var(--muted-foreground)] hover:text-red-500 underline"
            >
              Удалить
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <UploadCloudIcon className="mx-auto text-[var(--muted-foreground)]" size={36} />
            <p className="text-sm font-medium">Перетащите файл сюда или нажмите</p>
            <p className="text-xs text-[var(--muted-foreground)]">PDF, JPG, PNG до 10 МБ</p>
          </div>
        )}
      </div>
      {displayError && (
        <p className="mt-1.5 text-xs text-red-500">{displayError}</p>
      )}
    </div>
  )
}
