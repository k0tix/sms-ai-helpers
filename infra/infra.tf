terraform {
  required_providers {
    upcloud = {
      source  = "UpCloudLtd/upcloud"
      version = "~> 2.4"
    }
  }
}

provider "upcloud" {}

module "app" {
  source = "UpCloudLtd/highly-available-app/upcloud"

  app_name                   = "super_app"
  zone                       = "pl-waw1"
  private_network_cidr       = "10.0.42.0/24"
  servers_port               = 3000
  domains                    = ["my-domain.net"]
  servers_ssh_keys           = ["your-public-ssh-key"]
  servers_firewall_enabled   = true
  servers_allowed_remote_ips = ["123.123.123.123"]
}

# Additional user for our database
resource "upcloud_managed_database_user" "wordpress" {
  service  = module.app.database_id
  username = "wordpress"
  password = "supersecurepassword"
}

# Additional logical database
resource "upcloud_managed_database_logical_database" "wordpress" {
  service = module.app.database_id
  name    = "wordpress"
}

# Additional frontend rule for our main load balancer frontend
resource "upcloud_loadbalancer_frontend_rule" "test_env" {
  frontend = module.app.loadbalancer_frontend_id
  name     = "test_env"
  priority = 10

  matchers {
    url_param {
      method = "exact"
      name   = "test"
      value  = "true"
    }
  }

  actions {
    http_return {
      content_type = "text/html"
      status       = 200
      payload      = base64encode("This is test environment")
    }
  }
}

# Additional backend for our load balancer
resource "upcloud_loadbalancer_backend" "extra_backend" {
  loadbalancer = module.app.loadbalancer_id
  name         = "i_have_no_idea_what_this_does"
}

# Additional frontend for our load balancer
resource "upcloud_loadbalancer_frontend" "extra_frontend" {
  loadbalancer         = module.app.loadbalancer_id
  name                 = "no_idea_what_it_does_either"
  mode                 = "http"
  port                 = 8080
  default_backend_name = resource.upcloud_loadbalancer_backend.extra_backend.name
}

output "servers_public_ips" {
  value = module.app.web_servers_public_ips
}

output "url" {
  value = module.app.app_url
}