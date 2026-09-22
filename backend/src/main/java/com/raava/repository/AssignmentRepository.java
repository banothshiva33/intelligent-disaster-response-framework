package com.raava.repository;

import com.raava.model.Assignment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends MongoRepository<Assignment, String> {
    List<Assignment> findByVolunteerId(String volunteerId);
    List<Assignment> findByIncidentId(String incidentId);
    boolean existsByVolunteerIdAndStatusIn(String volunteerId, List<Assignment.Status> statuses);
    boolean existsByIncidentIdAndVolunteerIdAndStatusIn(String incidentId, String volunteerId, List<Assignment.Status> statuses);
}
