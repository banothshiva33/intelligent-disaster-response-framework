package com.raava.service;

import com.raava.dto.RaavaDtos;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.Map;

@Service
public class MlPredictionService {
    private final RestClient restClient;
    private final String baseUrl;

    public MlPredictionService(RestClient restClient, @Value("${ml.service.url}") String baseUrl) {
        this.restClient = restClient;
        this.baseUrl = baseUrl;
    }

    public Map<String, Object> predictSeverity(RaavaDtos.PredictionRequest request) {
        try {
            var body = Map.of(
                    "disaster_type", request.disasterType(),
                    "location", request.location(),
                    "affected_population", request.affectedPopulation(),
                    "deaths", request.deaths(),
                    "injured", request.injured(),
                    "economic_damage", request.economicDamage()
            );

            return restClient.post()
                    .uri(baseUrl + "/predict-severity")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, (req, res) -> {
                        throw new IllegalStateException("ML service returned an error response.");
                    })
                    .body(Map.class);
        } catch (ResourceAccessException | HttpClientErrorException ex) {
            throw new IllegalStateException("AI service is unavailable or timed out.", ex);
        }
    }
}
