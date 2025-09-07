import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.vfs;

export const downloadAdminPDFReport = (groupedReports, transportType) => {
  const content = [
    {
      text: `${transportType.toUpperCase()} Overall Booking Report`,
      style: 'header',
      color: '#0D47A1',
      alignment: 'center',
      margin: [0, 0, 0, 20],
    },
  ];

  groupedReports.forEach((report, index) => {
    const { id, name, source, destination, price, bookings } = report;

    const maleCount = bookings.filter((b) => b.gender?.toLowerCase() === 'male').length;
    const femaleCount = bookings.filter((b) => b.gender?.toLowerCase() === 'female').length;

    content.push(
      {
        text: `${index + 1}. ${name} (${source} → ${destination})`,
        style: 'subheader',
        margin: [0, 10, 0, 5],
      },
      {
        columns: [
          [
            { text: `${transportType.toUpperCase()} ID: ${id}`, margin: [0, 2] },
            { text: `Route: ${source} → ${destination}`, margin: [0, 2] },
            { text: `Total Bookings: ${bookings.length}`, margin: [0, 2] },
            { text: `Male Passengers: ${maleCount}`, margin: [0, 2] },
            { text: `Female Passengers: ${femaleCount}`, margin: [0, 2] },
            { text: `Price per Seat: ₹${price}`, margin: [0, 2] },
            { text: `Total Revenue: ₹${(bookings.length * price).toFixed(2)}`, margin: [0, 2] },
          ],
        ],
        style: 'details',
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', '*'],
          body: [
            [
              { text: 'Seat No.', style: 'tableHeader' },
              { text: 'Passenger Name', style: 'tableHeader' },
              { text: 'Age', style: 'tableHeader' },
              { text: 'Gender', style: 'tableHeader' },
              { text: 'Email', style: 'tableHeader' },
            ],
            ...(bookings.length > 0
              ? bookings.map((b) => [
                b.seatNumber ?? '-',
                b.passengerName ?? '-',
                b.age?.toString() ?? '-',
                b.gender ?? '-',
                b.email ?? '-',
              ])
              : [[{ colSpan: 5, text: 'No bookings available', alignment: 'center' }, '', '', '', '']]),
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex === 0 ? '#1976D2' : null),
        },
        margin: [0, 0, 0, 20],
      },
      {
        text: '',
        pageBreak: 'after',
      }
    );
  });

  if (content[content.length - 1]?.pageBreak === 'after') {
    delete content[content.length - 1].pageBreak;
  }

  const docDefinition = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    content,
    styles: {
      header: {
        fontSize: 20,
        bold: true,
      },
      subheader: {
        fontSize: 14,
        bold: true,
        color: '#0D47A1',
      },
      details: {
        fontSize: 11,
      },
      tableHeader: {
        bold: true,
        fontSize: 11,
        color: 'white',
      },
    },
    defaultStyle: {
      fontSize: 10,
    },
  };

  const fileName = `${transportType}_grouped_detailed_report.pdf`;
  pdfMake.createPdf(docDefinition).download(fileName);
};
