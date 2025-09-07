import api from './api';

export async function fetchAllProviders() {
  try {
    const response = await api.get('/SuperAdmin/getAllProviders');
    return response.data;
  } catch (error) {
    console.error('Error in fetchAllProviders:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch providers');
  }
}

export async function updateProviderStatus(providerId, approvelStatus) {
  try {
    const response = await api.put('/SuperAdmin/updateProviderStatus', {
      providerId,
      approvelStatus,
    });
    return response.data;
  } catch (error) {
    console.error('Error in updateProviderStatus:', error);
    throw new Error(error.response?.data?.message || 'Failed to update provider status');
  }
}

export async function deleteProvider(providerId) {
  try {
    const response = await api.delete('/SuperAdmin/deleteProvider', {
      data: { providerId },
    });
    return response.data;
  } catch (error) {
    console.error('Error in deleteProvider:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete provider');
  }
}

export async function fetchAllUsers() {
  try {
    const response = await api.get('/SuperAdmin/getAllUsers');
    return response.data;
  } catch (error) {
    console.error('Error in fetchAllUsers:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
}

export async function getBusesByAdmin() {
  try {
    const response = await api.get('/SuperAdmin/getBusesByAdmin');
    return response.data;
  } catch (error) {
    console.error('Error in getBusesByAdmin:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch buses');
  }
}

export async function getTrainsByAdmin() {
  try {
    const response = await api.get('/SuperAdmin/getTrainsByAdmin');
    return response.data;
  } catch (error) {
    console.error('Error in getTrainsByAdmin:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch trains');
  }
}

export async function getFlightsByAdmin() {
  try {
    const response = await api.get('/SuperAdmin/getFlightsByAdmin');
    return response.data;
  } catch (error) {
    console.error('Error in getFlightsByAdmin:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch flights');
  }
}
