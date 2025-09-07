import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.vfs;

export const generateBookingTicketPDF = (booking, transportType) => {
  const {
    BookingId,
    FlightId,
    TrainId,
    BusId,
    SeatNumbers,
    Passengers = [],
    JourneyDate = new Date(),
    Source = 'N/A',
    Destination = 'N/A',
  } = booking;

  const transportId = FlightId || TrainId || BusId;

  const bookingsFlattened = Passengers.map((p, index) => ({
    seatNumber: p.SeatNumber || SeatNumbers?.[index] || '',
    passengerName: p.Name,
    age: p.Age,
    gender: p.Gender,
    email: p.Email || 'N/A',
  }));

  const docDefinition = {
    content: [
      {
        text: `${transportType.toUpperCase()} TICKET`,
        style: 'header',
        color: '#0D47A1',
        alignment: 'center',
      },
      {
        columns: [
          [
            { text: `Booking ID: ${BookingId}` },
            { text: `Transport ID: ${transportId}` },
            { text: `Journey Date: ${new Date(JourneyDate).toLocaleDateString()}` },
            { text: `From: ${Source}` },
            { text: `To: ${Destination}` },
            { text: `Payment Status: Paid` },
          ]
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
              { text: 'Seat No', style: 'tableHeader' },
              { text: 'Name', style: 'tableHeader' },
              { text: 'Age', style: 'tableHeader' },
              { text: 'Gender', style: 'tableHeader' },
              { text: 'Email', style: 'tableHeader' },
            ],
            ...bookingsFlattened.map(p => [
              p.seatNumber,
              p.passengerName,
              p.age.toString(),
              p.gender,
              p.email,
            ]),
          ],
        },
        layout: {
          fillColor: rowIndex => (rowIndex === 0 ? '#1976D2' : null),
        },
      },
      {
        text: '\n\nThank you for choosing us!',
        style: 'thankYou',
      },
      {
        text: `We wish you a safe and pleasant journey with ${transportType.toUpperCase()} Services.`,
        margin: [0, 5, 0, 5],
      },
      {
        text: 'For any queries, contact us at: transportteam@gmail.com',
        style: 'footerContact',
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      details: {
        fontSize: 12,
        margin: [0, 0, 0, 10],
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: 'white',
      },
      thankYou: {
        bold: true,
        fontSize: 14,
        alignment: 'center',
        color: '#388E3C',
      },
      footerContact: {
        fontSize: 11,
        italics: true,
        alignment: 'center',
        margin: [0, 10, 0, 0],
      },
    },
  };

  pdfMake.createPdf(docDefinition).download(`ticket-${transportType}-${BookingId}.pdf`);
};
