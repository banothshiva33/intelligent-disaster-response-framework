package com.raava.repository;

import com.raava.model.Evidence;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvidenceRepository extends MongoRepository<Evidence, String> {
    List<Evidence> findByIncidentId(String incidentId);
}
