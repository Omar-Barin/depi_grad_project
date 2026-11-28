> 📎 Project Name : Smart Inventory Management System

> 📌 Project Overview: A microservices-based inventory platform featuring real-time tracking and alerting, deployed on cloud infrastructure through a fully automated DevOps pipeline utilizing Docker, Kubernetes, Jenkins CI/CD, Terraform, Ansible, and Prometheus.

> 👥 Team Members:

Omar Mohamed Abdelkader

Khaled Yousry Hassan

Ahmed Reda Ahmed

Yousef Ahmed Sayed

Mustafa Muhammad Abdulhammed

> 📎🎓 Instructor : Mohamed Rahim

---

## Overview

Manual stock tracking makes it easy to miss low inventory or over-order items. This project provides a web-based inventory dashboard and an automated low-stock alert service, paired with an end-to-end DevOps workflow that automates infrastructure provisioning, server configuration, container builds, Kubernetes deployment, and monitoring.

## Application Services

- **Frontend (`client/`)**: React and TypeScript dashboard built into an Nginx Alpine container that serves the UI and reverse-proxies `/api/` and `/alerts/` to the backend services.
- **Backend API (`server/`)**: FastAPI and SQLAlchemy service connected to PostgreSQL, providing product CRUD endpoints, `/health`, `/metrics`, startup retries, and database advisory locking so multiple replicas seed safely.
- **Alert Service (`alert-service/`)**: FastAPI background worker that polls `/products` every 15 seconds and flags low-stock items (`<= 10` as `WARNING`, `0` as `CRITICAL`).
- **Database (`postgres`)**: PostgreSQL 17 instance backed by persistent storage.

## DevOps Architecture

- **Containerization (`Docker` & `Docker Compose`)**: Each service is containerized with its own `Dockerfile` (using a multi-stage build for the Nginx frontend). `docker-compose.yml` orchestrates the full local stack alongside Prometheus, Grafana, and Node Exporter.
- **Infrastructure as Code (`terraform/`)**: Provisions the AWS VPC (`10.0.0.0/16`), public subnet, internet gateway, route table, security group, Ubuntu 24.04 EC2 instance (`m7i-flex.large`) in `eu-north-1`, and an encrypted, versioned S3 bucket.
- **Configuration Management (`ansible/`)**: Connects over SSH to harden UFW firewall rules, install Docker, set up K3s (lightweight Kubernetes), and install Java 21 with Jenkins configured for Docker and `kubectl` access.
- **Kubernetes Orchestration (`k8s/`)**: Runs the workloads on K3s with 2 replicas for `client` and `server`, ClusterIP internal services, Traefik Ingress on port `80`, ConfigMaps and Secrets injected from `.env` via `envsubst`, init-container database checks, liveness/readiness probes, and a 2Gi PersistentVolumeClaim for PostgreSQL.
- **CI/CD Pipeline (`Jenkinsfile`)**: Triggered by GitHub push webhooks to run Python syntax and React ESLint checks inside containers, build and push images tagged with both the build number and `latest` to Docker Hub, and roll out updates to K3s.
- **Monitoring (`monitoring/`)**: Prometheus scrapes `/metrics` from both backend services and `node-exporter` every 5 seconds; Grafana auto-loads the Prometheus datasource and a pre-configured dashboard for uptime, request rate, and 95th-percentile latency.

## Repository Structure

- `client/` — React UI, Nginx configuration, and multi-stage Dockerfile
- `server/` — FastAPI backend, database config, and Dockerfile
- `alert-service/` — Low-stock polling service and Dockerfile
- `terraform/` — AWS networking, EC2, security group, and S3 bucket definitions
- `ansible/` — Server inventory and provisioning playbook
- `k8s/` — Kubernetes manifests for application, database, ingress, and monitoring
- `monitoring/` — Prometheus scrape config and Grafana provisioning files
- `docker-compose.yml` — Local multi-container stack
- `Jenkinsfile` — Declarative CI/CD pipeline
- `.env.example` — Template environment variables

## Deployment Flow

1. **Environment Setup**: Copy `.env.example` to `.env` and set your database password, Grafana password, and Docker Hub username.
2. **Local Run (Optional)**: Start the full stack locally with Docker Compose to access the app on port `3000`, backend docs on `8000`, alerts on `8001`, Prometheus on `9090`, and Grafana on `3001`.
3. **Provision AWS Infrastructure**: Configure `terraform/terraform.tfvars` with your EC2 key pair name and unique S3 bucket name, then initialize and apply Terraform in `terraform/` and note the output EC2 public IP.
4. **Configure the Server**: Put the EC2 public IP and `.pem` key path in `ansible/hosts.ini`, run the Ansible playbook in `ansible/`, and copy the printed Jenkins initial admin password.
5. **Configure Jenkins & Deploy**: Open Jenkins on port `8080`, complete setup, add `dockerhub-creds` (username/password) and `inventory-env` (secret file `.env`) in Jenkins Credentials, create a Pipeline job pointing to `Jenkinsfile`, and connect your GitHub repository webhook to `http://<EC2_IP>:8080/github-webhook/`.
6. **Live Endpoints**: Once the pipeline runs, access the application on port `80`, Prometheus on port `9090`, Grafana on port `3001`, and Jenkins on port `8080`.
