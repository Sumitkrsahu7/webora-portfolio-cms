package com.portfolio.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = OptionalSafeUrlValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT})
@Retention(RetentionPolicy.RUNTIME)
public @interface OptionalSafeUrl {
    String message() default "URL must use http://, https://, or a safe relative path";
    boolean allowRelative() default true;
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
