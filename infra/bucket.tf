resource "upcloud_object_storage" "SMSummarizer_S3" {
  size = 250
  name = "sms-bucket"
  # The zone in which to create the instance
  zone = var.zone
  access_key = "admin"
  # The secret key/password used to access the storage instance
  secret_key  = "changeme123"
  description = "catalogue"

  # Create a bucket called "products"
  bucket {
    name = "summaries"
  }
}