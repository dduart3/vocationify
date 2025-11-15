import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'
import { useAuth } from '@/context/auth-context'
import type { TestResult } from '../types'

interface PDFExportProps {
  testResult?: TestResult
  fileName?: string
  title?: string
  disabled?: boolean
}

export function PDFExport({
  testResult,
  fileName = 'resultados-vocacionales',
  disabled = false
}: PDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { profile } = useAuth()

  const generatePDF = async () => {
    if (!testResult) {
      alert('No hay datos del test disponibles para exportar')
      return
    }

    setIsGenerating(true)

    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = 210
      const pageHeight = 297
      const margin = 25
      const contentWidth = pageWidth - (margin * 2)
      let yPosition = margin

      // Primary brand color - professional blue
      const primaryColor: [number, number, number] = [41, 98, 255]
      const darkGray: [number, number, number] = [51, 51, 51]
      const lightGray: [number, number, number] = [128, 128, 128]
      const veryLightGray: [number, number, number] = [245, 245, 245]

      // Helper to check and add page
      const checkAddPage = (neededSpace: number) => {
        if (yPosition + neededSpace > pageHeight - margin - 10) {
          pdf.addPage()
          yPosition = margin
          return true
        }
        return false
      }

      // ========== PAGE 1: ELEGANT COVER PAGE ==========
      // Clean white background
      pdf.setFillColor(255, 255, 255)
      pdf.rect(0, 0, pageWidth, pageHeight, 'F')

      // Minimal top accent bar
      pdf.setFillColor(...primaryColor)
      pdf.rect(0, 0, pageWidth, 3, 'F')

      // Logo/Brand area
      pdf.setFontSize(11)
      pdf.setTextColor(...primaryColor)
      pdf.setFont('helvetica', 'bold')
      pdf.text('VOCATIONIFY', margin, 20)

      // Main title - centered and elegant
      yPosition = 90
      pdf.setFontSize(28)
      pdf.setTextColor(...darkGray)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Informe de Orientación', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 12
      pdf.text('Vocacional', pageWidth / 2, yPosition, { align: 'center' })

      // Thin decorative line
      yPosition += 15
      pdf.setDrawColor(...lightGray)
      pdf.setLineWidth(0.3)
      pdf.line(pageWidth / 2 - 30, yPosition, pageWidth / 2 + 30, yPosition)

      // User name
      yPosition += 15
      if (profile?.first_name || profile?.last_name) {
        const userName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
        pdf.setFontSize(16)
        pdf.setTextColor(...darkGray)
        pdf.setFont('helvetica', 'normal')
        pdf.text(userName, pageWidth / 2, yPosition, { align: 'center' })
      }

      // Date
      yPosition += 12
      const date = new Date(testResult.completed_at || testResult.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      pdf.setFontSize(10)
      pdf.setTextColor(...lightGray)
      pdf.text(date, pageWidth / 2, yPosition, { align: 'center' })

      // Footer - minimal and elegant
      pdf.setFontSize(9)
      pdf.setTextColor(...lightGray)
      pdf.text('Sistema de Orientación Vocacional con IA', pageWidth / 2, pageHeight - 20, { align: 'center' })

      // ========== PAGE 2: CONFIDENCE & RIASEC ==========
      pdf.addPage()
      yPosition = margin

      // Page title
      pdf.setFontSize(20)
      pdf.setTextColor(...darkGray)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Resumen Ejecutivo', margin, yPosition)
      yPosition += 15

      // Confidence section
      pdf.setFontSize(12)
      pdf.setTextColor(...primaryColor)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Nivel de Confianza', margin, yPosition)
      yPosition += 8

      const confidence = testResult.confidence_level || 0

      // Clean progress bar
      pdf.setFillColor(...veryLightGray)
      pdf.rect(margin, yPosition, contentWidth, 12, 'F')
      pdf.setFillColor(...primaryColor)
      pdf.rect(margin, yPosition, (contentWidth * confidence) / 100, 12, 'F')

      // Percentage text
      pdf.setFontSize(11)
      pdf.setTextColor(255, 255, 255)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${confidence}%`, margin + 5, yPosition + 8)
      yPosition += 18

      // Explanation
      pdf.setFontSize(9)
      pdf.setTextColor(...lightGray)
      pdf.setFont('helvetica', 'normal')
      const confText = `Este test ha determinado tus preferencias vocacionales con un ${confidence}% de confianza, basándose en tus respuestas y el análisis de tu perfil RIASEC.`
      const confLines = pdf.splitTextToSize(confText, contentWidth)
      pdf.text(confLines, margin, yPosition)
      yPosition += (confLines.length * 4) + 12

      // RIASEC Profile section
      pdf.setFontSize(12)
      pdf.setTextColor(...primaryColor)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Tu Perfil RIASEC', margin, yPosition)
      yPosition += 8

      pdf.setFontSize(9)
      pdf.setTextColor(...lightGray)
      pdf.setFont('helvetica', 'normal')
      pdf.text('El modelo RIASEC identifica seis tipos de personalidad vocacional:', margin, yPosition)
      yPosition += 10

      const riasecTypes = {
        R: { name: 'Realista', desc: 'Personas prácticas que disfrutan trabajar con sus manos y resolver problemas concretos.' },
        I: { name: 'Investigativo', desc: 'Pensadores analíticos que disfrutan resolver problemas complejos y aprender.' },
        A: { name: 'Artístico', desc: 'Creativos e innovadores que valoran la expresión personal y la originalidad.' },
        S: { name: 'Social', desc: 'Personas empáticas que disfrutan ayudar y trabajar con otros.' },
        E: { name: 'Emprendedor', desc: 'Líderes persuasivos que disfrutan tomar decisiones y gestionar proyectos.' },
        C: { name: 'Convencional', desc: 'Organizados y detallistas que valoran la estructura y el orden.' }
      }

      const sortedScores = Object.entries(testResult.riasec_scores)
        .sort(([, a], [, b]) => b - a)

      const barColors: Record<string, [number, number, number]> = {
        R: [34, 197, 94],
        I: [59, 130, 246],
        A: [168, 85, 247],
        S: [249, 115, 22],
        E: [234, 179, 8],
        C: [6, 182, 212]
      }

      sortedScores.forEach(([key, value]) => {
        const type = riasecTypes[key as keyof typeof riasecTypes]
        checkAddPage(25)

        // Normalize score: if value > 5, it's a percentage (0-100), otherwise it's out of 5
        const isPercentage = value > 5
        const normalizedScore = isPercentage ? value : (value * 20) // Convert to percentage
        const displayScore = isPercentage ? `${value}%` : `${value.toFixed(1)}/5`

        // Type name and score on same line
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(10)
        pdf.setTextColor(...darkGray)
        pdf.text(`${type.name} (${key})`, margin, yPosition)

        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(...lightGray)
        pdf.setFontSize(9)
        pdf.text(displayScore, pageWidth - margin, yPosition, { align: 'right' })
        yPosition += 5

        // Progress bar - more subtle, always based on percentage (0-100)
        const barWidth = contentWidth - 5
        pdf.setFillColor(240, 240, 240)
        pdf.rect(margin, yPosition, barWidth, 4, 'F')
        pdf.setFillColor(...(barColors[key] || primaryColor))
        pdf.rect(margin, yPosition, (barWidth * normalizedScore) / 100, 4, 'F')
        yPosition += 7

        // Description - properly spaced
        pdf.setFontSize(8)
        pdf.setTextColor(...lightGray)
        const descLines = pdf.splitTextToSize(type.desc, contentWidth - 5)
        pdf.text(descLines, margin, yPosition)
        yPosition += (descLines.length * 3.5) + 6
      })

      // ========== PAGE 3: CAREER RECOMMENDATIONS ==========
      pdf.addPage()
      yPosition = margin

      pdf.setFontSize(20)
      pdf.setTextColor(...darkGray)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Recomendaciones de Carreras', margin, yPosition)
      yPosition += 15

      pdf.setFontSize(12)
      pdf.setTextColor(...primaryColor)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Carreras Sugeridas', margin, yPosition)
      yPosition += 8

      if (testResult.career_recommendations && testResult.career_recommendations.length > 0) {
        pdf.setFontSize(9)
        pdf.setTextColor(...lightGray)
        pdf.setFont('helvetica', 'normal')
        const introText = `Basándonos en tu perfil RIASEC, hemos identificado ${testResult.career_recommendations.length} carreras que mejor se ajustan a tus intereses:`
        const introLines = pdf.splitTextToSize(introText, contentWidth)
        pdf.text(introLines, margin, yPosition)
        yPosition += (introLines.length * 4) + 10

        testResult.career_recommendations.forEach((career: any, index: number) => {
          checkAddPage(35)

          const careerName = career.career?.name || career.name || career.career_name || career.title || 'Carrera sin nombre'
          const matchPercentage = career.confidence || career.match || career.score || 0
          const description = career.reasoning || career.career?.description || career.description || ''

          // Determine color based on compatibility percentage
          let matchColor: [number, number, number]
          if (matchPercentage >= 80) {
            matchColor = [34, 197, 94] // Green for high match (80-100%)
          } else if (matchPercentage >= 60) {
            matchColor = [234, 179, 8] // Yellow for good match (60-79%)
          } else if (matchPercentage >= 40) {
            matchColor = [249, 115, 22] // Orange for moderate match (40-59%)
          } else {
            matchColor = [128, 128, 128] // Gray for low match (0-39%)
          }

          // Calculate box height based on description length
          let boxHeight = 12 // Base height for name and percentage
          if (description) {
            const descLines = pdf.splitTextToSize(description, contentWidth - 20)
            boxHeight += (descLines.length * 3.5) + 3 // Add space for description
          }

          // Light gray box for each career
          pdf.setFillColor(...veryLightGray)
          pdf.rect(margin, yPosition, contentWidth, boxHeight, 'F')

          // Number badge - minimal circle
          pdf.setFillColor(...primaryColor)
          pdf.circle(margin + 6, yPosition + 6, 4, 'F')
          pdf.setTextColor(255, 255, 255)
          pdf.setFontSize(9)
          pdf.setFont('helvetica', 'bold')
          pdf.text((index + 1).toString(), margin + 6, yPosition + 7.5, { align: 'center' })

          // Career name - proper spacing
          pdf.setTextColor(...darkGray)
          pdf.setFontSize(11)
          pdf.setFont('helvetica', 'bold')
          const nameLines = pdf.splitTextToSize(careerName, contentWidth - 60)
          pdf.text(nameLines, margin + 14, yPosition + 7)

          // Match percentage - color-coded based on match quality
          pdf.setTextColor(...matchColor)
          pdf.setFontSize(9)
          pdf.setFont('helvetica', 'bold')
          pdf.text(`${matchPercentage}% compatibilidad`, pageWidth - margin - 5, yPosition + 7, { align: 'right' })

          // Description if available - show full description
          if (description) {
            pdf.setFontSize(8)
            pdf.setTextColor(...lightGray)
            pdf.setFont('helvetica', 'normal')
            const descLines = pdf.splitTextToSize(description, contentWidth - 20)
            pdf.text(descLines, margin + 14, yPosition + 13)
          }

          yPosition += boxHeight + 5
        })
      } else {
        pdf.setFontSize(9)
        pdf.setTextColor(...lightGray)
        pdf.text('No se encontraron recomendaciones de carreras específicas.', margin, yPosition)
      }

      // ========== PAGE 4: PERSONALITY (IF EXISTS) ==========
      if (testResult.personality_description) {
        pdf.addPage()
        yPosition = margin

        pdf.setFontSize(20)
        pdf.setTextColor(...darkGray)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Tu Perfil de Personalidad', margin, yPosition)
        yPosition += 15

        pdf.setFontSize(12)
        pdf.setTextColor(...primaryColor)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Descripción Personalizada', margin, yPosition)
        yPosition += 10

        pdf.setFontSize(10)
        pdf.setTextColor(...darkGray)
        pdf.setFont('helvetica', 'normal')
        const persLines = pdf.splitTextToSize(testResult.personality_description, contentWidth)

        persLines.forEach((line: string) => {
          checkAddPage(6)
          pdf.text(line, margin, yPosition)
          yPosition += 6
        })
      }

      // ========== FINAL PAGE: NEXT STEPS ==========
      pdf.addPage()
      yPosition = margin

      pdf.setFontSize(20)
      pdf.setTextColor(...darkGray)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Próximos Pasos', margin, yPosition)
      yPosition += 15

      pdf.setFontSize(12)
      pdf.setTextColor(...primaryColor)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Recomendaciones para tu Futuro', margin, yPosition)
      yPosition += 10

      const recommendations = [
        'Investiga a fondo las carreras recomendadas y sus planes de estudio.',
        'Habla con profesionales que trabajen en estas áreas para conocer la realidad del campo.',
        'Considera realizar prácticas o voluntariados relacionados con estas carreras.',
        'Evalúa las instituciones educativas que ofrecen estos programas.',
        'Reflexiona sobre tus metas a largo plazo y cómo estas carreras se alinean con ellas.',
        'No tengas miedo de explorar y cambiar de opinión; la orientación vocacional es un proceso continuo.'
      ]

      pdf.setFontSize(10)
      pdf.setTextColor(...darkGray)
      pdf.setFont('helvetica', 'normal')

      recommendations.forEach((rec, index) => {
        checkAddPage(12)
        const recLines = pdf.splitTextToSize(`${index + 1}. ${rec}`, contentWidth - 5)
        pdf.text(recLines, margin, yPosition)
        yPosition += (recLines.length * 5) + 4
      })

      yPosition += 10
      checkAddPage(25)

      // Elegant info box
      pdf.setFillColor(240, 249, 255)
      pdf.rect(margin, yPosition, contentWidth, 22, 'F')

      pdf.setFontSize(10)
      pdf.setTextColor(...primaryColor)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Recuerda', margin + 5, yPosition + 7)

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(...darkGray)
      const footerText = 'Este informe es una guía basada en tus intereses actuales. Tus preferencias pueden evolucionar con el tiempo, y eso está bien. Mantén una mente abierta y sigue explorando.'
      const footerLines = pdf.splitTextToSize(footerText, contentWidth - 10)
      pdf.text(footerLines, margin + 5, yPosition + 13)

      // Add page numbers to all pages except cover
      const pageCount = pdf.getNumberOfPages()
      for (let i = 2; i <= pageCount; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.setTextColor(...lightGray)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 15, { align: 'center' })
      }

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
      disabled={disabled || isGenerating || !testResult}
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
          <span className="text-sm">Descargar Informe PDF</span>
        </>
      )}
    </button>
  )
}
