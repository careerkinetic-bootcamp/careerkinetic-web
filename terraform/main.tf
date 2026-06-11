terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  backend "gcs" {
    bucket = "careerkinetic-tf-state"
    prefix = "state/frontend"
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# --- Frontend GCS Bucket ---
resource "google_storage_bucket" "frontend" {
  name                        = "${var.app_name}-${var.environment}-frontend"
  location                    = var.gcp_region
  force_destroy               = true
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# Grant public access to frontend bucket
resource "google_storage_bucket_iam_binding" "public" {
  bucket = google_storage_bucket.frontend.name
  role   = "roles/storage.objectViewer"
  members = [
    "allUsers",
  ]
}

# --- Outputs ---
output "gcs_url" {
  value       = "https://storage.googleapis.com/${google_storage_bucket.frontend.name}"
  description = "The public GCS URL of the frontend bucket"
}

