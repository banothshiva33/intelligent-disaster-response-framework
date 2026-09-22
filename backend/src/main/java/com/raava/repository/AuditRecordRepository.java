package com.raava.repository;

import com.raava.model.AuditRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditRecordRepository extends MongoRepository<AuditRecord, String> {
}
