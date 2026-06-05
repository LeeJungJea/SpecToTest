import type { ParsedApiSpec } from '../../types';
import { generateMockJsonString, getFirstRequiredField } from '../mockDataGenerator';export const elixirPhoenixGenerator = {
  generateTest(spec: ParsedApiSpec): string {
    return `defmodule MyAppWeb.EndpointTest do
  use MyAppWeb.ConnCase

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "${spec.method.toUpperCase()} ${spec.url}" do
    test "returns 200 OK on Happy Path", %{conn: conn} do
      conn = ${spec.method.toLowerCase()}(conn, "${spec.url}", ~s(${generateMockJsonString(spec.inputSchema)}))
      assert json_response(conn, 200)
    end

    test "returns 400 on missing fields", %{conn: conn} do
      conn = ${spec.method.toLowerCase()}(conn, "${spec.url}", %{})
      assert json_response(conn, 400)
    end

    test "returns 400 on null fields", %{conn: conn} do
      conn = ${spec.method.toLowerCase()}(conn, "${spec.url}", %{"${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}" => nil})
      assert json_response(conn, 400)
    end

    test "returns 400 on empty string", %{conn: conn} do
      conn = ${spec.method.toLowerCase()}(conn, "${spec.url}", %{"${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}" => ""})
      assert json_response(conn, 400)
    end

    test "returns 401 on missing token", %{conn: conn} do
      conn = ${spec.method.toLowerCase()}(conn, "${spec.url}", ~s(${generateMockJsonString(spec.inputSchema)}))
      assert json_response(conn, 401)
    end

    test "returns 403 on insufficient permissions", %{conn: conn} do
      conn = conn |> put_req_header("authorization", "Bearer low_priv")
      conn = ${spec.method.toLowerCase()}(conn, "${spec.url}", ~s(${generateMockJsonString(spec.inputSchema)}))
      assert json_response(conn, 403)
    end

    test "returns 404 for non-existent resource", %{conn: conn} do
      conn = ${spec.method.toLowerCase()}(conn, "${spec.url}/invalid_id", ~s(${generateMockJsonString(spec.inputSchema)}))
      assert json_response(conn, 404)
    end

    test "returns 500 on internal server error", %{conn: conn} do
      conn = conn |> put_req_header("x-trigger-error", "true")
      conn = ${spec.method.toLowerCase()}(conn, "${spec.url}", ~s(${generateMockJsonString(spec.inputSchema)}))
      assert json_response(conn, 500)
    end
  end
end
`;
  }
};
