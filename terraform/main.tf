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

# --- Dev Frontend GCS Bucket ---
resource "google_storage_bucket" "dev_frontend" {
  name                        = "${var.app_name}-dev-frontend"
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

# Grant public access to dev bucket
resource "google_storage_bucket_iam_binding" "public_dev" {
  bucket = google_storage_bucket.dev_frontend.name
  role   = "roles/storage.objectViewer"
  members = [
    "allUsers",
  ]
}

# --- Prod Frontend GCS Bucket ---
resource "google_storage_bucket" "prod_frontend" {
  name                        = "${var.app_name}-prod-frontend"
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

# Grant public access to prod bucket
resource "google_storage_bucket_iam_binding" "public_prod" {
  bucket = google_storage_bucket.prod_frontend.name
  role   = "roles/storage.objectViewer"
  members = [
    "allUsers",
  ]
}

# --- Outputs ---
output "dev_gcs_url" {
  value       = "https://storage.googleapis.com/${google_storage_bucket.dev_frontend.name}"
  description = "The public GCS URL of the Dev bucket"
}

output "prod_gcs_url" {
  value       = "https://storage.googleapis.com/${google_storage_bucket.prod_frontend.name}"
  description = "The public GCS URL of the Prod bucket"
}
