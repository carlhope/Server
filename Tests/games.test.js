const request = require('supertest');
const axios = require('axios');
jest.mock('axios');

const app = require('../App');

describe('GET /games', () => {
  it('should return game results when RAWG responds successfully', async () => {
    const mockData = { results: [{ id: 1, name: 'Zelda' }] };
    axios.get.mockResolvedValue({ data: mockData });

    const response = await request(app).get('/games');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  it('should handle RAWG API failure gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));

    const response = await request(app).get('/games');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to fetch data from RAWG.' });
  });
});