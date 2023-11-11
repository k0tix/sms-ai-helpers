resource "upcloud_network" "app_network" {
  name = "Application network"
  zone = var.zone 

  ip_network {
    address = "172.20.1.0/24"
    dhcp    = true
    family  = "IPv4"
  }
}

resource "upcloud_network" "db_network" {
  name = "Database network"
  zone = var.zone 

  ip_network {
    address = "172.20.2.0/24"
    dhcp    = true
    family  = "IPv4"
  }
}

resource "upcloud_floating_ip_address" "lb_vip" {
  depends_on = [upcloud_server.lb[0]]
  zone        = var.zone 
  mac_address = upcloud_server.lb[0].network_interface[0].mac_address
}