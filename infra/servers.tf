resource "upcloud_server" "app" {
  zone = var.zone
  hostname = "app${count.index +1}.startup.io"
  plan = var.plans["db"]
  count = var.app-scaling


  login {
    user = "tf"
    keys = [
        var.public_key,
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
  provisioner "file" {
    source = "../llm/app.py"
    destination = "app.py"
  }
  
  provisioner "remote-exec" {
    
    inline = [
        "sudo apt update -y",
        "sudo apt install python3-pip -y",
        "pip3 install gunicorn",
        "pip3 install flask",
        "pip3 install --upgrade pip",
        "pip3 install transformers",
        "pip3 install Werkzeug",
        "pip3 install torch",
        "python3 -m gunicorn -b 0.0.0.0:5000 app:app --timeout 1000"
    ]
  }
}

resource "upcloud_server" "backend" {
  hostname = "backend.startup.io"
  zone = var.zone
  plan = var.plans["app"]
  count = var.app-scaling

  login {
    user = "tf"
    keys = [
        var.public_key,
    ]
    create_password = false
    password_delivery = "none"
  }

  template {
    size = 25 
    
    # Template UUID for Ubuntu 20.04
    storage = "01000000-0000-4000-8000-000030200200"
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
    script = "init.sh"
  }

  provisioner "file" {
    source = "../sms-ai-backend/"
    destination = "sms-ai-backend"
  }
  
}