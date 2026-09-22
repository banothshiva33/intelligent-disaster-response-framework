package com.raava.repository;

import com.raava.model.User;
import com.raava.model.Volunteer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerRepository extends MongoRepository<Volunteer, String> {
    Optional<Volunteer> findByUser(User user);
    Optional<Volunteer> findByUserId(String userId);
    List<Volunteer> findByVerificationStatusAndAvailability(Volunteer.VerificationStatus verificationStatus, Volunteer.Availability availability);
}
