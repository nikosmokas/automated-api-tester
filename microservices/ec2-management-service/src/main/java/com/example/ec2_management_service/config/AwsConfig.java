package com.example.ec2_management_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ec2.Ec2Client;

@Configuration
public class AwsConfig {

    @Bean
    public Ec2Client ec2Client() {
        // Retrieve AWS credentials from environment variables
        String accessKey = System.getenv("AWS_ACCESS_KEY_ID");
        String secretKey = System.getenv("AWS_SECRET_ACCESS_KEY");
        Region region = Region.of(System.getenv().getOrDefault("AWS_REGION", "eu-north-1")); // Default to us-east-1 if not set

        // Create AWS credentials provider
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKey, secretKey);

        // Create and return an EC2 client
        return Ec2Client.builder()
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .region(region)
                .build();
    }
}
