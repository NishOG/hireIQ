import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from './utils';

export function exportReportPdf(evalData) {
  try {
    const doc = new jsPDF();
    const title = evalData.title || 'Candidate Evaluation';

    // Header
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text('HireIQ Intelligence Report', 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Role: ${title}`, 14, 32);
    doc.text(`Date generated: ${new Date().toLocaleDateString()}`, 14, 38);
    doc.text(`Total candidates: ${evalData.ranked.length}`, 14, 44);

    // Summary Stats
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text('Executive Summary', 14, 55);

    const hired = evalData.ranked.filter(c => c.decision === 'Hire').length;
    const strong = evalData.ranked.filter(c => c.classification === 'Strong Fit').length;

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Average Score: ${evalData.stats?.avgScore || 0}/100`, 14, 63);
    doc.text(`Strong Fits: ${strong}`, 80, 63);
    doc.text(`Hired: ${hired}`, 140, 63);

    // Main Table
    const tableData = evalData.ranked.map((c, i) => [
      i + 1,
      c.name,
      `${c.score}/100`,
      c.classification,
      `${c.metrics?.skillMatch || 0}%`,
      `${c.metrics?.experience || 0}/25`,
      c.decision || 'Pending'
    ]);

    doc.autoTable({
      startY: 75,
      head: [['#', 'Candidate', 'Overall Score', 'Fit Level', 'Skill Match', 'Exp. Score', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 4 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 6) {
          const status = data.cell.raw;
          if (status === 'Hire') data.cell.styles.textColor = [22, 163, 74];
          if (status === 'Reject') data.cell.styles.textColor = [220, 38, 38];
        }
      }
    });

    // JD Skills section
    let finalY = doc.lastAutoTable.finalY + 15;
    
    if (finalY > 250) {
      doc.addPage();
      finalY = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text('Required Skills Analyzed', 14, finalY);
    
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    const reqSkills = evalData.jdData?.requiredSkills?.join(', ') || 'None specified';
    
    const splitSkills = doc.splitTextToSize(reqSkills, 180);
    doc.text(splitSkills, 14, finalY + 8);

    doc.save(`HireIQ_Report_${title.replace(/\s+/g, '_')}.pdf`);
    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    return false;
  }
}
