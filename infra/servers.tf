resource "upcloud_server" "app" {
  zone = var.zone
  hostname = "app${count.index +1}.startup.io"
  plan = var.plans["app"]
  count = var.app-scaling


  login {
    user = "tf"
    keys = [
        var.public_key,
        "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC4mRbPAp8KdwUpGbVvddzRIsfM5tR4og2Sm9awQ7zD6YM5uazD7AxDWW0hEBgPp7BX/7FXdm5Yg1t/+mEkv2eZ6LaCPj456W3MimaUzptjDdDlE/FHqcplvryUfrOlfq5lLS9XWCwqNweBFcNuWmK4XHjGnjq2nTN+F9oWhlAGMVD6T1qCSMx1cEfW45GKw4xXZbJNzgxT8PQXaarmQs3GNFuU3+TNu9GGZk6mpoAOV6kF1Vcut8qeWwhnsgZD22zC+WIpLfncSgx/gEDX0uBdxKFc3Td8bUB2NU7OcSIdBAS+9BqaHYiIG5wcWKZzwCba49zMs4zypGNN4Ot3RGnonpJsW9X9J6JmatGyFVx7RbWz7XVHWqH2S5jL3J+dNpOR8/GwSWwwIhlS9cf1tFzNyOIT/szokXZcNo95WLFw4qU0zSK64rSHV225VClodr5Nd96fJwyOMuwnSbv/UrMr+XpI48r/69KN6U824W4EwqpZMVxMYggAY7nZL8yHAb0= Roope.Kausiala@M-FVFHF0WYQ05N"
    ]
    create_password = false
    password_delivery = "none"
  }

  template {
    size = var.storages[var.plans["app"]]
    storage = var.template
  }
  
  network_interface {
    type = "public"
  }
  
  connection {
        type     = "ssh"
        user     = "tf"
        private_key = file("~/.ssh/terraUpcloud")
        host     = self.network_interface[0].ip_address
    }

  provisioner "remote-exec" {
    
    inline = [
        "sudo apt install python3-pip",
        "pip3 install gunicorn",
        "pip3 install flask",
        "pip3 install --upgrade pip",
        "pip3 install transformers",
        "pip3 install Werkzeug",
        "pip3 install torch",
        "python3 -m gunicorn -b 0.0.0.0:5000 app:app"
    ]
  }
}