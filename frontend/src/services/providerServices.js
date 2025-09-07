import api from './api';

export const updateBusDetails = async (updateDto) => {
  try {
    const response = await api.put('/Provider/UpdateBusDetails', updateDto);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || error.message || 'Failed to update bus');
  }
};

export const updateFlightDetails = async (updateDto) => {
  try {
    const response = await api.put('/Provider/UpdateFlightDetails', updateDto);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || error.message || 'Failed to update flight');
  }
};

export const updateTrainDetails = async (updateDto) => {
  try {
    const response = await api.put('/Provider/UpdateTrainDetails', updateDto);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || error.message || 'Failed to update train');
  }
};

export const getBookingSummary = async (transportId, transportType) => {
  const response = await api.get('/Provider/GetBookingSummaryForProvider', {
    params: { transportId, transportType },
  });
  return response.data;
};

export async function deleteBus(busId) {
  try {
    const response = await api.delete(`/Provider/DeleteBusById/${busId}`);
    return response.data.message;
  } catch (error) {
    console.error('Error in deleteBus:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete bus');
  }
}

export async function deleteFlight(flightId) {
  try {
    const response = await api.delete(`/Provider/DeleteFlightById/${flightId}`);
    return response.data.message;
  } catch (error) {
    console.error('Error in deleteFlight:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete flight');
  }
}

export async function deleteTrain(trainId) {
  try {
    const response = await api.delete(`/Provider/DeleteTrainById/${trainId}`);
    return response.data.message;
  } catch (error) {
    console.error('Error in deleteTrain:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete train');
  }
} 