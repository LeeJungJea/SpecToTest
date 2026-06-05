import type { ParsedApiSpec } from '../../types';
import { generateMockJsonString, getFirstRequiredField } from '../mockDataGenerator';export const nodeTypescriptGenerator = {
  generateTest(spec: ParsedApiSpec): string {
    return `import request from 'supertest';
import { app } from '../app';

describe('${spec.method.toUpperCase()} ${spec.url}', () => {
  it('should return 200 OK on Happy Path', async () => {
    const response = await request(app)
      .${spec.method.toLowerCase()}('${spec.url}')
      .send(${generateMockJsonString(spec.inputSchema)});
    expect(response.status).toBe(200);
  });

  it('should return 400 Bad Request on missing fields', async () => {
    const response = await request(app)
      .${spec.method.toLowerCase()}('${spec.url}')
      .send({});
    expect(response.status).toBe(400);
  });

  it('should return 400 Bad Request on null fields', async () => {
    const response = await request(app)
      .${spec.method.toLowerCase()}('${spec.url}')
      .send({ "${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}": null });
    expect(response.status).toBe(400);
  });

  it('should return 400 Bad Request on empty strings', async () => {
    const response = await request(app)
      .${spec.method.toLowerCase()}('${spec.url}')
      .send({ "${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}": '' });
    expect(response.status).toBe(400);
  });

  it('should return 401 Unauthorized when missing token', async () => {
    const response = await request(app)
      .${spec.method.toLowerCase()}('${spec.url}')
      .send(${generateMockJsonString(spec.inputSchema)});
    expect(response.status).toBe(401);
  });

  it('should return 403 Forbidden when insufficient permissions', async () => {
    const response = await request(app)
      .${spec.method.toLowerCase()}('${spec.url}')
      .set('Authorization', 'Bearer USER_TOKEN')
      .send(${generateMockJsonString(spec.inputSchema)});
    expect(response.status).toBe(403);
  });

  it('should return 404 Not Found for non-existent resource', async () => {
    const response = await request(app)
      .${spec.method.toLowerCase()}('${spec.url}/999999')
      .send(${generateMockJsonString(spec.inputSchema)});
    expect(response.status).toBe(404);
  });

  it('should return 500 Internal Server Error on unexpected server failure', async () => {
    const response = await request(app)
      .${spec.method.toLowerCase()}('${spec.url}')
      .set('X-Trigger-Error', 'true')
      .send(${generateMockJsonString(spec.inputSchema)});
    expect(response.status).toBe(500);
  });
});
`;
  }
};
