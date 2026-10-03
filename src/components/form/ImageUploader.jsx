import { ImagePlus, X } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import FieldShell from './FieldShell'

/**
 * Local-only multi-image picker with previews.
 * `images` items look like { id, file, previewUrl }.
 * Wiring these up to a real upload/storage backend is left for later.
 */
export default function ImageUploader({ images, onChange }) {
  const id = useId()
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const addFiles = (fileList) => {
    const newImages = Array.from(fileList)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }))

    if (newImages.length > 0) onChange([...images, ...newImages])
  }

  const removeImage = (id) => {
    const target = images.find((image) => image.id === id)
    if (target) URL.revokeObjectURL(target.previewUrl)
    onChange(images.filter((image) => image.id !== id))
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    addFiles(event.dataTransfer.files)
  }

  return (
    <FieldShell
      id={id}
      label="Imagens de inspiração"
      hint="Prints, fotos ou imagens que representam o estilo que você imagina. Pode enviar várias."
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
          isDragging
            ? 'border-accent-400 bg-accent-500/10'
            : 'border-white/15 bg-white/[0.03] hover:border-white/25'
        }`}
      >
        <ImagePlus className="h-6 w-6 text-white/40" />
        <p className="text-sm text-white/60">
          <span className="font-medium text-accent-300">Clique para enviar</span>{' '}
          ou arraste as imagens aqui
        </p>
        <p className="text-xs text-white/50">PNG, JPG ou WEBP</p>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          addFiles(event.target.files)
          event.target.value = ''
        }}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10"
            >
              <img
                src={image.previewUrl}
                alt={`Imagem de inspiração: ${image.file.name}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                aria-label="Remover imagem"
                className="absolute top-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </FieldShell>
  )
}
