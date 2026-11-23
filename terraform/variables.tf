variable "aws_region" {
  description = "AWS deployment region"
  type        = string
  default     = "eu-central-1"
}

variable "ami_id" {
  description = "Official Ubuntu 22.04 LTS AMI ID for eu-central-1 (Frankfurt)"
  type        = string
  default     = "ami-08c53f88461834e96"
}

variable "instance_type" {
  description = "EC2 instance size (Free Tier eligible: t2.micro)"
  type        = string
  default     = "t3.medium"
}

variable "key_name" {
  description = "Optional EC2 SSH Key Pair name"
  type        = string
  default     = ""
}

variable "s3_bucket_name" {
  description = "Globally unique name for the S3 bucket"
  type        = string
  default     = "smart-inventory-depi-omar-2026-s3"
}
