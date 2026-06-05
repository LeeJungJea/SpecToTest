import type { ParsedApiSpec } from '../../types';
import { generateMockJsonString, getFirstRequiredField } from '../mockDataGenerator';export const csharpDotnetGenerator = {
  generateTest(spec: ParsedApiSpec): string {
    return `using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace MyApp.Tests
{
    public class EndpointTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public EndpointTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task HappyPath_Returns200Ok()
        {
            var content = new StringContent(@"${generateMockJsonString(spec.inputSchema)}", System.Text.Encoding.UTF8, "application/json");
            var response = await _client.${spec.method.substring(0,1).toUpperCase() + spec.method.substring(1).toLowerCase()}Async("${spec.url}", content);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task MissingFields_Returns400BadRequest()
        {
            var content = new StringContent("{}", System.Text.Encoding.UTF8, "application/json");
            var response = await _client.${spec.method.substring(0,1).toUpperCase() + spec.method.substring(1).toLowerCase()}Async("${spec.url}", content);
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task NullFields_Returns400BadRequest()
        {
            var content = new StringContent($"{{\"${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}\": null}}", System.Text.Encoding.UTF8, "application/json");
            var response = await _client.${spec.method.substring(0,1).toUpperCase() + spec.method.substring(1).toLowerCase()}Async("${spec.url}", content);
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task EmptyString_Returns400BadRequest()
        {
            var content = new StringContent($"{{\"${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}\": \"\"}}", System.Text.Encoding.UTF8, "application/json");
            var response = await _client.${spec.method.substring(0,1).toUpperCase() + spec.method.substring(1).toLowerCase()}Async("${spec.url}", content);
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Unauthorized_Returns401()
        {
            var content = new StringContent(@"${generateMockJsonString(spec.inputSchema)}", System.Text.Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage(HttpMethod.${spec.method.toUpperCase()}, "${spec.url}") { Content = content };
            var response = await _client.SendAsync(request);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Forbidden_Returns403()
        {
            var content = new StringContent(@"${generateMockJsonString(spec.inputSchema)}", System.Text.Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage(HttpMethod.${spec.method.toUpperCase()}, "${spec.url}") { Content = content };
            request.Headers.Add("Authorization", "Bearer invalid");
            var response = await _client.SendAsync(request);
            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }

        [Fact]
        public async Task NotFound_Returns404()
        {
            var content = new StringContent(@"${generateMockJsonString(spec.inputSchema)}", System.Text.Encoding.UTF8, "application/json");
            var response = await _client.${spec.method.substring(0,1).toUpperCase() + spec.method.substring(1).toLowerCase()}Async("${spec.url}/invalid", content);
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task InternalServerError_Returns500()
        {
            var content = new StringContent(@"${generateMockJsonString(spec.inputSchema)}", System.Text.Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage(HttpMethod.${spec.method.toUpperCase()}, "${spec.url}") { Content = content };
            request.Headers.Add("X-Trigger-Error", "true");
            var response = await _client.SendAsync(request);
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }
    }
}
`;
  }
};
