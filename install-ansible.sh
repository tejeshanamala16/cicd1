#!/bin/bash

# Script to install Ansible and required dependencies

set -e

echo "🚀 Installing Ansible and dependencies..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✓ Python 3 found: $(python3 --version)"

# Check if pip3 is installed
if ! command -v pip3 &> /dev/null; then
    echo "📦 Installing pip3..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v apt-get &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y python3-pip
        elif command -v yum &> /dev/null; then
            sudo yum install -y python3-pip
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install python3
    fi
fi

echo "✓ pip3 found: $(pip3 --version)"

# Install Ansible and dependencies
echo "📦 Installing Ansible and Kubernetes modules..."
pip3 install --user -r ansible/requirements.txt

# Add user's local bin to PATH if not already there
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    echo "📝 Adding ~/.local/bin to PATH..."
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
    export PATH="$HOME/.local/bin:$PATH"
fi

# Verify installation
if command -v ansible &> /dev/null; then
    echo "✅ Ansible installed successfully!"
    ansible --version
else
    echo "⚠️  Ansible installed but not in PATH. Please add ~/.local/bin to your PATH."
    echo "   Run: export PATH=\"\$HOME/.local/bin:\$PATH\""
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "Next steps:"
echo "1. Configure ansible/inventory.ini with your Kubernetes cluster details"
echo "2. Run: ansible-playbook -i ansible/inventory.ini ansible/deploy.yml"

