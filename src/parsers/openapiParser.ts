import type { HttpMethod, ParsedApiSpec, SchemaField, SchemaValueType } from '../types';

export interface OpenAPIEndpoint {
  id: string;
  method: string;
  path: string;
  summary: string;
  spec: ParsedApiSpec;
}

export const parseOpenAPI = (jsonText: string): OpenAPIEndpoint[] => {
  try {
    const data = JSON.parse(jsonText);
    const endpoints: OpenAPIEndpoint[] = [];

    if (!data.paths) return [];

    Object.keys(data.paths).forEach(path => {
      const methods = data.paths[path];
      Object.keys(methods).forEach(methodStr => {
        const methodObj = methods[methodStr];
        const method = methodStr.toUpperCase() as HttpMethod;
        
        // Very basic parsing for MVP
        const spec: ParsedApiSpec = {
          method,
          url: path,
          bodyType: method === 'GET' ? 'none' : 'json',
          headersSchema: [],
          queryParamsSchema: [],
          pathParamsSchema: [],
          inputSchema: [],
          outputSchema: [],
          responseType: 'json'
        };

        // Parse parameters
        if (methodObj.parameters && Array.isArray(methodObj.parameters)) {
          methodObj.parameters.forEach((param: any) => {
            const field: SchemaField = {
              name: param.name,
              type: (param.schema?.type || 'string') as SchemaValueType,
              required: !!param.required
            };
            if (param.in === 'path') spec.pathParamsSchema.push(field);
            if (param.in === 'query') spec.queryParamsSchema.push(field);
            if (param.in === 'header') spec.headersSchema.push(field);
          });
        }

        // Mock body parsing for now (In real implementation, parse components/schemas)
        if (methodObj.requestBody) {
          spec.inputSchema.push({
            name: 'mockField',
            type: 'string',
            required: true
          });
        }

        endpoints.push({
          id: `${method}-${path}`,
          method,
          path,
          summary: methodObj.summary || `${method} ${path}`,
          spec
        });
      });
    });

    return endpoints;
  } catch (err) {
    throw new Error('Invalid JSON or OpenAPI format');
  }
};
