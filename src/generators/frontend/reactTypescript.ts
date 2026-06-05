import type { ParsedApiSpec } from '../../types';
import { generateMockJsonString, getFirstRequiredField } from '../mockDataGenerator';

export const reactTypescriptGenerator = {
  generateTest(spec: ParsedApiSpec): string {
    const reqField = getFirstRequiredField(spec.inputSchema);
    const fieldName = reqField ? reqField.name : 'dummy';
    const happyResBody = generateMockJsonString(spec.outputSchema);
    const missingBody = generateMockJsonString(spec.inputSchema, { [fieldName]: undefined });

    const url = spec.url;
    const method = spec.method;
    const fnName = `call${method.charAt(0) + method.slice(1).toLowerCase()}Api`;

    return `import { ${fnName} } from '../../api/client';

describe('${method} ${url} API Tests', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. Happy Path
  it('should successfully fetch data on Happy Path (200 OK)', async () => {
    const mockResponseData = ${happyResBody};
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponseData,
    });

    const result = await ${fnName}({ /* input params */ });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('${url.split('?')[0].split('{')[0]}'),
      expect.objectContaining({ method: '${method}' })
    );
    expect(result).toEqual(mockResponseData);
  });

  // 2. Error Cases (400, 401, 403, 404, 500)
  it('should throw an error on 400 Bad Request', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Invalid parameters' })
    });

    await expect(${fnName}({ /* input params */ }))
      .rejects.toThrow('API request failed with status 400');
  });

  it('should throw an error on 401 Unauthorized', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Unauthorized token' })
    });

    await expect(${fnName}({ /* input params */ }))
      .rejects.toThrow('API request failed with status 401');
  });

  it('should throw an error on 403 Forbidden', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: 'Access denied' })
    });

    await expect(${fnName}({ /* input params */ }))
      .rejects.toThrow('API request failed with status 403');
  });

  it('should throw an error on 404 Not Found', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Resource not found' })
    });

    await expect(${fnName}({ /* input params */ }))
      .rejects.toThrow('API request failed with status 404');
  });

  it('should throw an error on 500 Internal Server Error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal server error' })
    });

    await expect(${fnName}({ /* input params */ }))
      .rejects.toThrow('API request failed with status 500');
  });

  // 3. Edge Cases
  it('should handle null response body safely', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => null
    });

    const result = await ${fnName}({ /* input params */ });
    expect(result).toBeNull();
  });

  it('should handle empty string response safely', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => ''
    });

    // Depending on the parser, it might fallback to text() if json() fails or returns empty
    const result = await ${fnName}({ /* input params */ }).catch(e => e);
    // Assertion depends on your client implementation. For example:
    expect(result).toBeDefined();
  });

  it('should handle missing optional fields gracefully', async () => {
    const mockResponseMissingFields = ${missingBody}; // missing id, name
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponseMissingFields,
    });

    const result = await ${fnName}({ /* input params */ });
    
    expect(result.data.id).toBeUndefined();
    expect(result.data.name).toBeUndefined();
  });
});`;
  }
};
