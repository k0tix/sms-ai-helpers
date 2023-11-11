# set the provider version
terraform {
  required_providers {
    upcloud = {
      source = "UpCloudLtd/upcloud"
      version = "~> 2.0"
    }
  }
}

# configure the provider
provider "upcloud" {
  # Your UpCloud credentials are read from the environment variables:
  username="apinavapina"
  password="-w{=S{EP}cd73(;g/$KeqI:2zcpKW0w("
}

# create a server
resource "upcloud_server" "example" {
  hostname = "terraform.example.tld"
  zone     = "de-fra1"
  plan     = "1xCPU-1GB"

  # Declare network interfaces
  network_interface {
    type = "public"
  }

  network_interface {
    type = "utility"
  }

  # Include at least one public SSH key
  login {
    user = "terraform"
    keys = [
      "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCWMexwQdQVDbTfXm/fNszZBdye8zurX/duJwd3PrSwRxWuaOg5yGJUakkcEiM5A+EdmIgCRRdkNpfplLU4ei1yStm+R7ymSaV0yPrCMa1S8xqqX/RdfotsvCyFEN1V606OYVyZmpcop97p9BqtJICBBSrz/FgMUM8xPKdw2hN+6ep0kzeJ4KcX0teuk3V8xqYcY+lN++VB0Asl9B3YjmUYvngu2tKYGKzYoCX99v6En2aXdAbW1pTWqQEGVmweuhNWaCcI6mC8vgWUS9KRQ8S3C/tDKFjSSp9K1Be+kECWBiZzXuMSXrX7QnHFbvayVCzMYQXiimf/ZwNLTUfjgkyWVEDP6GtwJdMKaPHu94AcgatfrDrzFfGUDExBale4AB9O2Exyfpu4CQVboxEoOD3PUQY53tSKuhmu7EbJlQttJ2R+AISKJEjV6tBAZFPiVVWMzD02vcuSMTjeyY6ZTflJjIMpxHJLz8GIBOgeJPfiEx/w3jC5ekKbJzQngUZiixE= juuusto@Oskaris-Air",
    ]
    create_password = false
  }

  # Provision the server with Ubuntu
  template {
    storage = "Ubuntu Server 20.04 LTS (Focal Fossa)"

    # Use all the space allotted by the selected simple plan
    size = 25

    # Enable backups
    backup_rule {
      interval  = "daily"
      time      = "0100"
      retention = 8
    }
  }
}