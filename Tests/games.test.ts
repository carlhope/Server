import request from 'supertest';
import axios from 'axios';
import { AxiosError } from 'axios';
import app from '../App';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockUser = {
  id: '1',
  username: 'test-user',
  email: 'test@example.com',
  passwordHash: 'hashed-password',
};
jest.mock('../middleware/authMiddleware', () => {
  return {
    authenticate: (req: any, res: any, next: any) => {
      if (req.headers.authorization === 'Bearer valid-token') {
        req.user = {
          id: '1',
          username: 'test-user',
          email: 'test@example.com',
          passwordHash: 'hashed-password',
        };
        next();
      } else {
        res.status(401).json({ error: 'Unauthorized' });
      }
    },
  };
});


const mock404Error = {
  isAxiosError: true,
  response: {
    status: 404,
    data: { detail: 'Not found.' },
  },
  config: {},
  toJSON: () => ({}),
  message: 'Not Found',
} as AxiosError;

describe('GET /games', () => {
  it('should return game results when RAWG responds successfully', async () => {
    const mockData = { results: [{ id: 1, name: 'Zelda' }] };

    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    const response = await request(app).get('/games');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  it('should handle RAWG API failure gracefully', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

    const response = await request(app).get('/games');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Failed to fetch data from RAWG API', // updated error message
    });
  });
});
describe('GET /games/:id', () => {
  const gameId = '123';
  const mockGameData = { id: 123, name: 'Zelda' };
  const authHeader = { Authorization: 'Bearer valid-token' };

  it('should return game details when RAWG responds successfully', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockGameData });

    const response = await request(app)
      .get(`/games/${gameId}`)
      .set(authHeader);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockGameData);
  });

  it('should return 500 when RAWG API fails', async () => { 
    mockedAxios.get.mockRejectedValue(new Error('RAWG API error'));

    const response = await request(app)
      .get(`/games/${gameId}`)
      .set(authHeader);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'An unknown error occurred.',
    });
  });

  it('should return 401 if user is not authenticated', async () => {
    const response = await request(app).get(`/games/${gameId}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Unauthorized',
    });
  });

it('should return 404 if game ID is missing or invalid', async () => {
  mockedAxios.get.mockRejectedValue(mock404Error);

  const response = await request(app)
    .get('/games/invalid-id')
    .set(authHeader);

  expect(response.status).toBe(404);
  expect(response.body).toEqual({ error: 'Game not found' });
});
});