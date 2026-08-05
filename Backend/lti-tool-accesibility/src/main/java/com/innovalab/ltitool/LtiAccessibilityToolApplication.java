package com.innovalab.ltitool;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class LtiAccessibilityToolApplication {

	public static void main(String[] args) {
		SpringApplication.run(LtiAccessibilityToolApplication.class, args);
	}
}