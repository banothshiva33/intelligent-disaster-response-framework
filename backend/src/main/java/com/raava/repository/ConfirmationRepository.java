package com.raava.repository;

import com.raava.model.Confirmation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConfirmationRepository extends MongoRepository<Confirmation, String> {
    Optional<Confirmation> findByIncidentIdAndConfirmingUserId(String incidentId, String confirmingUserId);
}
