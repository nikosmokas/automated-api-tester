variable "access_key" {
  description = "AWS Access Key ID"
  type        = string
  sensitive   = true
}

variable "secret_key" {
  description = "AWS Secret Access Key"
  type        = string
  sensitive   = true
}

variable "region" {
  description = "AWS region to create resources in"
  type        = string
  default     = "us-east-1"
}

variable "instance_count" {
  description = "Number of EC2 instances to create"
  type        = number
  default     = 1
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "ami_id" {
  description = "AMI ID to use for EC2 instances"
  type        = string
}

variable "key_name" {
  description = "Name of the SSH key pair to use for EC2 instances"
  type        = string
}
