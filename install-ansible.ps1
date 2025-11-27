# PowerShell script to install Ansible and required dependencies on Windows

Write-Host "🚀 Installing Ansible and dependencies..." -ForegroundColor Green

# Check if Python 3 is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python 3 is not installed. Please install Python 3 first." -ForegroundColor Red
    Write-Host "   Download from: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}

# Check if pip is installed
try {
    $pipVersion = pip --version 2>&1
    Write-Host "✓ pip found: $pipVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ pip is not installed. Installing pip..." -ForegroundColor Yellow
    python -m ensurepip --upgrade
}

# Install Ansible and dependencies
Write-Host "📦 Installing Ansible and Kubernetes modules..." -ForegroundColor Cyan
pip install -r ansible/requirements.txt

# Verify installation
try {
    $ansibleVersion = ansible --version 2>&1 | Select-Object -First 1
    Write-Host "✅ Ansible installed successfully!" -ForegroundColor Green
    Write-Host $ansibleVersion -ForegroundColor Cyan
} catch {
    Write-Host "⚠️  Ansible may not be in PATH. Try restarting your terminal." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure ansible/inventory.ini with your Kubernetes cluster details"
Write-Host "2. Run: ansible-playbook -i ansible/inventory.ini ansible/deploy.yml"

