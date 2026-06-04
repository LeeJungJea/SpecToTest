import type { ParsedApiSpec } from '../../types';
import { generateMockJsonString, getFirstRequiredField } from '../mockDataGenerator';

export const vanillaTypescriptGenerator = {
  generateTest(spec: ParsedApiSpec): string {
    const reqField = getFirstRequiredField(spec.inputSchema);
    const fieldName = reqField ? reqField.name : 'dummy';
    const happyReqBody = generateMockJsonString(spec.inputSchema);
    const happyResBody = generateMockJsonString(spec.outputSchema);
    const nullBody = generateMockJsonString(spec.inputSchema, { [fieldName]: null });
    const emptyStringBody = generateMockJsonString(spec.inputSchema, { [fieldName]: '' });
    const missingBody = generateMockJsonString(spec.inputSchema, { [fieldName]: undefined });

    const endpoint = spec.url || '/api/default';
    const method = (spec.method || 'GET').toUpperCase();
    
    return `const fetchApiClient = async (data?: any): Promise<any> => {
  const response = await fetch('${endpoint}', {
    method: '${method}',
    headers: { 'Content-Type': 'application/json' },
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) {
    throw new Error('API Error: ' + response.status);
  }
  return response.json();
};

describe('Vanilla TS API Client Tests - ${endpoint}', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Happy Path (200 OK)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => (${happyResBody}),
    });

    const result = await fetchApiClient(${happyReqBody});
    expect(result).toEqual(${happyResBody});
  });

  it('Error Case (400 Bad Request)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 400 });
    await expect(fetchApiClient(${happyReqBody})).rejects.toThrow('API Error: 400');
  });

  it('Error Case (401 Unauthorized)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 401 });
    await expect(fetchApiClient()).rejects.toThrow('API Error: 401');
  });

  it('Error Case (403 Forbidden)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 403 });
    await expect(fetchApiClient()).rejects.toThrow('API Error: 403');
  });

  it('Error Case (404 Not Found)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(fetchApiClient()).rejects.toThrow('API Error: 404');
  });

  it('Error Case (500 Internal Server Error)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(fetchApiClient()).rejects.toThrow('API Error: 500');
  });

  it('Edge Case (null payload)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    await fetchApiClient(${nullBody});
    expect(global.fetch).toHaveBeenCalledWith('${endpoint}', expect.objectContaining({ body: JSON.stringify(${nullBody}) }));
  });

  it('Edge Case (empty string payload)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    await fetchApiClient(${emptyStringBody});
    expect(global.fetch).toHaveBeenCalledWith('${endpoint}', expect.objectContaining({ body: JSON.stringify(${emptyStringBody}) }));
  });

  it('Edge Case (missing fields)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    await fetchApiClient(${missingBody});
    expect(global.fetch).toHaveBeenCalledWith('${endpoint}', expect.objectContaining({ body: JSON.stringify(${missingBody}) }));
  });
});
`;
  }
};
