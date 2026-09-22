package com.raava;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class RaavaApplication {
    public static void main(String[] args) {
        SpringApplication.run(RaavaApplication.class, args);
    }
}
