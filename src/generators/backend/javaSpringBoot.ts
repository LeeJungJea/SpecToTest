import type { ParsedApiSpec } from '../../types';
import { generateMockJsonString, getFirstRequiredField } from '../mockDataGenerator';export const javaSpringBootGenerator = {
  generateTest(spec: ParsedApiSpec): string {
    const url = spec.url;
    const method = spec.method.toLowerCase();

    return `import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ApiController.class)
public class ApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // 1. Happy Path
    @Test
    public void testHappyPath() throws Exception {
        mockMvc.perform(${method}("${url}")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""${generateMockJsonString(spec.inputSchema)}"""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    // 2. Error Cases (400, 401, 403, 404, 500)
    @Test
    public void testBadRequest400() throws Exception {
        mockMvc.perform(${method}("${url}")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \\"invalid\\": \\"data\\" }"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    public void testUnauthorized401() throws Exception {
        mockMvc.perform(${method}("${url}")
                .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testForbidden403() throws Exception {
        mockMvc.perform(${method}("${url}")
                .header("Authorization", "Bearer forbidden-token"))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testNotFound404() throws Exception {
        mockMvc.perform(${method}("${url}99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testInternalServerError500() throws Exception {
        // Assuming a specific header triggers a mocked 500 error for testing
        mockMvc.perform(${method}("${url}")
                .header("X-Test-Scenario", "InternalServerError"))
                .andExpect(status().isInternalServerError());
    }

    // 3. Edge Cases
    @Test
    public void testNullValuesInRequest() throws Exception {
        mockMvc.perform(${method}("${url}")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \\"${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}\\": null }"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testEmptyStringValuesInRequest() throws Exception {
        mockMvc.perform(${method}("${url}")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \\"${getFirstRequiredField(spec.inputSchema)?.name || 'dummy'}\\": \\"\\" }"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testMissingRequiredFields() throws Exception {
        mockMvc.perform(${method}("${url}")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}")) // Body missing completely
                .andExpect(status().isBadRequest());
    }
}
`;
  }
};
