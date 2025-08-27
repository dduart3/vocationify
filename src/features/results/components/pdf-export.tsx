import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas-pro'
import { useAuthStore } from '@/stores/auth-store'

interface PDFExportProps {
  contentId: string
  fileName?: string
  title?: string
  disabled?: boolean
}

export function PDFExport({ 
  contentId, 
  fileName = 'resultados-vocacionales', 
  title = 'Resultados del Test Vocacional',
  disabled = false 
}: PDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { profile } = useAuthStore()

  const generatePDF = async () => {
    setIsGenerating(true)
    
    try {
      const element = document.getElementById(contentId)
      if (!element) {
        throw new Error('No se pudo encontrar el contenido para exportar')
      }

      // Use html2canvas-pro which supports modern CSS
      const canvas = await html2canvas(element, {
        allowTaint: true,
        useCORS: true,
        scale: 2, // Higher quality
        width: element.scrollWidth, // Full width
        height: element.scrollHeight, // Full height 
        x: 0, // Start from left edge
        y: 0, // Start from top edge
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        backgroundColor: '#0f172a', // Dark background like your app
        logging: false,
        ignoreElements: (element) => {
          // Skip PDF button
          return !!(element.tagName === 'BUTTON' && 
                 (element.textContent?.includes('PDF') || 
                  element.textContent?.includes('Descargar')))
        }
      })

      // Create PDF with beautiful title page
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = 210
      const pdfHeight = 297

      // Add beautiful title page
      pdf.setFillColor(26, 26, 26) // Dark background
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F')
      
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(24)
      pdf.text(title, pdfWidth/2, 50, { align: 'center' })
      
      // Add user's name if available
      if (profile?.first_name || profile?.last_name) {
        const userName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
        pdf.setFontSize(16)
        pdf.text(userName, pdfWidth/2, 70, { align: 'center' })
        
        pdf.setFontSize(12)
        const date = new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
        pdf.text('Generado el: ' + date, pdfWidth/2, 90, { align: 'center' })
      } else {
        pdf.setFontSize(12)
        const date = new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
        pdf.text('Generado el: ' + date, pdfWidth/2, 70, { align: 'center' })
      }
      
      // Add company/app info
      pdf.setFontSize(16)
      pdf.text('Vocationify', pdfWidth/2, 250, { align: 'center' })
      pdf.setFontSize(10)
      pdf.text('Tu guía para encontrar la carrera perfecta', pdfWidth/2, 260, { align: 'center' })

      // Add new page for content
      pdf.addPage()
      
      // Calculate dimensions to show all content while maximizing page usage
      const scaleToWidth = pdfWidth / canvas.width
      const scaleToHeight = pdfHeight / canvas.height
      const scale = Math.min(scaleToWidth, scaleToHeight) // Use smaller scale to show all content
      
      const imgWidth = canvas.width * scale
      const imgHeight = canvas.height * scale
      
      // Center the content on the page
      const x = (pdfWidth - imgWidth) / 2
      const y = (pdfHeight - imgHeight) / 2
      
      // Fill the background with the same dark color
      pdf.setFillColor(15, 23, 42) // Same as backgroundColor #0f172a
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F')
      
      // Add the content centered on the page
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', x, y, imgWidth, imgHeight)

      // Save the PDF
      const timestamp = new Date().toISOString().slice(0, 10)
      pdf.save(`${fileName}-${timestamp}.pdf`)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      onClick={generatePDF}
      disabled={disabled || isGenerating}
      className="inline-flex items-center gap-3 px-6 py-3 rounded-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:bg-white/15 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold"
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(59, 130, 246, 0.1) 0%, 
            rgba(37, 99, 235, 0.1) 100%
          )
        `,
        boxShadow: `
          0 2px 8px 0 rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.05),
          0 0 0 1px rgba(255, 255, 255, 0.1)
        `
      }}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generando PDF...</span>
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          <span>Descargar PDF</span>
        </>
      )}
    </button>
  )
}