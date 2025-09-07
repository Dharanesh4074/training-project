import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.vfs;

export const downloadProviderPDFReport = (
  transportId,
  transportType,
  transportName,
  source,
  destination,
  bookings,
  price
) => {
  const maleCount = bookings.filter(b => b.gender.toLowerCase() === 'male').length;
  const femaleCount = bookings.filter(b => b.gender.toLowerCase() === 'female').length;

  const docDefinition = {
    content: [
      {
        text: `${transportType.toUpperCase()} Booking Report`,
        style: 'header',
        color: '#0D47A1',
      },
      {
        columns: [
          [
            { text: `${transportType.toUpperCase()} ID: ${transportId}` },
            { text: `Transport Name: ${transportName}` },
            { text: `Route: ${source} → ${destination}` },
            { text: `Total Bookings: ${bookings.length}` },
            { text: `Male Passengers: ${maleCount}` },
            { text: `Female Passengers: ${femaleCount}` },
            { text: `Price per Seat: ₹${price}` },
            { text: `Total Revenue: ₹${bookings.length * price}` },
          ],
        ],
        margin: [0, 10, 0, 20],
        style: 'details',
      },
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', '*'],
          body: [
            [
              { text: 'Seat Number', style: 'tableHeader' },
              { text: 'Passenger Name', style: 'tableHeader' },
              { text: 'Age', style: 'tableHeader' },
              { text: 'Gender', style: 'tableHeader' },
              { text: 'Email', style: 'tableHeader' },
            ],
            ...bookings.map(b => [
              b.seatNumber,
              b.passengerName,
              b.age.toString(),
              b.gender,
              b.email,
            ]),
          ],
        },
        layout: {
          fillColor: (rowIndex) => {
            return rowIndex === 0 ? '#1976D2' : null;
          },
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      details: {
        fontSize: 11,
        margin: [0, 0, 0, 10],
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: 'white',
      },
    },
  };

  pdfMake.createPdf(docDefinition).download(`${transportId}-${source}-${destination}.pdf`);
};
