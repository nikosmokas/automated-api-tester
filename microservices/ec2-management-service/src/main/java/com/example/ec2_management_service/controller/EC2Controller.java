package com.example.ec2_management_service.controller;

import com.example.ec2_management_service.service.EC2Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ec2")
public class EC2Controller {

    @Autowired
    private EC2Service ec2Service;

    @PostMapping("/provision")
    public ResponseEntity<String> provisionInstances() {
        String result = ec2Service.provisionInstances();
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/terminate")
    public ResponseEntity<String> terminateInstances() {
        String result = ec2Service.terminateInstances();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/status")
    public String getInstanceStatus() {
        return ec2Service.getInstanceStatus();
    }
}
