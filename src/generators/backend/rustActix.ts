import type { ParsedApiSpec } from '../../types';
import { generateMockJsonString, getFirstRequiredField } from '../mockDataGenerator';export const rustActixGenerator = {
  generateTest(spec: ParsedApiSpec): string {
    return `#[cfg(test)]
mod tests {
    use actix_web::{test, App, http::StatusCode};
    use crate::app_config; // Assume configuration function

    #[actix_web::test]
    async fn test_happy_path_200() {
        let mut app = test::init_service(App::new().configure(app_config)).await;
        let req = test::TestRequest::${spec.method.toLowerCase()}().uri("${spec.url}")
            .set_payload(r#"${generateMockJsonString(spec.inputSchema)}"#)
            .insert_header(("Content-Type", "application/json"))
            .to_request();
        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), StatusCode::OK);
    }

    #[actix_web::test]
    async fn test_missing_fields_400() {
        let mut app = test::init_service(App::new().configure(app_config)).await;
        let req = test::TestRequest::${spec.method.toLowerCase()}().uri("${spec.url}")
            .set_payload(r#"{}"#)
            .insert_header(("Content-Type", "application/json"))
            .to_request();
        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
    }

    #[actix_web::test]
    async fn test_null_fields_400() {
        let mut app = test::init_service(App::new().configure(app_config)).await;
        let req = test::TestRequest::${spec.method.toLowerCase()}().uri("${spec.url}")
            .set_payload(r#"{"${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}": null}"#)
            .insert_header(("Content-Type", "application/json"))
            .to_request();
        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
    }

    #[actix_web::test]
    async fn test_empty_string_400() {
        let mut app = test::init_service(App::new().configure(app_config)).await;
        let req = test::TestRequest::${spec.method.toLowerCase()}().uri("${spec.url}")
            .set_payload(r#"{"${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}": ""}"#)
            .insert_header(("Content-Type", "application/json"))
            .to_request();
        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
    }

    #[actix_web::test]
    async fn test_unauthorized_401() {
        let mut app = test::init_service(App::new().configure(app_config)).await;
        let req = test::TestRequest::${spec.method.toLowerCase()}().uri("${spec.url}")
            .set_payload(r#"${generateMockJsonString(spec.inputSchema)}"#)
            .insert_header(("Content-Type", "application/json"))
            .to_request();
        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), StatusCode::UNAUTHORIZED);
    }

    #[actix_web::test]
    async fn test_forbidden_403() {
        let mut app = test::init_service(App::new().configure(app_config)).await;
        let req = test::TestRequest::${spec.method.toLowerCase()}().uri("${spec.url}")
            .insert_header(("Authorization", "Bearer invalid"))
            .set_payload(r#"${generateMockJsonString(spec.inputSchema)}"#)
            .insert_header(("Content-Type", "application/json"))
            .to_request();
        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), StatusCode::FORBIDDEN);
    }

    #[actix_web::test]
    async fn test_not_found_404() {
        let mut app = test::init_service(App::new().configure(app_config)).await;
        let req = test::TestRequest::${spec.method.toLowerCase()}().uri(&format!("{}/invalid", "${spec.url}"))
            .set_payload(r#"${generateMockJsonString(spec.inputSchema)}"#)
            .insert_header(("Content-Type", "application/json"))
            .to_request();
        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), StatusCode::NOT_FOUND);
    }

    #[actix_web::test]
    async fn test_internal_server_error_500() {
        let mut app = test::init_service(App::new().configure(app_config)).await;
        let req = test::TestRequest::${spec.method.toLowerCase()}().uri("${spec.url}")
            .insert_header(("X-Trigger-Error", "true"))
            .set_payload(r#"${generateMockJsonString(spec.inputSchema)}"#)
            .insert_header(("Content-Type", "application/json"))
            .to_request();
        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), StatusCode::INTERNAL_SERVER_ERROR);
    }
}
`;
  }
};
