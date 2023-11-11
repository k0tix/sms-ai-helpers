variable "public_key" {
    type = string
    default = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCWMexwQdQVDbTfXm/fNszZBdye8zurX/duJwd3PrSwRxWuaOg5yGJUakkcEiM5A+EdmIgCRRdkNpfplLU4ei1yStm+R7ymSaV0yPrCMa1S8xqqX/RdfotsvCyFEN1V606OYVyZmpcop97p9BqtJICBBSrz/FgMUM8xPKdw2hN+6ep0kzeJ4KcX0teuk3V8xqYcY+lN++VB0Asl9B3YjmUYvngu2tKYGKzYoCX99v6En2aXdAbW1pTWqQEGVmweuhNWaCcI6mC8vgWUS9KRQ8S3C/tDKFjSSp9K1Be+kECWBiZzXuMSXrX7QnHFbvayVCzMYQXiimf/ZwNLTUfjgkyWVEDP6GtwJdMKaPHu94AcgatfrDrzFfGUDExBale4AB9O2Exyfpu4CQVboxEoOD3PUQY53tSKuhmu7EbJlQttJ2R+AISKJEjV6tBAZFPiVVWMzD02vcuSMTjeyY6ZTflJjIMpxHJLz8GIBOgeJPfiEx/w3jC5ekKbJzQngUZiixE= juuusto@Oskaris-Air"
}

variable "template" {
  type = string
  default = "Debian GNU/Linux 10 (Buster)"
}

variable "app-scaling" {
  default = 1
}

variable "plans" {
    type = map
    default = {
        "lb" = "1xCPU-2GB"
        "app" = "2xCPU-4GB"
        "db" = "4xCPU-8GB"
    }
}

variable "storages" {
    type = map
    default = {
        "1xCPU-2GB"  = "50"
        "2xCPU-4GB"  = "80"
        "4xCPU-8GB"  = "160"

    }
}

variable "zone" {
  type = string
  default = "pl-waw1"
}