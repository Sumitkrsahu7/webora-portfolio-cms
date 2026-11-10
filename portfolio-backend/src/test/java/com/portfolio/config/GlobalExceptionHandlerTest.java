package com.portfolio.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler handler;

    @BeforeEach
    void setUp() {
        handler = new GlobalExceptionHandler();
    }

    @Test
    void shouldReturn413WhenUploadExceedsLimit() {
        MaxUploadSizeExceededException ex =
            new MaxUploadSizeExceededException(5 * 1024 * 1024);

        ResponseEntity<Map<String, Object>> response =
            handler.handleMaxUploadSizeExceeded(ex);

        assertEquals(HttpStatus.PAYLOAD_TOO_LARGE, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(413, response.getBody().get("status"));
        assertEquals("Payload Too Large", response.getBody().get("error"));
        assertTrue(response.getBody().get("message").toString().contains("5 MB"));
    }

    @Test
    void shouldReturn400ForMalformedJson() {
        HttpMessageNotReadableException ex =
            new HttpMessageNotReadableException("JSON parse error");

        ResponseEntity<Map<String, Object>> response =
            handler.handleNotReadable(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(400, response.getBody().get("status"));
        assertEquals("Malformed or unreadable JSON request body.", response.getBody().get("message"));
    }

    @Test
    void shouldReturnAppropriateStatusForResponseStatusException() {
        ResponseStatusException ex =
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found");

        ResponseEntity<Map<String, Object>> response =
            handler.handleResponseStatus(ex);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(404, response.getBody().get("status"));
        assertEquals("Resource not found", response.getBody().get("message"));
    }

    @Test
    void shouldReturn500WithoutLeakingInternalStackTrace() {
        RuntimeException ex = new RuntimeException("Sensitive database column failed at line 123");

        ResponseEntity<Map<String, Object>> response =
            handler.handleGeneralException(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(500, response.getBody().get("status"));
        assertEquals("Internal Server Error", response.getBody().get("error"));
        assertEquals("An unexpected error occurred. Please try again later.", response.getBody().get("message"));
        assertFalse(response.getBody().toString().contains("Sensitive database column"));
    }

    @Test
    void shouldReturn400WithFieldErrorsForValidationFailure() throws Exception {
        Object target = new Object();
        BeanPropertyBindingResult bindingResult =
            new BeanPropertyBindingResult(target, "request");
        bindingResult.addError(new FieldError("request", "email", "Must be a valid email"));

        java.lang.reflect.Method method = this.getClass().getDeclaredMethod("setUp");
        org.springframework.core.MethodParameter parameter =
            new org.springframework.core.MethodParameter(method, -1);

        MethodArgumentNotValidException ex =
            new MethodArgumentNotValidException(parameter, bindingResult);

        ResponseEntity<Map<String, Object>> response =
            handler.handleValidationExceptions(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Must be a valid email", response.getBody().get("message"));
        @SuppressWarnings("unchecked")
        Map<String, String> errors = (Map<String, String>) response.getBody().get("errors");
        assertNotNull(errors);
        assertEquals("Must be a valid email", errors.get("email"));
    }
}
