terraform {
  required_providers {
    upcloud = {
      source = "UpCloudLtd/upcloud"
      version = "~> 2.0"
    }
  }
}

provider "upcloud" {
  # Your UpCloud credentials are read from the environment variables:
  username="apinavapina"
  password="-w{=S{EP}cd73(;g/$KeqI:2zcpKW0w("
}
