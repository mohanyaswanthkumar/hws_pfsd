import React, { useState, useEffect, useRef } from 'react';
import { getPrescriptions } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { FileText, Download, Printer } from 'lucide-react';
import jsPDF from 'jspdf';

const PrescriptionView = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const printRef = useRef();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await getPrescriptions();
        setPrescriptions(
          data.map((prescription) => ({
            id: prescription.id || '',
            patient: prescription.appointment?.patient?.username || 'N/A',
            doctor: prescription.appointment?.doctor?.user?.username || 'Unknown Doctor',
            date: prescription.created_at
              ? new Date(prescription.created_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : 'N/A',
            medication: prescription.medication || 'N/A',
            dosage: prescription.dosage || 'N/A',
            instructions: prescription.instructions || 'No instructions provided.',
            status: prescription.appointment?.status || 'pending',
          }))
        );
        setError('');
        console.log('Prescriptions fetched:', data);
      } catch (err) {
        const status = err.status || err.response?.status;
        let errMsg = 'Failed to load prescriptions.';
        if (status === 403) {
          errMsg = 'Unauthorized: Please log in or contact support to verify your account.';
        } else if (err.response?.data?.detail) {
          errMsg = err.response.data.detail;
        }
        setError(errMsg);
        console.error('Fetch prescriptions error:', JSON.stringify(err.response?.data || err, null, 2));
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  const handleDownloadPDF = (prescription) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Header
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Prescription', 20, 20);
      
      // Line
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25);

      // Details
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      let y = 35;
      const lineHeight = 8;
      
      doc.text(`Prescription ID: ${prescription.id}`, 20, y);
      y += lineHeight;
      doc.text(`Patient: ${prescription.patient}`, 20, y);
      y += lineHeight;
      doc.text(`Doctor: Dr. ${prescription.doctor}`, 20, y);
      y += lineHeight;
      doc.text(`Date: ${prescription.date}`, 20, y);
      y += lineHeight * 1.5;

      doc.setFont('helvetica', 'bold');
      doc.text('Medication', 20, y);
      y += lineHeight;
      doc.setFont('helvetica', 'normal');
      doc.text(`${prescription.medication} - ${prescription.dosage}`, 20, y);
      y += lineHeight * 1.5;

      doc.setFont('helvetica', 'bold');
      doc.text('Instructions', 20, y);
      y += lineHeight;
      doc.setFont('helvetica', 'normal');
      // Split long instructions
      const instructions = doc.splitTextToSize(prescription.instructions, 170);
      doc.text(instructions, 20, y);
      y += instructions.length * lineHeight;

      y += lineHeight;
      doc.text(`Status: ${prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}`, 20, y);

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Generated by Healthcare System', 20, 280);

      // Save PDF
      doc.save(`prescription_${prescription.id}.pdf`);
      console.log(`Downloaded PDF for prescription ${prescription.id}`);
    } catch (error) {
      setError('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', error);
    }
  };

  const handlePrint = (prescription) => {
    try {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Prescription #${prescription.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .prescription { max-width: 800px; }
              h1 { font-size: 24px; }
              .line { border-bottom: 1px solid #000; margin: 10px 0; }
              .section { margin: 15px 0; }
              .label { font-weight: bold; }
              .footer { margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="prescription">
              <h1>Prescription</h1>
              <div class="line"></div>
              <div class="section">
                <p><span class="label">Prescription ID:</span> ${prescription.id}</p>
                <p><span class="label">Patient:</span> ${prescription.patient}</p>
                <p><span class="label">Doctor:</span> Dr. ${prescription.doctor}</p>
                <p><span class="label">Date:</span> ${prescription.date}</p>
              </div>
              <div class="section">
                <p class="label">Medication</p>
                <p>${prescription.medication} - ${prescription.dosage}</p>
              </div>
              <div class="section">
                <p class="label">Instructions</p>
                <p>${prescription.instructions}</p>
              </div>
              <div class="section">
                <p><span class="label">Status:</span> ${
                  prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)
                }</p>
              </div>
              <div class="footer">Generated by Healthcare System</div>
            </div>
            <script>
              window.onload = () => {
                window.print();
                window.onafterprint = () => window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      console.log(`Printed prescription ${prescription.id}`);
    } catch (error) {
      setError('Failed to print prescription. Please try again.');
      console.error('Print error:', error);
    }
  };

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-400 text-red-700 rounded-md flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 text-red-700" />
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Your Prescriptions</h2>
      <div className="space-y-6">
        {prescriptions.map((prescription) => (
          <div
            key={prescription.id}
            className={`bg-white rounded-lg shadow-sm p-6 ${
              prescription.status === 'booked' ? 'border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800">
                  Prescription #{prescription.id}
                </h3>
                <p className="text-sm text-gray-600">
                  Dr. {prescription.doctor} • {prescription.patient} • {prescription.date}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  prescription.status === 'booked'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-700 mb-2">Medication</h4>
              <p className="text-sm text-gray-600">
                <span className="font-medium">{prescription.medication}</span> - {prescription.dosage}
              </p>
              <h4 className="font-medium text-gray-700 mb-2 mt-4">Instructions</h4>
              <p className="text-sm text-gray-600">{prescription.instructions}</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handlePrint(prescription)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={() => handleDownloadPDF(prescription)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        ))}
        {prescriptions.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-800 mb-1">No prescriptions found</h3>
            <p className="text-gray-600">You don't have any prescriptions at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionView;