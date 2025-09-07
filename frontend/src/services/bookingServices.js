import api from './api';

export async function searchBuses({ departureCity, arrivalCity, travelDate, busType }) {
  try {
    const response = await api.post('/User/SearchBus', { departureCity, arrivalCity, travelDate, busType });
    return response.data;
  } catch (error) {
    console.error('Error in searchBuses:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch bus data');
  }
};

export async function searchTrains(data) {
  try {
    const response = await api.post('/User/SearchTrain', data);
    return response.data;
  } catch (error) {
    console.error('Error in searchTrains:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch train data');
  }
};

export async function searchFlights(data) {
  try {
    const response = await api.post('/User/SearchFlight', data);
    return response.data;
  } catch (error) {
    console.error('Error in searchFlight:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch flight data');
  }
};

export async function addBus(busData) {
  try {
    const response = await api.post('/Provider/addBus', busData);
    return response.data.message;
  } catch (error) {
    console.error('Error in addBus:', error);
    throw new Error(error.response?.data?.message || 'Failed to add bus');
  }
};

export async function addTrain(trainData) {
  try {
    const response = await api.post('/Provider/addTrain', trainData);
    return response.data;
  } catch (error) {
    console.error('Error in addTrain:', error);
    throw new Error(error.response?.data?.message || 'Failed to add train');
  }
};

export async function addFlight(flightData) {
  try {
    const response = await api.post('/Provider/addFlight', flightData);
    return response.data;
  } catch (error) {
    console.error('Error in addFlight:', error);
    throw new Error(error.response?.data?.message || 'Failed to add flight');
  }
};

export async function getBusesByProvider(providerId) {
  try {
    const response = await api.get('/Provider/getBusesByProvider', { params: { providerId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching buses:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch buses');
  }
};

export async function getTrainsByProvider(providerId) {
  try {
    const response = await api.get('/Provider/getTrainsByProvider', { params: { providerId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching trains:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch trains');
  }
};

export async function getFlightByProvider(providerId) {
  try {
    const response = await api.get('/Provider/getFlightsByProvider', { params: { providerId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching flights:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch flights');
  }
};

export async function bookBusSeats(data) {
  try {
    const response = await api.post('/User/BookBusSeat', data);
    return response.data;
  } catch (error) {
    console.error('Error in Booking bus:', error);
    throw new Error(error.response?.data?.message || 'Failed to book bus seat');
  }
};

export async function bookTrainSeats(data) {
  try {
    const response = await api.post('/User/BookTrainSeat', data);
    return response.data;
  } catch (error) {
    console.error('Error in Booking train:', error);
    throw new Error(error.response?.data?.message || 'Failed to book train seat');
  }
};

export const bookFlightSeat = async (bookingRequest) => {
  try {
    const response = await api.post('/User/BookFlightSeat', bookingRequest);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Booking failed');
  }
};

export async function getBookedBusSeats(busId) {
  try {
    const response = await api.get('/User/GetBookedBusSeats', { params: { busId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching booked bus seats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch booked bus seats');
  }
};

export async function getBookedTrainSeats(trainId) {
  try {
    const response = await api.get('/User/getBookedTrainSeats', { params: { trainId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching booked train seats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch booked train seats');
  }
};

export const getBookedFlightSeats = async (flightId) => {
  try {
    const response = await api.get(`/User/GetBookedFlightSeats`, {
      params: { flightId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching booked flight seats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch booked seats');
  }
};

export async function getFlightBookings(userId) {
  try {
    const response = await api.get('/User/GetFlightBookings', { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Error in getFlightBookings:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch flight bookings');
  }
};

export async function getTrainBookings(userId) {
  try {
    const response = await api.get('/User/GetTrainBookings', { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Error in getTrainBookings:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch train bookings');
  }
};

export async function getBusBookings(userId) {
  try {
    const response = await api.get('/User/GetBusBookings', { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Error in getBusBookings:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch bus bookings');
  }
};

export async function cancelBooking(transportType, bookingId) {
  try {
    const response = await api.delete(`/User/cancel/${transportType}/${bookingId}`);
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Cancellation failed:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Cancellation failed. Please try again.',
    };
  }
};

export const updateUserPassword = async ({ userId, oldPassword, newPassword }) => {
  try {
    const response = await api.post('/User/update-password', {
      userId: parseInt(userId, 10),
      oldPassword,
      newPassword,
    });

    return response.data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw new Error(
      error.response?.data || 'Failed to update password. Please try again.'
    );
  }
};

export async function getBusesForUsers() {
  try {
    const response = await api.get('/User/GetBusesForUsers');
    return response.data;
  } catch (error) {
    console.error('Error in GetBusesForUsers:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch buses');
  }
};

export async function getFlightsForUsers() {
  try {
    const response = await api.get('/User/GetFlightsForUsers');
    return response.data;
  } catch (error) {
    console.error('Error in GetFlightsForUsers:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch flights');
  }
};

export async function getTrainsForUsers() {
  try {
    const response = await api.get('/User/GetTrainsForUsers');
    return response.data;
  } catch (error) {
    console.error('Error in GetTrainsByProvider:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch trains');
  }
};