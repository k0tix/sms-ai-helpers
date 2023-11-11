resource "upcloud_server" "lb" {
  count    = 1 # Number of cloud instances to deploy
  zone     = var.zone
  hostname = "lb${count.index + 1}.startup.io"
  plan     = var.plans["lb"]
  firewall = true

  login {
    user = "root"
    keys = [
      var.public_key,
    ]
    create_password   = false
    password_delivery = "none"
  }

  template {
    size    = var.storages[var.plans["lb"]] # 50 GB
    storage = var.template 
  }

  network_interface {
    type = "public"
  }
  
  network_interface {
    type    = "private"
    network = upcloud_network.app_network.id
  }
}