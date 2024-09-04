package com.example.ec2_management_service.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Map;

@Service
public class EC2Service {

    private static final String TERRAFORM_DIR = "./terraform";  // Update with your Terraform directory path

    public String provisionInstances() {
        return executeTerraformCommand("apply -auto-approve");
    }

    public String terminateInstances() {
        return executeTerraformCommand("destroy -auto-approve");
    }

    public String getInstanceStatus() {
        return executeTerraformCommand("output");
    }

    private String executeTerraformCommand(String command) {
        StringBuilder output = new StringBuilder();
        try {
            ProcessBuilder processBuilder = new ProcessBuilder();
            processBuilder.directory(new java.io.File(TERRAFORM_DIR));

            // Set environment variables for AWS credentials
            Map<String, String> environment = processBuilder.environment();
            environment.put("AWS_ACCESS_KEY_ID", System.getenv("AWS_ACCESS_KEY_ID"));
            environment.put("AWS_SECRET_ACCESS_KEY", System.getenv("AWS_SECRET_ACCESS_KEY"));

            // Run Terraform init and the provided command
            processBuilder.command("sh", "-c", "terraform init && terraform " + command);

            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            process.waitFor();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error executing Terraform command: " + e.getMessage();
        }
        return output.toString();
    }
}
