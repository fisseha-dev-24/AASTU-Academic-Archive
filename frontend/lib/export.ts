import { apiClient } from './api'
import { toast } from 'sonner'

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json'
  filename?: string
  includeHeaders?: boolean
  dateFormat?: string
  filters?: Record<string, any>
  columns?: string[]
  orientation?: 'portrait' | 'landscape'
  pageSize?: 'A4' | 'Letter' | 'Legal'
}

export interface ExportData {
  headers: string[]
  rows: any[][]
  metadata?: Record<string, any>
}

class ExportService {
  private defaultOptions: ExportOptions = {
    format: 'csv',
    includeHeaders: true,
    dateFormat: 'YYYY-MM-DD',
    orientation: 'portrait',
    pageSize: 'A4',
  }

  async exportData(
    type: string,
    data: ExportData,
    options: Partial<ExportOptions> = {}
  ): Promise<void> {
    const exportOptions = { ...this.defaultOptions, ...options }
    
    try {
      switch (exportOptions.format) {
        case 'csv':
          await this.exportToCSV(data, exportOptions)
          break
        case 'excel':
          await this.exportToExcel(data, exportOptions)
          break
        case 'pdf':
          await this.exportToPDF(data, exportOptions)
          break
        case 'json':
          await this.exportToJSON(data, exportOptions)
          break
        default:
          throw new Error(`Unsupported export format: ${exportOptions.format}`)
      }
      
      toast.success(`Data exported successfully as ${exportOptions.format.toUpperCase()}`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export failed. Please try again.')
      throw error
    }
  }

  async exportFromAPI(
    endpoint: string,
    options: Partial<ExportOptions> = {}
  ): Promise<void> {
    const exportOptions = { ...this.defaultOptions, ...options }
    
    try {
      const blob = await apiClient.exportData(endpoint, exportOptions.filters)
      const filename = this.generateFilename(endpoint, exportOptions)
      
      this.downloadBlob(blob, filename)
      toast.success(`Data exported successfully as ${exportOptions.format.toUpperCase()}`)
    } catch (error) {
      console.error('API export error:', error)
      toast.error('Export failed. Please try again.')
      throw error
    }
  }

  private async exportToCSV(data: ExportData, options: ExportOptions): Promise<void> {
    let csvContent = ''
    
    if (options.includeHeaders && data.headers.length > 0) {
      csvContent += data.headers.map(header => this.escapeCSV(header)).join(',') + '\n'
    }
    
    data.rows.forEach(row => {
      const escapedRow = row.map(cell => this.escapeCSV(this.formatCell(cell, options.dateFormat)))
      csvContent += escapedRow.join(',') + '\n'
    })
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const filename = this.generateFilename('data', options)
    this.downloadBlob(blob, filename)
  }

  private async exportToExcel(data: ExportData, options: ExportOptions): Promise<void> {
    try {
      const ExcelJS = await import('exceljs')
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Data')
      
      // Add headers
      if (options.includeHeaders && data.headers.length > 0) {
        worksheet.addRow(data.headers)
        worksheet.getRow(1).font = { bold: true }
        worksheet.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' }
        }
      }
      
      // Add data rows
      data.rows.forEach(row => {
        worksheet.addRow(row.map(cell => this.formatCell(cell, options.dateFormat)))
      })
      
      // Auto-fit columns
      worksheet.columns.forEach(column => {
        if (column.values) {
          const maxLength = Math.max(
            ...column.values.map(v => String(v).length)
          )
          column.width = Math.min(maxLength + 2, 50)
        }
      })
      
      // Generate buffer
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      
      const filename = this.generateFilename('data', options)
      this.downloadBlob(blob, filename)
    } catch (error) {
      console.error('Excel export error:', error)
      // Fallback to CSV if Excel export fails
      await this.exportToCSV(data, options)
    }
  }

  private async exportToPDF(data: ExportData, options: ExportOptions): Promise<void> {
    try {
      const jsPDF = (await import('jspdf')).default
      const doc = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.pageSize || 'a4'
      })
      
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      const contentWidth = pageWidth - (margin * 2)
      
      let yPosition = margin
      
      // Add title
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('Data Export Report', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 10
      
      // Add metadata
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPosition)
      yPosition += 5
      doc.text(`Total Records: ${data.rows.length}`, margin, yPosition)
      yPosition += 10
      
