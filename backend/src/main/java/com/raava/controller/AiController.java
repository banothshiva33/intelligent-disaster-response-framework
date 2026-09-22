package com.raava.controller;

import com.raava.dto.RaavaDtos;
import com.raava.exception.ApiException;
import com.raava.model.User;
import com.raava.service.MlPredictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AiController {
    private final MlPredictionService mlPredictionService;

    public AiController(MlPredictionService mlPredictionService) {
        this.mlPredictionService = mlPredictionService;
    }

    @PostMapping("/ai/predict-severity")
    public ResponseEntity<Map<String, Object>> predictSeverity(@RequestBody RaavaDtos.PredictionRequest request) {
        try {
            Map<String, Object> prediction = mlPredictionService.predictSeverity(request);
            Map<String, Object> body = new HashMap<>();
            body.put("success", true);
            body.put("prediction", prediction);
            return ResponseEntity.ok(body);
        } catch (IllegalStateException ex) {
            throw new ApiException(503, "ML service unavailable: " + ex.getMessage());
        }
    }
}
