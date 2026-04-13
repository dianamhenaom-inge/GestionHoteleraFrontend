# Script para construir imágenes y desplegar en Kubernetes (PowerShell)
# Ejecutar desde la raíz del proyecto:
#   .\k8s\build-and-deploy.ps1
#
# Si Minikube pide permiso de ejecución de scripts:
#   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

$ErrorActionPreference = "Stop"

$ScriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = Split-Path -Parent $ScriptDir

# ── 1. Apuntar Docker al daemon de Minikube ──────────────────────────────────
Write-Host "=== Configurando Docker para usar el daemon de Minikube ===" -ForegroundColor Cyan
minikube -p minikube docker-env --shell powershell | Invoke-Expression

# ── 2. Build de imágenes ─────────────────────────────────────────────────────
Write-Host "=== Construyendo imágenes Docker ===" -ForegroundColor Cyan
docker build -t breaze-auth:latest     "$ProjectDir\auth"
docker build -t breaze-rooms:latest    "$ProjectDir\rooms"
docker build -t breaze-books:latest    "$ProjectDir\books"
docker build -t breaze-gateway:latest  "$ProjectDir\gateway"
docker build -t breaze-frontend:latest "$ProjectDir\frontend"

# ── 3. Manifiestos base ──────────────────────────────────────────────────────
Write-Host "=== Aplicando manifiestos Kubernetes ===" -ForegroundColor Cyan
kubectl apply -f "$ScriptDir\namespace.yaml"
kubectl apply -f "$ScriptDir\secrets.yaml"

# ── 4. Bases de datos ────────────────────────────────────────────────────────
kubectl apply -f "$ScriptDir\auth-mysql.yaml"
kubectl apply -f "$ScriptDir\rooms-mysql.yaml"
kubectl apply -f "$ScriptDir\books-mysql.yaml"

Write-Host "Esperando a que los pods MySQL estén listos..." -ForegroundColor Yellow
kubectl wait --namespace breaze --for=condition=ready pod -l app=auth-mysql  --timeout=120s
kubectl wait --namespace breaze --for=condition=ready pod -l app=rooms-mysql --timeout=120s
kubectl wait --namespace breaze --for=condition=ready pod -l app=books-mysql --timeout=120s

# ── 5. Microservicios ────────────────────────────────────────────────────────
kubectl apply -f "$ScriptDir\auth.yaml"
kubectl apply -f "$ScriptDir\rooms.yaml"
kubectl apply -f "$ScriptDir\books.yaml"
kubectl apply -f "$ScriptDir\gateway.yaml"
kubectl apply -f "$ScriptDir\frontend.yaml"
kubectl apply -f "$ScriptDir\ingress.yaml"

# ── 6. Resumen ───────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "=== Despliegue completado ===" -ForegroundColor Green
Write-Host "Verificar pods:  kubectl get pods -n breaze"
Write-Host "Ver logs auth:   kubectl logs -n breaze deploy/auth"
Write-Host "Tunnel ingress:  minikube tunnel"
