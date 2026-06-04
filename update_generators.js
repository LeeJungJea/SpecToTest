const fs = require('fs');
const path = require('path');
const dir = 'C:/AI/SpecToTest/src/generators/frontend';
const files = [
  'reactTypescript.ts', 'nextJs.ts', 'vue3.ts', 'nuxtJs.ts', 
  'angular.ts', 'svelte.ts', 'solidJs.ts', 'preact.ts', 
  'vanillaTypescript.ts', 'vanillaJavascript.ts'
];

for (const file of files) {
  const p = path.join(dir, file);
  if (!fs.existsSync(p)) continue;
  let content = fs.readFileSync(p, 'utf8');

  // Add import
  if (!content.includes('generateMockJsonString')) {
    content = content.replace(
      /import type \{ ParsedApiSpec \} from '\.\.\/\.\.\/types';/,
      `import type { ParsedApiSpec } from '../../types';\nimport { generateMockJsonString, getFirstRequiredField } from '../mockDataGenerator';`
    );
  }

  // Insert mock variables inside generateTest
  const mockVars = `\n    const reqField = getFirstRequiredField(spec.inputSchema);\n    const fieldName = reqField ? reqField.name : 'dummy';\n    const happyReqBody = generateMockJsonString(spec.inputSchema);\n    const happyResBody = generateMockJsonString(spec.outputSchema);\n    const nullBody = generateMockJsonString(spec.inputSchema, { [fieldName]: null });\n    const emptyStringBody = generateMockJsonString(spec.inputSchema, { [fieldName]: '' });\n    const missingBody = generateMockJsonString(spec.inputSchema, { [fieldName]: undefined });`;
  
  content = content.replace(/generateTest\(spec: ParsedApiSpec\): string \{/, `generateTest(spec: ParsedApiSpec): string {${mockVars}`);

  // Replace specifics
  if (file === 'reactTypescript.ts') {
    content = content.replace(
      /const mockResponseData = \{ success: true, data: \{ id: 1, name: 'Test' \} \};/g,
      `const mockResponseData = \${happyResBody};`
    );
    content = content.replace(/\{ \/\* input params \*\/ \}/g, `\${happyReqBody}`);
    content = content.replace(/const mockResponseMissingFields = \{ success: true, data: \{\} \}; \/\/ missing id, name/g, 
      `const mockResponseMissingFields = \${missingBody};`);
  } else {
    // Other files
    content = content.replace(/\{ test: 'data' \}/g, `\${happyReqBody}`);
    content = content.replace(/\{ bad: 'request' \}/g, `\${happyReqBody}`); 
    content = content.replace(/\{ success: true, data: 'test_data' \}/g, `\${happyResBody}`);

    // Edge Cases replacement
    // Angular handles it slightly differently, watch out. 
    // Edge Case (null payload)
    content = content.replace(/fetchApiClient\(null\)/g, `fetchApiClient(\${nullBody})`);
    content = content.replace(/body: JSON\.stringify\(null\)/g, `body: JSON.stringify(\${nullBody})`);
    content = content.replace(/service\.callApi\(null\)/g, `service.callApi(\${nullBody})`);
    content = content.replace(/expect\(req\.request\.body\)\.toBeNull\(\)/g, `expect(req.request.body).toEqual(\${nullBody})`);
    
    // Edge Case (empty string payload)
    content = content.replace(/fetchApiClient\(''\)/g, `fetchApiClient(\${emptyStringBody})`);
    content = content.replace(/body: JSON\.stringify\(''\)/g, `body: JSON.stringify(\${emptyStringBody})`);
    content = content.replace(/service\.callApi\(''\)/g, `service.callApi(\${emptyStringBody})`);
    content = content.replace(/expect\(req\.request\.body\)\.toBe\(''\)/g, `expect(req.request.body).toEqual(\${emptyStringBody})`);

    // Edge Case (missing fields)
    content = content.replace(/fetchApiClient\(\{\}\)/g, `fetchApiClient(\${missingBody})`);
    content = content.replace(/body: JSON\.stringify\(\{\}\)/g, `body: JSON.stringify(\${missingBody})`);
    content = content.replace(/service\.callApi\(\{\}\)/g, `service.callApi(\${missingBody})`);
    content = content.replace(/expect\(req\.request\.body\)\.toEqual\(\{\}\)/g, `expect(req.request.body).toEqual(\${missingBody})`);
  }

  fs.writeFileSync(p, content);
}
console.log('Updated 10 files');
