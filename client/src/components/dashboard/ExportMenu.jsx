import { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, FileJson, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

export default function ExportMenu({ analytics, dashboardId = 'dashboard-content' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const menuRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const exportPDF = async () => {
    let element;
    try {
      setIsExporting(true);
      element = document.getElementById(dashboardId);
      if (!element) throw new Error('Dashboard element not found');

      element.classList.add('exporting-pdf');
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#101110' : '#fafaf7',
        windowWidth: Math.max(element.scrollWidth, document.documentElement.clientWidth),
        windowHeight: element.scrollHeight,
      });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeightMm = pdf.internal.pageSize.getHeight();
      const pageHeightPx = Math.floor((canvas.width * pageHeightMm) / pdfWidth);
      const pageCanvas = document.createElement('canvas');
      const pageContext = pageCanvas.getContext('2d');
      if (!pageContext) throw new Error('Could not prepare the PDF pages');
      pageCanvas.width = canvas.width;

      for (let pageIndex = 0, y = 0; y < canvas.height; pageIndex += 1, y += pageHeightPx) {
        const sliceHeight = Math.min(pageHeightPx, canvas.height - y);
        pageCanvas.height = sliceHeight;
        pageContext.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageContext.drawImage(canvas, 0, y, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
        if (pageIndex > 0) pdf.addPage();
        pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, (sliceHeight * pdfWidth) / canvas.width);
      }

      pdf.save('dashboard-export.pdf');
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to export PDF');
    } finally {
      element?.classList.remove('exporting-pdf');
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  const exportExcel = () => {
    try {
      if (!analytics) return;
      
      const wb = XLSX.utils.book_new();
      
      // Top Products Sheet
      const wsProducts = XLSX.utils.json_to_sheet(analytics.top_products);
      XLSX.utils.book_append_sheet(wb, wsProducts, "Top Products");
      
      // Category Sheet
      const wsCategories = XLSX.utils.json_to_sheet(analytics.category_revenue);
      XLSX.utils.book_append_sheet(wb, wsCategories, "Categories");
      
      // Region Sheet
      const wsRegions = XLSX.utils.json_to_sheet(analytics.region_revenue);
      XLSX.utils.book_append_sheet(wb, wsRegions, "Regions");

      XLSX.writeFile(wb, 'dashboard-export.xlsx');
      toast.success('Excel exported successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to export Excel');
    } finally {
      setIsOpen(false);
    }
  };

  const exportCSV = () => {
    try {
      if (!analytics) return;
      
      // We'll export the top products as the primary CSV representation
      // since CSV doesn't support multiple sheets
      const ws = XLSX.utils.json_to_sheet(analytics.top_products);
      const csvContent = XLSX.utils.sheet_to_csv(ws);
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "top-products-export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      toast.success('CSV exported successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to export CSV');
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="app-export-button flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-full transition-colors disabled:opacity-50"
      >
        {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        Export
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50 animate-fade-in origin-top-right">
          <button
            onClick={exportPDF}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
          >
            <FileText size={16} className="text-rose-500" />
            Export to PDF
          </button>
          <button
            onClick={exportExcel}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
          >
            <FileSpreadsheet size={16} className="text-emerald-500" />
            Export to Excel
          </button>
          <button
            onClick={exportCSV}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
          >
            <FileJson size={16} className="text-blue-500" />
            Export to CSV
          </button>
        </div>
      )}
    </div>
  );
}
