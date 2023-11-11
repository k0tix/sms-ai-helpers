resource "upcloud_managed_database_postgresql" "db" {
  name  = "postgres"
  plan  = "1x1xCPU-2GB-25GB"
  title = "postgres"
  zone  = var.zone
  properties {
    timezone       = "Europe/Helsinki"
    admin_username = "admin"
    admin_password = "bonsibuddy"
  }
}