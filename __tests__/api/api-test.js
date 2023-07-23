import MockAdapter from 'axios-mock-adapter';

import api from '../../api/api';

describe('api', () => {
  const mock = new MockAdapter(api);

  afterEach(() => {
    mock.reset();
  });

  test('makes POST request', async () => {
    const data = {name: 'John Doe', email: 'john.doe@example.com'};
    const expectedResponse = {...data, id: 1};
    mock.onPost('/users').reply(201, expectedResponse);

    const response = await api.post('/users', data);

    expect(response.status).toBe(201);
    expect(response.data).toEqual(expectedResponse);
  });
});
