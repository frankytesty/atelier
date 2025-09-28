"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Download, FileText, FileSpreadsheet, FileImage, Calendar } from "lucide-react"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stats: any
  monthlyTrends: any[]
  timeRange: string
}

export function ExportDialog({ open, onOpenChange, timeRange }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState("pdf")
  const [selectedData, setSelectedData] = useState({
    overview: true,
    revenue: true,
    orders: true,
    conversion: true,
    microsites: false,
  })
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, this would generate and download the file
      const filename = `analytics-report-${new Date().toISOString().split("T")[0]}.${exportFormat}`
      console.log("Exporting:", { filename, format: exportFormat, data: selectedData })

      // Create mock download
      const element = document.createElement("a")
      element.href = "data:text/plain;charset=utf-8," + encodeURIComponent("Analytics Report Data")
      element.download = filename
      element.style.display = "none"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      onOpenChange(false)
    } catch (error) {
      console.error("Export error:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const formatOptions = [
    { value: "pdf", label: "PDF Report", icon: FileText, description: "Vollständiger Bericht mit Charts" },
    { value: "xlsx", label: "Excel Datei", icon: FileSpreadsheet, description: "Rohdaten für weitere Analyse" },
    { value: "png", label: "PNG Bilder", icon: FileImage, description: "Charts als Bilddateien" },
  ]

  const dataOptions = [
    { key: "overview", label: "Übersicht & Metriken", description: "Grundlegende Statistiken und KPIs" },
    { key: "revenue", label: "Umsatz-Daten", description: "Umsatzentwicklung und Trends" },
    { key: "orders", label: "Bestellungen & Angebote", description: "Bestellhistorie und Angebotsdaten" },
    { key: "conversion", label: "Conversion-Analyse", description: "Funnel und Conversion-Raten" },
    { key: "microsites", label: "Microsite-Analytics", description: "Website-Besuche und Performance" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-charcoal-900 flex items-center">
            <Download className="w-5 h-5 mr-2 text-gold-600" />
            Analytics Daten exportieren
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format */}
          <div className="space-y-3">
            <Label className="text-charcoal-700 font-medium">Export Format</Label>
            <div className="grid grid-cols-1 gap-3">
              {formatOptions.map((format) => {
                const Icon = format.icon
                return (
                  <div
                    key={format.value}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      exportFormat === format.value
                        ? "border-gold-300 bg-gold-50"
                        : "border-sage-200 hover:border-sage-300"
                    }`}
                    onClick={() => setExportFormat(format.value)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-sage-600" />
                      <div>
                        <p className="font-medium text-charcoal-900">{format.label}</p>
                        <p className="text-sm text-sage-600">{format.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Data Selection */}
          <div className="space-y-3">
            <Label className="text-charcoal-700 font-medium">Daten auswählen</Label>
            <div className="space-y-3">
              {dataOptions.map((option) => (
                <div key={option.key} className="flex items-start space-x-3">
                  <Checkbox
                    id={option.key}
                    checked={selectedData[option.key as keyof typeof selectedData]}
                    onCheckedChange={(checked) => setSelectedData((prev) => ({ ...prev, [option.key]: checked }))}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <Label htmlFor={option.key} className="text-charcoal-900 font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-sage-600">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Range Info */}
          <div className="p-4 bg-sage-50 rounded-lg border border-sage-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-sage-600" />
              <span className="text-sm font-medium text-charcoal-900">Zeitraum</span>
            </div>
            <p className="text-sm text-sage-600">
              Der Export umfasst Daten für:{" "}
              {timeRange === "30days"
                ? "die letzten 30 Tage"
                : timeRange === "3months"
                  ? "die letzten 3 Monate"
                  : timeRange === "6months"
                    ? "die letzten 6 Monate"
                    : "die letzten 12 Monate"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-sage-200">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
              Abbrechen
            </Button>
            <Button onClick={handleExport} disabled={isExporting} className="bg-gold-600 hover:bg-gold-700">
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Wird exportiert..." : "Exportieren"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
