import { inspectionService } from './inspectionService';

export const reportService = {
  // FUTURE API:
  // Replace with GET /api/reports/:id/pdf (Generates official PDF document on backend server)
  getReportData: async (inspectionId) => {
    const inspection = await inspectionService.getInspectionById(inspectionId);
    if (!inspection) throw new Error("Inspection not found");

    return {
      reportId: `REP-${inspection.id.replace('INS-', '')}`,
      generatedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      legalAuthority: "Legal Metrology Directorate, Department of Consumer Affairs, Govt. of India",
      governingAct: "Legal Metrology (Packaged Commodities) Rules, 2011 & Amendments",
      inspection
    };
  },

  downloadMockPdf: (inspectionId) => {
    // Triggers browser print window for seamless PDF saving/viewing
    window.print();
  }
};
