/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Download, Printer } from 'lucide-react';
import { KontrakFisik, UraianPekerjaan } from '../types';
import ContractPrintDocument from './ContractPrintDocument';

interface ContractPrintPreviewProps {
  contract: KontrakFisik;
  uraianPekerjaan?: UraianPekerjaan | null;
  onClose: () => void;
}

export default function ContractPrintPreview({ contract, uraianPekerjaan, onClose }: ContractPrintPreviewProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      // Dynamic import to reduce bundle size
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const element = document.getElementById('print-document');
      if (!element) {
        throw new Error('Print document element not found');
      }

      // Wait for images to load
      const images = element.getElementsByTagName('img');
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            setTimeout(() => resolve(), 5000);
          });
        })
      );

      // Capture the element as canvas with proper settings
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('print-document');
          if (clonedElement) {
            // Preserve all existing styles, just ensure visibility
            clonedElement.style.display = 'flex';
            clonedElement.style.flexDirection = 'column';
            clonedElement.style.visibility = 'visible';
            clonedElement.style.opacity = '1';
            clonedElement.style.position = 'relative';
            
            // Ensure all nested elements maintain their computed styles
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach((el: any) => {
              const computedStyle = window.getComputedStyle(el);
              
              // Preserve text alignment
              if (computedStyle.textAlign) {
                el.style.textAlign = computedStyle.textAlign;
              }
              
              // Preserve flex properties
              if (computedStyle.display === 'flex') {
                el.style.justifyContent = computedStyle.justifyContent;
                el.style.alignItems = computedStyle.alignItems;
                el.style.flexDirection = computedStyle.flexDirection;
              }
              
              // Preserve background colors and borders
              if (computedStyle.backgroundColor && computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                el.style.backgroundColor = computedStyle.backgroundColor;
              }
              
              if (computedStyle.border && computedStyle.border !== 'none') {
                el.style.border = computedStyle.border;
              }
              
              if (computedStyle.borderRadius) {
                el.style.borderRadius = computedStyle.borderRadius;
              }
              
              // Preserve padding and spacing
              if (computedStyle.padding) {
                el.style.padding = computedStyle.padding;
              }
              
              if (computedStyle.margin) {
                el.style.margin = computedStyle.margin;
              }
            });
          }
        }
      });

      // Create PDF in landscape A4
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = 210; // A4 landscape height in mm

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Sanitize filename
      const sanitizedName = contract.noKontrak
        .replace(/[/\\:*?"<>|]/g, '_')
        .substring(0, 50);
      
      pdf.save(`SIMKON-PJJ_${sanitizedName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal membuat PDF. Silakan coba lagi.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <>
      {/* Print Preview Modal */}
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-100 print:bg-white">
        {/* Toolbar - Hidden when printing */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between print:hidden">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Preview Cetak Kontrak</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {contract.namaPaket.substring(0, 80)}
              {contract.namaPaket.length > 80 ? '...' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold rounded shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPdf ? 'Membuat PDF...' : 'Download PDF'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded transition"
            >
              <X className="w-4 h-4" />
              Tutup
            </button>
          </div>
        </div>

        {/* Preview Area - Scrollable */}
        <div className="flex-1 overflow-auto p-8 print:p-0 print:overflow-visible">
          <div className="max-w-[297mm] mx-auto bg-white shadow-2xl print:shadow-none">
            <ContractPrintDocument contract={contract} />
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          /* Hide everything except the print document container */
          body > *:not(#root) {
            display: none !important;
          }
          
          #root > *:not(:has(#print-document)) {
            display: none !important;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          /* Ensure print document is visible and properly sized */
          #print-document {
            display: flex !important;
            flex-direction: column !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            width: 297mm !important;
            height: 210mm !important;
            max-height: 210mm !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          
          /* Ensure all backgrounds and borders print */
          * {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
    </>
  );
}
