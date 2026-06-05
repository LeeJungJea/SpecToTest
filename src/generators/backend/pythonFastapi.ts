import type { ParsedApiSpec } from '../../types';
import { getFirstRequiredField } from '../mockDataGenerator';export const pythonFastapiGenerator = {
  generateTest(spec: ParsedApiSpec): string {
    return `import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_happy_path_200():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.${spec.method.toLowerCase()}("${spec.url}", json=${(spec.inputSchema)})
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_missing_fields_400():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.${spec.method.toLowerCase()}("${spec.url}", json={})
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_null_fields_400():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.${spec.method.toLowerCase()}("${spec.url}", json={"${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}": None})
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_empty_string_400():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.${spec.method.toLowerCase()}("${spec.url}", json={"${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}": ""})
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_unauthorized_401():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.${spec.method.toLowerCase()}("${spec.url}", json=${(spec.inputSchema)})
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_forbidden_403():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.${spec.method.toLowerCase()}("${spec.url}", json=${(spec.inputSchema)}, headers={"Authorization": "Bearer low_privilege"})
    assert response.status_code == 403

@pytest.mark.asyncio
async def test_not_found_404():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.${spec.method.toLowerCase()}("${spec.url}/invalid_id", json=${(spec.inputSchema)})
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_internal_server_error_500():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.${spec.method.toLowerCase()}("${spec.url}", json=${(spec.inputSchema)}, headers={"X-Force-500": "true"})
    assert response.status_code == 500
`;
  }
};
