package com.raava.repository;

import com.raava.model.VerificationRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationRecordRepository extends MongoRepository<VerificationRecord, String> {
}
