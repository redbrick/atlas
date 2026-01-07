job "atlas" {
  datacenters = ["aperture"]
  type        = "service"

  meta {
    git-sha = "[[.git_sha]]"
  }

  group "atlas-web" {
    count = 1

    network {
      port "http" {
        to = 80
      }
    }

    service {
      port = "http"

      check {
        type     = "http"
        path     = "/"
        interval = "10s"
        timeout  = "2s"
      }

      tags = [
        "traefik.enable=true",
        "traefik.http.routers.nginx-atlas.rule=(Host(`redbrick.dcu.ie`) || Host(`www.redbrick.dcu.ie`) || Host(`www.rb.dcu.ie`) || Host(`rb.dcu.ie`) || Host(`redbrick.ie`) || Host(`www.redbrick.ie`)) && !PathPrefix(`/~`)",
        "traefik.http.routers.nginx-atlas.entrypoints=web,websecure",
        "traefik.http.routers.nginx-atlas.tls.certresolver=rb",
      ]
    }

    task "atlas-nginx" {
      driver = "docker"

      config {
        image      = "ghcr.io/redbrick/atlas:latest"
        ports      = ["http"]
        force_pull = true
      }

      resources {
        cpu    = 100
        memory = 50
      }
    }
  }
}
