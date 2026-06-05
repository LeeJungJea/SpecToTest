import type { ParsedApiSpec } from '../../types';
import { generateMockJsonString, getFirstRequiredField } from '../mockDataGenerator';export const kotlinKtorGenerator = {
  generateTest(spec: ParsedApiSpec): string {
    return `package com.example.tests

import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.server.testing.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class EndpointTest {

    @Test
    fun testHappyPath200() = testApplication {
        val response = client.${spec.method.toLowerCase()}("${spec.url}") {
            header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            setBody("""${generateMockJsonString(spec.inputSchema)}""")
        }
        assertEquals(HttpStatusCode.OK, response.status)
    }

    @Test
    fun testMissingFields400() = testApplication {
        val response = client.${spec.method.toLowerCase()}("${spec.url}") {
            header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            setBody("{}")
        }
        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun testNullFields400() = testApplication {
        val response = client.${spec.method.toLowerCase()}("${spec.url}") {
            header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            setBody("""{"${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}":null}""")
        }
        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun testEmptyString400() = testApplication {
        val response = client.${spec.method.toLowerCase()}("${spec.url}") {
            header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            setBody("""{"${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}":""}""")
        }
        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun testUnauthorized401() = testApplication {
        val response = client.${spec.method.toLowerCase()}("${spec.url}") {
            header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            setBody("""${generateMockJsonString(spec.inputSchema)}""")
        }
        assertEquals(HttpStatusCode.Unauthorized, response.status)
    }

    @Test
    fun testForbidden403() = testApplication {
        val response = client.${spec.method.toLowerCase()}("${spec.url}") {
            header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            header(HttpHeaders.Authorization, "Bearer invalid")
            setBody("""${generateMockJsonString(spec.inputSchema)}""")
        }
        assertEquals(HttpStatusCode.Forbidden, response.status)
    }

    @Test
    fun testNotFound404() = testApplication {
        val response = client.${spec.method.toLowerCase()}("${spec.url}/invalid") {
            header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            setBody("""${generateMockJsonString(spec.inputSchema)}""")
        }
        assertEquals(HttpStatusCode.NotFound, response.status)
    }

    @Test
    fun testInternalServerError500() = testApplication {
        val response = client.${spec.method.toLowerCase()}("${spec.url}") {
            header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            header("X-Trigger-Error", "true")
            setBody("""${generateMockJsonString(spec.inputSchema)}""")
        }
        assertEquals(HttpStatusCode.InternalServerError, response.status)
    }
}
`;
  }
};
