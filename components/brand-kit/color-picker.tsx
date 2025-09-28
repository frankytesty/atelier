"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Palette } from "lucide-react"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  label?: string
}

const PRESET_COLORS = [
  "#D4AF37", // Gold
  "#8B7355", // Sage
  "#F5F5DC", // Beige
  "#2C3E50", // Dark Blue
  "#E8E8E8", // Light Gray
  "#8B4513", // Brown
  "#556B2F", // Olive
  "#CD853F", // Peru
  "#DDA0DD", // Plum
  "#F0E68C", // Khaki
  "#B0C4DE", // Light Steel Blue
  "#FFB6C1", // Light Pink
]

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(color)

  const handleColorChange = (newColor: string) => {
    setInputValue(newColor)
    onChange(newColor)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
      onChange(value)
    }
  }

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full h-12 border-sage-200 justify-start gap-3 bg-transparent">
            <div className="w-6 h-6 rounded border border-sage-300 shadow-sm" style={{ backgroundColor: color }} />
            <span className="font-mono text-sm">{color}</span>
            <Palette className="w-4 h-4 ml-auto text-sage-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-charcoal-700">Hex-Code</label>
              <Input value={inputValue} onChange={handleInputChange} placeholder="#000000" className="font-mono" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-charcoal-700">Farbauswahl</label>
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full h-10 rounded border border-sage-200 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-charcoal-700">Vorgaben</label>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_COLORS.map((presetColor) => (
                  <button
                    key={presetColor}
                    type="button"
                    onClick={() => handleColorChange(presetColor)}
                    className="w-8 h-8 rounded border border-sage-200 shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: presetColor }}
                    title={presetColor}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {label && <p className="text-xs text-sage-600">{label}</p>}
    </div>
  )
}
