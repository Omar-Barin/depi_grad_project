output "vpc_id" {
  description = "ID of the provisioned AWS VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "ID of the Public Subnet"
  value       = aws_subnet.public.id
}

output "security_group_id" {
  description = "ID of the Security Group"
  value       = aws_security_group.app_sg.id
}

output "ec2_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.app_server.public_ip
}

output "s3_bucket_name" {
  description = "Name of the provisioned S3 bucket"
  value       = aws_s3_bucket.storage.id
}
