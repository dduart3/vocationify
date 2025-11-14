import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas-pro'
import { useAuth } from '@/context/auth-context'

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
  const { profile } = useAuth()

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
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span className="text-sm">Generando PDF...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-blue-600" />
          <span className="text-sm">Descargar PDF</span>
        </>
      )}
    </button>
  )
}