const fetch = require("node-fetch");
const baseUrl = 'http://localhost:3000';

async function fetchWithVersion(url, version, options = {}) {
  const headers = { 'API-Version': version, ...options.headers };
  return fetch(url, { ...options, headers });
}

describe('User API', () => {
  describe('V1 Tests', () => {
    it('GET /users should return basic user details (V1)', async () => {
      const response = await fetchWithVersion(`${baseUrl}/users`, 'v1');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);

      data.forEach(user => {
        expect(Object.keys(user)).toEqual(['id', 'name', 'email']);
      });
    });

    it('GET /users/:id for an existing user should return the user details', async () => {
      const userId = 1;
      const response = await fetchWithVersion(`${baseUrl}/users/${userId}`, 'v1');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(typeof data).toBe('object')
      expect(Object.keys(data)).toEqual(['id', 'name', 'email']);
      expect(data.id).toBe(userId);
    });

    it('GET /users/:id for a non-existing user should return a not found response', async () => {
      const nonExistingUserId = 9999;
      const response = await fetchWithVersion(`${baseUrl}/users/${nonExistingUserId}`, 'v1');
      
      expect(response.status).toBe(404);
    });

    it('PUT /users/:id should update basic user details (V1)', async () => {
      const updatedUserInfo = { name: "New Name", email: "new.email@example.com" };

      const response = await fetchWithVersion(`${baseUrl}/users/1`, 'v1', {
        method: 'PUT',
        body: JSON.stringify(updatedUserInfo),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(expect.objectContaining(updatedUserInfo));
    });
  });

  describe('V2 Tests', () => {
    it('GET /users should return all user details (V2)', async () => {
      const response = await fetchWithVersion(`${baseUrl}/users`, 'v2');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);

      data.forEach(user => {
        expect(Object.keys(user)).toEqual(['id', 'name', 'email', 'role', 'favorite_movie', 'location']);
      });
    });

    it('GET /users/:id for an existing user should return the user details (V2)', async () => {
      const userId = 1;
      const response = await fetchWithVersion(`${baseUrl}/users/${userId}`, 'v2');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(typeof data).toBe('object')
      expect(Object.keys(data)).toEqual(['id', 'name', 'email', 'role', 'favorite_movie', 'location']);
      expect(data.id).toBe(userId);
    });

    it('GET /users/:id for a non-existing user should return a not found response', async () => {
      const nonExistingUserId = 9999;
      const response = await fetchWithVersion(`${baseUrl}/users/${nonExistingUserId}`, 'v2');
      
      expect(response.status).toBe(404);
    });

    it('PUT /users/:id should update all user details (V2)', async () => {
      const updatedUserInfo = {
        name: "Updated Name",
        email: "updated.email@example.com",
        role: "Updated Role",
        favorite_movie: "Updated Movie",
        location: "Updated Location"
      };

      const response = await fetchWithVersion(`${baseUrl}/users/1`, 'v2', {
        method: 'PUT',
        body: JSON.stringify(updatedUserInfo),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(expect.objectContaining(updatedUserInfo));
    });
    
    it('GET /users with pagination parameters should return paginated results', async () => {
      const limit = 10;
      const page = 1;

      const response = await fetchWithVersion(`${baseUrl}/users?limit=${limit}&page=${page}`, 'v2');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeLessThanOrEqual(limit)
    });

    it('GET /users with different page should return different results', async () => {
      const limit = 10;
      const page1 = 1;
      const page2 = 2;
      
      const response1 = await fetchWithVersion(`${baseUrl}/users?limit=${limit}&page=${page1}`, 'v2');
      const data1 = await response1.json();

      const response2 = await fetchWithVersion(`${baseUrl}/users?limit=${limit}&page=${page2}`, 'v2');
      const data2 = await response2.json();

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      
      expect(Array.isArray(data1)).toBe(true);
      expect(Array.isArray(data2)).toBe(true);
      expect(data1).not.toEqual(data2)
    });

    it('GET /users with last page parameter should return fewer or no users', async () => {
      const limit = 10;
      const lastPage = 100;
      
      const response = await fetch(`${baseUrl}/users?limit=${limit}&page=${lastPage}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeLessThanOrEqual(limit)
    });
  });
});