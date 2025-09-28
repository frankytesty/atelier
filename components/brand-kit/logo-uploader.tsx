"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Link, X, ImageIcon } from "lucide-react"

interface LogoUploaderProps {
  currentLogoUrl: string
  onLogoChange: (url: string) => void
}

export function LogoUploader({ currentLogoUrl, onLogoChange }: LogoUploaderProps) {
  const [urlInput, setUrlInput] = useState(currentLogoUrl)
  const [isUploading, setIsUploading] = useState(false)

  const handleUrlSubmit = () => {
    onLogoChange(urlInput)
  }

  const handleRemoveLogo = () => {
    setUrlInput("")
    onLogoChange("")
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // Hier würde normalerweise der Upload zu Supabase Storage erfolgen
      // Für jetzt verwenden wir eine Placeholder-URL
      const placeholderUrl = `/placeholder.svg?height=100&width=200&query=logo`
      setUrlInput(placeholderUrl)
      onLogoChange(placeholderUrl)
    } catch (error) {
      console.error("Upload-Fehler:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Label className="text-charcoal-700">Logo</Label>

      {/* Aktuelle Logo-Anzeige */}
      {currentLogoUrl && (
        <Card className="border-sage-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-sage-50 rounded-lg border border-sage-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={currentLogoUrl || "/placeholder.svg"}
                    alt="Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal-900">Aktuelles Logo</p>
                  <p className="text-xs text-sage-600 break-all">{currentLogoUrl}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveLogo}
                className="text-red-600 hover:bg-red-50 border-red-200 bg-transparent"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload-Optionen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Datei-Upload */}
        <Card className="border-sage-200">
          <CardContent className="p-4">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6 text-sage-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-charcoal-900">Datei hochladen</p>
                <p className="text-xs text-sage-600">PNG, JPG oder SVG (max. 2MB)</p>
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="logo-upload"
                />
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  className="border-sage-200 bg-transparent"
                >
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    {isUploading ? "Wird hochgeladen..." : "Datei auswählen"}
                  </label>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* URL-Eingabe */}
        <Card className="border-sage-200">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Link className="w-6 h-6 text-sage-600" />
                </div>
                <p className="text-sm font-medium text-charcoal-900">URL verwenden</p>
                <p className="text-xs text-sage-600">Link zu einem bestehenden Logo</p>
              </div>
              <div className="space-y-2">
                <Input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://beispiel.de/logo.png"
                  className="border-sage-200 focus:border-gold-400"
                />
                <Button
                  onClick={handleUrlSubmit}
                  variant="outline"
                  size="sm"
                  className="w-full border-sage-200 bg-transparent"
                  disabled={!urlInput || urlInput === currentLogoUrl}
                >
                  URL verwenden
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hinweise */}
      <div className="p-3 bg-sage-50 border border-sage-200 rounded-lg">
        <div className="flex gap-2">
          <ImageIcon className="w-4 h-4 text-sage-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-sage-600 space-y-1">
            <p>
              <strong>Empfohlene Logo-Spezifikationen:</strong>
            </p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Format: PNG mit transparentem Hintergrund oder SVG</li>
              <li>Mindestgröße: 200x100 Pixel</li>
              <li>Seitenverhältnis: 2:1 oder quadratisch</li>
              <li>Dateigröße: Unter 2MB für optimale Ladezeiten</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
