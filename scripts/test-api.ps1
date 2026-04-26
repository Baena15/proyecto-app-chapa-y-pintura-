# Script de prueba rapida de la API
# App Taller Chapa y Pintura
# Ejecutar despues de: make dev

$baseUrl = "http://localhost:8000"
$projectName = "App Taller Chapa y Pintura"

$green  = "`e[32m"
$red    = "`e[31m"
$yellow = "`e[33m"
$reset  = "`e[0m"

function Test-Endpoint {
    param($Method, $Path, $Body = $null, $Token = $null)
    
    $url = "$baseUrl$Path"
    $headers = @{}
    if ($Token) {
        $headers["Authorization"] = "Bearer $Token"
    }
    if ($Body) {
        $headers["Content-Type"] = "application/json"
    }

    try {
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $url -Method $Method -Headers $headers -ErrorAction Stop
        } else {
            $response = Invoke-RestMethod -Uri $url -Method $Method -Headers $headers -Body ($Body | ConvertTo-Json) -ErrorAction Stop
        }
        Write-Host "${green}✅ $Method $Path - OK${reset}"
        return $response
    } catch {
        Write-Host "${red}❌ $Method $Path - FAILED${reset}"
        Write-Host "   Error: $($_.Exception.Message)"
        return $null
    }
}

Write-Host "`n🧪 Testing $projectName API...`n" -ForegroundColor Cyan
Write-Host "Base URL: $baseUrl`n"

# 1. Health / Admin check
Write-Host "${yellow}--- Health Check ---${reset}"
Test-Endpoint -Method "GET" -Path "/admin/login/"

# 2. Auth endpoints (ajusta a tus URLs de DRF SimpleJWT)
Write-Host "`n${yellow}--- Auth Endpoints ---${reset}"
$token = $null

$loginBody = @{
    username = "admin"
    password = "admin"
}
$login = Test-Endpoint -Method "POST" -Path "/api/v1/auth/token/" -Body $loginBody
if ($login -and $login.access) {
    $token = $login.access
    Write-Host "   Access token received: $($token.Substring(0,20))..."
}

# 3. Endpoints protegidos (si tenemos token)
if ($token) {
    Write-Host "`n${yellow}--- Protected Endpoints ---${reset}"
    # Ajusta estos endpoints a tu API:
    # Test-Endpoint -Method "GET" -Path "/api/v1/workorders/" -Token $token
    # Test-Endpoint -Method "GET" -Path "/api/v1/customers/" -Token $token
    Write-Host "   (Ajusta los endpoints en este script a tu API)"
} else {
    Write-Host "${red}⚠️  No token available, skipping protected endpoints${reset}"
}

Write-Host "`n${green}✅ Test completed!${reset}`n"
Write-Host "💡 Tip: Ajusta los endpoints en scripts/test-api.ps1 a tu API real."
