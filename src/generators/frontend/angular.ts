import type { ParsedApiSpec } from '../../types';
import { generateMockJsonString, getFirstRequiredField } from '../mockDataGenerator';

export const angularGenerator = {
  generateTest(spec: ParsedApiSpec): string {
    const reqField = getFirstRequiredField(spec.inputSchema);
    const fieldName = reqField ? reqField.name : 'dummy';
    const happyReqBody = generateMockJsonString(spec.inputSchema);
    const happyResBody = generateMockJsonString(spec.outputSchema);
    const nullBody = generateMockJsonString(spec.inputSchema, { [fieldName]: null });
    const emptyStringBody = generateMockJsonString(spec.inputSchema, { [fieldName]: '' });
    const missingBody = generateMockJsonString(spec.inputSchema, { [fieldName]: undefined });

    const endpoint = spec.url || '/api/default';
    const method = (spec.method || 'GET').toUpperCase();
    
    return `import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  constructor(private http: HttpClient) {}
  
  callApi(data?: any) {
    return this.http.request('${method}', '${endpoint}', { body: data });
  }
}

describe('Angular API Client Tests - ${endpoint}', () => {
  let service: ApiClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiClientService]
    });
    service = TestBed.inject(ApiClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Happy Path (200 OK)', () => {
    service.callApi(${happyReqBody}).subscribe(response => {
      expect(response).toEqual(${happyResBody});
    });

    const req = httpMock.expectOne('${endpoint}');
    expect(req.request.method).toBe('${method}');
    req.flush(${happyResBody});
  });

  it('Error Case (400 Bad Request)', () => {
    service.callApi(${happyReqBody}).subscribe({
      next: () => fail('should have failed with 400'),
      error: (error) => {
        expect(error.status).toBe(400);
      }
    });

    const req = httpMock.expectOne('${endpoint}');
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
  });

  it('Error Case (401 Unauthorized)', () => {
    service.callApi().subscribe({
      next: () => fail('should have failed with 401'),
      error: (error) => expect(error.status).toBe(401)
    });

    const req = httpMock.expectOne('${endpoint}');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('Error Case (403 Forbidden)', () => {
    service.callApi().subscribe({
      next: () => fail('should have failed with 403'),
      error: (error) => expect(error.status).toBe(403)
    });

    const req = httpMock.expectOne('${endpoint}');
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
  });

  it('Error Case (404 Not Found)', () => {
    service.callApi().subscribe({
      next: () => fail('should have failed with 404'),
      error: (error) => expect(error.status).toBe(404)
    });

    const req = httpMock.expectOne('${endpoint}');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('Error Case (500 Internal Server Error)', () => {
    service.callApi().subscribe({
      next: () => fail('should have failed with 500'),
      error: (error) => expect(error.status).toBe(500)
    });

    const req = httpMock.expectOne('${endpoint}');
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('Edge Case (null payload)', () => {
    service.callApi(${nullBody}).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('${endpoint}');
    expect(req.request.body).toEqual(${nullBody});
    req.flush({ success: true });
  });

  it('Edge Case (empty string payload)', () => {
    service.callApi(${emptyStringBody}).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('${endpoint}');
    expect(req.request.body).toEqual(${emptyStringBody});
    req.flush({ success: true });
  });

  it('Edge Case (missing fields)', () => {
    service.callApi(${missingBody}).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('${endpoint}');
    expect(req.request.body).toEqual(${missingBody});
    req.flush({ success: true });
  });
});
`;
  }
};
