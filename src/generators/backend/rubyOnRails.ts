import type { ParsedApiSpec } from '../../types';
import { generateMockJsonString, getFirstRequiredField } from '../mockDataGenerator';export const rubyOnRailsGenerator = {
  generateTest(spec: ParsedApiSpec): string {
    return `require 'rails_helper'

RSpec.describe "${spec.url} requests", type: :request do
  describe "${spec.method.toUpperCase()} ${spec.url}" do
    it "returns 200 OK on Happy Path" do
      ${spec.method.toLowerCase()} "${spec.url}", params: JSON.parse('${generateMockJsonString(spec.inputSchema)}'), as: :json
      expect(response).to have_http_status(:ok)
    end

    it "returns 400 Bad Request on missing fields" do
      ${spec.method.toLowerCase()} "${spec.url}", params: {}, as: :json
      expect(response).to have_http_status(:bad_request)
    end

    it "returns 400 Bad Request on null fields" do
      ${spec.method.toLowerCase()} "${spec.url}", params: { "${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}": nil }, as: :json
      expect(response).to have_http_status(:bad_request)
    end

    it "returns 400 Bad Request on empty strings" do
      ${spec.method.toLowerCase()} "${spec.url}", params: { "${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}": '' }, as: :json
      expect(response).to have_http_status(:bad_request)
    end

    it "returns 401 Unauthorized when missing token" do
      ${spec.method.toLowerCase()} "${spec.url}", params: JSON.parse('${generateMockJsonString(spec.inputSchema)}'), as: :json
      expect(response).to have_http_status(:unauthorized)
    end

    it "returns 403 Forbidden when insufficient permissions" do
      ${spec.method.toLowerCase()} "${spec.url}", params: JSON.parse('${generateMockJsonString(spec.inputSchema)}'), headers: { 'Authorization' => 'Bearer low_priv' }, as: :json
      expect(response).to have_http_status(:forbidden)
    end

    it "returns 404 Not Found for non-existent resource" do
      ${spec.method.toLowerCase()} "${spec.url}/invalid_id", params: JSON.parse('${generateMockJsonString(spec.inputSchema)}'), as: :json
      expect(response).to have_http_status(:not_found)
    end

    it "returns 500 Internal Server Error on server failure" do
      ${spec.method.toLowerCase()} "${spec.url}", params: JSON.parse('${generateMockJsonString(spec.inputSchema)}'), headers: { 'X-Trigger-Error' => 'true' }, as: :json
      expect(response).to have_http_status(:internal_server_error)
    end
  end
end
`;
  }
};
