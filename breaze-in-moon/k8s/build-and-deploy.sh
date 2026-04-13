#!/bin/bash
# Script para construir imágenes y desplegar en Kubernetes
# Ejecutar desde la raíz del proyecto: ./k8s/build-and-deploy.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== Construyendo imágenes Docker ==="
docker build -t breaze-auth:latest    "$PROJECT_DIR/auth"
docker build -t breaze-rooms:latest   "$PROJECT_DIR/rooms"
docker build -t breaze-books:latest   "$PROJECT_DIR/books"
docker build -t breaze-gateway:latest "$PROJECT_DIR/gateway"
docker build -t breaze-frontend:latest "$PROJECT_DIR/frontend"

# Si usas minikube, carga las imágenes al cluster:
# minikube image load breaze-auth:latest
# minikube image load breaze-rooms:latest
# minikube image load breaze-books:latest
# minikube image load breaze-gateway:latest
# minikube image load breaze-frontend:latest

echo "=== Aplicando manifiestos Kubernetes ==="
kubectl apply -f "$SCRIPT_DIR/namespace.yaml"
kubectl apply -f "$SCRIPT_DIR/secrets.yaml"

# Bases de datos (esperar a que estén listas antes de los servicios)
kubectl apply -f "$SCRIPT_DIR/auth-mysql.yaml"
kubectl apply -f "$SCRIPT_DIR/rooms-mysql.yaml"
kubectl apply -f "$SCRIPT_DIR/books-mysql.yaml"

echo "Esperando a que los pods MySQL estén listos..."
kubectl wait --namespace breaze --for=condition=ready pod \
  -l app=auth-mysql --timeout=120s
kubectl wait --namespace breaze --for=condition=ready pod \
  -l app=rooms-mysql --timeout=120s
kubectl wait --namespace breaze --for=condition=ready pod \
  -l app=books-mysql --timeout=120s

# Microservicios
kubectl apply -f "$SCRIPT_DIR/auth.yaml"
kubectl apply -f "$SCRIPT_DIR/rooms.yaml"
kubectl apply -f "$SCRIPT_DIR/books.yaml"
kubectl apply -f "$SCRIPT_DIR/gateway.yaml"
kubectl apply -f "$SCRIPT_DIR/frontend.yaml"

# Ingress
kubectl apply -f "$SCRIPT_DIR/ingress.yaml"

echo ""
echo "=== Despliegue completado ==="
echo "Verificar pods: kubectl get pods -n breaze"
echo "Ver logs:       kubectl logs -n breaze deploy/auth-app"
