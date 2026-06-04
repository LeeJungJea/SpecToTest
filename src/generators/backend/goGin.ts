import type { ParsedApiSpec } from '../../types';
import { generateMockJsonString, generatePythonDict, getFirstRequiredField } from '../mockDataGenerator';export const goGinGenerator = {
  generateTest(spec: ParsedApiSpec): string {
    return `package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"github.com/gin-gonic/gin"
	"github.com/stretch/testify/assert"
	"myapp/controllers"
)

func setupRouter() *gin.Engine {
	r := gin.Default()
	r.${spec.method.toUpperCase()}("${spec.url}", controllers.Handler)
	return r
}

func performRequest(r http.Handler, method, path string, body []byte, headers map[string]string) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(method, path, bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	for k, v := range headers {
		req.Header.Set(k, v)
	}
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestHappyPath200(t *testing.T) {
	router := setupRouter()
	body := []byte(\`${generateMockJsonString(spec.inputSchema)}\`)
	w := performRequest(router, "${spec.method.toUpperCase()}", "${spec.url}", body, nil)
	assert.Equal(t, 200, w.Code)
}

func TestMissingFields400(t *testing.T) {
	router := setupRouter()
	body := []byte(\`{}\`)
	w := performRequest(router, "${spec.method.toUpperCase()}", "${spec.url}", body, nil)
	assert.Equal(t, 400, w.Code)
}

func TestNullFields400(t *testing.T) {
	router := setupRouter()
	body := []byte(\`{"${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}": null}\`)
	w := performRequest(router, "${spec.method.toUpperCase()}", "${spec.url}", body, nil)
	assert.Equal(t, 400, w.Code)
}

func TestEmptyString400(t *testing.T) {
	router := setupRouter()
	body := []byte(\`{"${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}": ""}\`)
	w := performRequest(router, "${spec.method.toUpperCase()}", "${spec.url}", body, nil)
	assert.Equal(t, 400, w.Code)
}

func TestUnauthorized401(t *testing.T) {
	router := setupRouter()
	body := []byte(\`${generateMockJsonString(spec.inputSchema)}\`)
	w := performRequest(router, "${spec.method.toUpperCase()}", "${spec.url}", body, nil)
	assert.Equal(t, 401, w.Code)
}

func TestForbidden403(t *testing.T) {
	router := setupRouter()
	body := []byte(\`${generateMockJsonString(spec.inputSchema)}\`)
	w := performRequest(router, "${spec.method.toUpperCase()}", "${spec.url}", body, map[string]string{"Authorization": "Bearer low_priv"})
	assert.Equal(t, 403, w.Code)
}

func TestNotFound404(t *testing.T) {
	router := setupRouter()
	body := []byte(\`${generateMockJsonString(spec.inputSchema)}\`)
	w := performRequest(router, "${spec.method.toUpperCase()}", "${spec.url}/invalid", body, nil)
	assert.Equal(t, 404, w.Code)
}

func TestInternalServerError500(t *testing.T) {
	router := setupRouter()
	body := []byte(\`${generateMockJsonString(spec.inputSchema)}\`)
	w := performRequest(router, "${spec.method.toUpperCase()}", "${spec.url}", body, map[string]string{"X-Trigger-Error": "true"})
	assert.Equal(t, 500, w.Code)
}
`;
  }
};
