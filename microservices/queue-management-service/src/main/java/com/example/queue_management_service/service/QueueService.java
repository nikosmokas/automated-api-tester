package com.example.queue_management_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.example.queue_management_service.model.Job;

import java.util.List;

@Service
public class QueueService {

    private static final String QUEUE_KEY = "jobQueue";

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public void addJob(Job job) {
        redisTemplate.opsForList().rightPush(QUEUE_KEY, job);
    }

    public Job dequeueJob() {
        return (Job) redisTemplate.opsForList().leftPop(QUEUE_KEY);
    }

    public List<Object> getQueueStatus() {
        return redisTemplate.opsForList().range(QUEUE_KEY, 0, -1);
    }
}
