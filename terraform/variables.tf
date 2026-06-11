variable "gcp_project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "gcp_region" {
  description = "GCP region (targeting Asia for low latency)"
  type        = string
  default     = "asia-south2"
}

variable "app_name" {
  description = "Application name used for naming prefixes"
  type        = string
  default     = "careerkinetic"
}
