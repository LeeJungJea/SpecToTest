import type { ParsedApiSpec } from '../../types';
import { generateMockJsonString, getFirstRequiredField } from '../mockDataGenerator';export const phpLaravelGenerator = {
  generateTest(spec: ParsedApiSpec): string {
    return `<?php

namespace Tests\\Feature;

use Illuminate\\Foundation\\Testing\\RefreshDatabase;
use Tests\\TestCase;

class EndpointTest extends TestCase
{
    public function test_happy_path_returns_200()
    {
        $response = $this->${spec.method.toLowerCase()}Json('${spec.url}', json_decode('${generateMockJsonString(spec.inputSchema)}', true));
        $response->assertStatus(200);
    }

    public function test_missing_fields_returns_400()
    {
        $response = $this->${spec.method.toLowerCase()}Json('${spec.url}', []);
        $response->assertStatus(400);
    }

    public function test_null_fields_returns_400()
    {
        $response = $this->${spec.method.toLowerCase()}Json('${spec.url}', ['${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}' => null]);
        $response->assertStatus(400);
    }

    public function test_empty_string_returns_400()
    {
        $response = $this->${spec.method.toLowerCase()}Json('${spec.url}', ['${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}' => '']);
        $response->assertStatus(400);
    }

    public function test_unauthorized_returns_401()
    {
        $response = $this->${spec.method.toLowerCase()}Json('${spec.url}', json_decode('${generateMockJsonString(spec.inputSchema)}', true));
        $response->assertStatus(401);
    }

    public function test_forbidden_returns_403()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer invalid_token',
        ])->${spec.method.toLowerCase()}Json('${spec.url}', json_decode('${generateMockJsonString(spec.inputSchema)}', true));
        $response->assertStatus(403);
    }

    public function test_not_found_returns_404()
    {
        $response = $this->${spec.method.toLowerCase()}Json('${spec.url}/invalid', ['key' => 'value']);
        $response->assertStatus(404);
    }

    public function test_internal_server_error_returns_500()
    {
        $response = $this->withHeaders([
            'X-Trigger-Error' => 'true',
        ])->${spec.method.toLowerCase()}Json('${spec.url}', json_decode('${generateMockJsonString(spec.inputSchema)}', true));
        $response->assertStatus(500);
    }
}
`;
  }
};