      // Add table
      if (data.headers.length > 0 && data.rows.length > 0) {
        const columnWidth = contentWidth / data.headers.length
        
        // Headers
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setFillColor(240, 240, 240)
        
        data.headers.forEach((header, index) => {
          const x = margin + (index * columnWidth)
          doc.rect(x, yPosition - 5, columnWidth, 8, 'F')
          doc.text(header, x + 2, yPosition, { 
            maxWidth: columnWidth - 4,
            align: 'left'
          })
        })
        yPosition += 8
        
        // Data rows
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        
        data.rows.forEach((row, rowIndex) => {
          // Check if we need a new page
          if (yPosition > pageHeight - margin) {
            doc.addPage()
            yPosition = margin
          }
          
          row.forEach((cell, colIndex) => {
            const x = margin + (colIndex * columnWidth)
            const cellText = this.formatCell(cell, options.dateFormat)
            doc.text(cellText, x + 2, yPosition, { 
              maxWidth: columnWidth - 4,
              align: 'left'
            })
          })
          yPosition += 6
        })
      }
      
      const filename = this.generateFilename('data', options)
      doc.save(filename)
    } catch (error) {
      console.error('PDF export error:', error)
      // Fallback to HTML if PDF export fails
      const htmlContent = this.generatePDFHTML(data, options)
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const filename = this.generateFilename('data', options)
      this.downloadBlob(blob, filename)
    }
  }

  private async exportToJSON(data: ExportData, options: ExportOptions): Promise<void> {
    const jsonData = {
      headers: data.headers,
      rows: data.rows,
      metadata: data.metadata,
      exportInfo: {
        timestamp: new Date().toISOString(),
        format: options.format,
        filters: options.filters,
      }
    }
    
    const jsonContent = JSON.stringify(jsonData, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const filename = this.generateFilename('data', options)
    this.downloadBlob(blob, filename)
  }

  private generatePDFHTML(data: ExportData, options: ExportOptions): string {
    const orientation = options.orientation === 'landscape' ? 'landscape' : 'portrait'
    const pageSize = options.pageSize || 'A4'
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Data Export</title>
          <style>
            @page {
              size: ${pageSize} ${orientation};
              margin: 1in;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              font-size: 18px;
              font-weight: bold;
            }
            .metadata {
              margin-bottom: 20px;
              font-size: 10px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">Data Export Report</div>
          <div class="metadata">
            Generated: ${new Date().toLocaleString()}<br>
            Total Records: ${data.rows.length}
          </div>
          <table>
            <thead>
              <tr>
                ${data.headers.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.rows.map(row => 
                `<tr>${row.map(cell => `<td>${this.formatCell(cell, options.dateFormat)}</td>`).join('')}</tr>`
              ).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `
  }

  private escapeCSV(value: string): string {
    if (typeof value !== 'string') {
      value = String(value)
    }
    
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`
    }
    
    return value
  }

  private formatCell(value: any, dateFormat?: string): string {
    if (value === null || value === undefined) {
      return ''
    }
    
    if (value instanceof Date) {
      return this.formatDate(value, dateFormat)
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    
    return String(value)
  }

  private formatDate(date: Date, format?: string): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    switch (format) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`
      case 'YYYY-MM-DD':
      default:
        return `${year}-${month}-${day}`
    }
  }

  private generateFilename(type: string, options: ExportOptions): string {
    const timestamp = new Date().toISOString().split('T')[0]
    const format = options.format || 'csv'
    
    if (options.filename) {
      return `${options.filename}.${format}`
    }
    
    return `${type}_export_${timestamp}.${format}`
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Predefined export functions for common use cases
  async exportUsers(filters?: Record<string, any>, options?: Partial<ExportOptions>): Promise<void> {
    const exportOptions = { ...this.defaultOptions, format: 'csv', ...options }
    await this.exportFromAPI('users', exportOptions)
  }

  async exportDocuments(filters?: Record<string, any>, options?: Partial<ExportOptions>): Promise<void> {
    const exportOptions = { ...this.defaultOptions, format: 'csv', ...options }
    await this.exportFromAPI('documents', exportOptions)
  }

  async exportAnalytics(filters?: Record<string, any>, options?: Partial<ExportOptions>): Promise<void> {
    const exportOptions = { ...this.defaultOptions, format: 'excel', ...options }
    await this.exportFromAPI('analytics', exportOptions)
  }

  async exportReport(reportType: string, filters?: Record<string, any>, options?: Partial<ExportOptions>): Promise<void> {
    const exportOptions = { ...this.defaultOptions, format: 'pdf', ...options }
    await this.exportFromAPI(`reports/${reportType}`, exportOptions)
  }

  // Utility function to prepare data for export
  prepareDataForExport(
    data: any[],
    columns: string[],
    columnMappings?: Record<string, string>
  ): ExportData {
    const headers = columns.map(col => columnMappings?.[col] || col)
    const rows = data.map(item => 
      columns.map(col => {
        const value = this.getNestedValue(item, col)
        return value !== undefined ? value : ''
      })
    )
    
    return { headers, rows }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }
}

// Create singleton instance
export const exportService = new ExportService()

// Export the class for testing or custom instances
export { ExportService }

// Hook for React components
export function useExport() {
  return exportService
}
