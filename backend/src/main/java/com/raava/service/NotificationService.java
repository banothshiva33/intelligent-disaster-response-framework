package com.raava.service;

import com.raava.exception.ApiException;
import com.raava.model.Notification;
import com.raava.model.User;
import com.raava.repository.NotificationRepository;
import com.raava.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Object> listForCurrentUser(String userId) {
        List<Map<String, Object>> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(n -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", n.getId());
            item.put("type", n.getType().name());
            item.put("title", n.getTitle());
            item.put("message", n.getMessage());
            item.put("channel", n.getChannel());
            item.put("metadata", n.getMetadata() == null ? Map.of() : n.getMetadata());
            item.put("readAt", n.getReadAt());
            item.put("createdAt", n.getCreatedAt());
            return item;
        }).toList();
        return Map.of("success", true, "notifications", notifications);
    }

    public Map<String, Object> markAsRead(String userId, String notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(() -> new ApiException(404, "Notification not found."));
        if (!notification.getUser().getId().equals(userId)) {
            throw new ApiException(404, "Notification not found.");
        }
        if (notification.getReadAt() == null) {
            notification.setReadAt(Instant.now());
            notificationRepository.save(notification);
        }
        return Map.of("success", true, "notification", Map.of("id", notification.getId(), "readAt", notification.getReadAt()));
    }

    public Map<String, Object> sendNotification(String userId, String title, String message, String type) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ApiException(404, "User not found."));
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(Notification.Type.valueOf(type.toUpperCase()))
                .channel("MOCK_FCM")
                .metadata(Map.of())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        notificationRepository.save(notification);
        return Map.of("success", true, "notification", Map.of("id", notification.getId()));
    }
}
