"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MoreHorizontal, Edit, Trash2, Send, Download, Copy, Eye, Mail } from "lucide-react"

interface Quote {
  id: string
  quote_number: string
  status: string
  client_name: string
  client_email: string
}

interface QuoteActionsProps {
  quote: Quote
}

export function QuoteActions({ quote }: QuoteActionsProps) {
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)
  const [emailSubject, setEmailSubject] = useState(`Ihr Angebot ${quote.quote_number}`)
  const [emailMessage, setEmailMessage] = useState("")

  const handleSendQuote = async () => {
    // TODO: API-Aufruf zum Angebot senden
    console.log("Send quote:", { emailSubject, emailMessage })
    setIsSendDialogOpen(false)
  }

  const handleDownloadPDF = async () => {
    // TODO: PDF-Download implementieren
    console.log("Download PDF for quote:", quote.id)
  }

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/quote/${quote.id}`
    await navigator.clipboard.writeText(link)
    // TODO: Toast notification
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <a href={`/partner/quotes/${quote.id}`} className="flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Anzeigen
            </a>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <a href={`/partner/quotes/${quote.id}/edit`} className="flex items-center">
              <Edit className="w-4 h-4 mr-2" />
              Bearbeiten
            </a>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {quote.status === "draft" && (
            <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Send className="w-4 h-4 mr-2" />
                  An Kunde senden
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl text-charcoal-900">Angebot senden</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>An: {quote.client_name}</Label>
                    <p className="text-sm text-sage-600">{quote.client_email}</p>
                  </div>

                  <div>
                    <Label htmlFor="email-subject">Betreff</Label>
                    <Input
                      id="email-subject"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="border-sage-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email-message">Nachricht</Label>
                    <Textarea
                      id="email-message"
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      className="border-sage-200"
                      placeholder="Persönliche Nachricht an den Kunden..."
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setIsSendDialogOpen(false)}
                    >
                      Abbrechen
                    </Button>
                    <Button onClick={handleSendQuote} className="flex-1 bg-gold-600 hover:bg-gold-700">
                      Senden
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          <DropdownMenuItem onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            PDF herunterladen
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleCopyLink}>
            <Copy className="w-4 h-4 mr-2" />
            Link kopieren
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Mail className="w-4 h-4 mr-2" />
            E-Mail senden
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-red-600">
            <Trash2 className="w-4 h-4 mr-2" />
            Löschen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
