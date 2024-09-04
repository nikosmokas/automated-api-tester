package com.example.queue_management_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.queue_management_service.model.Job;
import com.example.queue_management_service.service.QueueService;

import java.util.List;

@RestController
@RequestMapping("/queue")
public class QueueController {

    @Autowired
    private QueueService queueService;

    @PostMapping
    public String addJob(@RequestBody Job job) {
        queueService.addJob(job);
        return "Job added to queue";
    }

    @GetMapping("/status")
    public List<Object> getQueueStatus() {
        return queueService.getQueueStatus();
    }

    @DeleteMapping
    public Job dequeueJob() {
        return queueService.dequeueJob();
    }
}
