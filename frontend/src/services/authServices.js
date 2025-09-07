const API_BASE_URL = 'http://localhost:5267';

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/User/Login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid login credentials');
  }
  return await response.json();
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/User/Register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return await response.json();
};

export async function addProviderDetails(providerData) {
  try {
    const response = await fetch(`${API_BASE_URL}/Provider/addProviderDetails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      body: JSON.stringify(providerData)
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result;
  } catch (error) {
    console.error("Error adding provider details:", error);
    throw error;
  }
}