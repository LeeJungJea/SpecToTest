import type { SchemaField } from '../types';

export function generateMockData(schema: SchemaField[], edgeCaseOverrides?: Record<string, any>): Record<string, any> {
  const obj: Record<string, any> = {};
  if (!schema || schema.length === 0) {
    return { dummy: 'data' };
  }
  for (const field of schema) {
    let val: any;
    if (field.type === 'string') val = 'test_string';
    else if (field.type === 'number') val = 123;
    else if (field.type === 'boolean') val = true;
    else if (field.type === 'array') val = [];
    else val = {};
    obj[field.name] = val;
  }
  
  if (edgeCaseOverrides) {
    for (const [k, v] of Object.entries(edgeCaseOverrides)) {
      if (v === undefined) {
        delete obj[k];
      } else {
        obj[k] = v;
      }
    }
  }
  return obj;
}

export function generateMockJsonString(schema: SchemaField[], edgeCaseOverrides?: Record<string, any>): string {
  return JSON.stringify(generateMockData(schema, edgeCaseOverrides), null, 2);
}

export function generatePythonDict(schema: SchemaField[], edgeCaseOverrides?: Record<string, any>): string {
  const jsonStr = generateMockJsonString(schema, edgeCaseOverrides);
  return jsonStr.replace(/: true/g, ': True').replace(/: false/g, ': False').replace(/: null/g, ': None');
}

export function getFirstRequiredField(schema: SchemaField[]): SchemaField | null {
  if (!schema) return null;
  return schema.find(f => f.required) || schema[0] || null;
}
