variable "aws_region" {
  description = "AWS deployment region"
  type        = string
  default     = "eu-north-1"
}

variable "ami_id" {
  description = "Official Ubuntu 24.04 LTS AMI ID for eu-north-1 (Stockholm)"
  type        = string
  default     = "ami-08e03b36885006906"
}

variable "instance_type" {
  description = "EC2 instance size (Free tier eligible: m7i-flex.large)"
  type        = string
  default     = "m7i-flex.large"
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
