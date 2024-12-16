/**
 * Sends data using the fetch API with the Keep-Alive option.
 * @param url - The URL to send the request to.
 * @param data - The data to include in the request body.
 */
export async function sendData(url: string, data: object): Promise<void> {
  try {
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json', // Indicate the data format
        'Accept': 'application/json',      // Request JSON response
        'Connection': 'keep-alive',        // Enable Keep-Alive
      },
      keepalive: true, // Allow background execution
    });
  } catch (error) {
    console.error('Keep-Alive request failed:', error);
  }
}
