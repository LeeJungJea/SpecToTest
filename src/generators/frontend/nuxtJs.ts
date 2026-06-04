import type { ParsedApiSpec } from '../../types';
import { generateMockJsonString, getFirstRequiredField } from '../mockDataGenerator';

export const nuxtJsGenerator = {
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
    
    return `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Nuxt.js fetch wrapper equivalent for testing
const fetchApiClient = async (data?: any) => {
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

describe('Nuxt.js API Client Tests - ${endpoint}', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Happy Path (200 OK)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => (${happyResBody}),
    } as Response);

    const result = await fetchApiClient(${happyReqBody});
    expect(result).toEqual(${happyResBody});
  });

  it('Error Case (400 Bad Request)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 400 } as Response);
    await expect(fetchApiClient(${happyReqBody})).rejects.toThrow('API Error: 400');
  });

  it('Error Case (401 Unauthorized)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 401 } as Response);
    await expect(fetchApiClient()).rejects.toThrow('API Error: 401');
  });

  it('Error Case (403 Forbidden)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 403 } as Response);
    await expect(fetchApiClient()).rejects.toThrow('API Error: 403');
  });

  it('Error Case (404 Not Found)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 404 } as Response);
    await expect(fetchApiClient()).rejects.toThrow('API Error: 404');
  });

  it('Error Case (500 Internal Server Error)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 500 } as Response);
    await expect(fetchApiClient()).rejects.toThrow('API Error: 500');
  });

  it('Edge Case (null payload)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);
    await fetchApiClient(${nullBody});
    expect(global.fetch).toHaveBeenCalledWith('${endpoint}', expect.objectContaining({ body: JSON.stringify(${nullBody}) }));
  });

  it('Edge Case (empty string payload)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);
    await fetchApiClient(${emptyStringBody});
    expect(global.fetch).toHaveBeenCalledWith('${endpoint}', expect.objectContaining({ body: JSON.stringify(${emptyStringBody}) }));
  });

  it('Edge Case (missing fields)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);
    await fetchApiClient(${missingBody});
    expect(global.fetch).toHaveBeenCalledWith('${endpoint}', expect.objectContaining({ body: JSON.stringify(${missingBody}) }));
  });
});
`;
  }
};
