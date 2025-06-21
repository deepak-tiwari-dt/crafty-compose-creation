
#!/bin/bash

# Engineering Resource Management System - Deployment Script
# This script helps deploy the application to various platforms

echo "🚀 ERM System Deployment Script"
echo "================================"

# Check if required tools are installed
check_requirements() {
    echo "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed. Please install npm."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        echo "❌ Git is not installed. Please install Git."
        exit 1
    fi
    
    echo "✅ All requirements satisfied"
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed successfully"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
}

# Build the application
build_application() {
    echo "🔨 Building application..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Application built successfully"
    else
        echo "❌ Build failed"
        exit 1
    fi
}

# Environment setup
setup_environment() {
    echo "⚙️  Setting up environment..."
    
    if [ ! -f ".env.local" ]; then
        echo "Creating .env.local template..."
        cat > .env.local << EOL
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Add your actual Supabase credentials above
# You can find these in your Supabase project settings
EOL
        echo "⚠️  Please update .env.local with your actual Supabase credentials"
    else
        echo "✅ Environment file already exists"
    fi
}

# Main deployment function
deploy() {
    echo "Starting deployment process..."
    
    check_requirements
    setup_environment
    install_dependencies
    build_application
    
    echo ""
    echo "🎉 Deployment preparation complete!"
    echo ""
    echo "Next steps:"
    echo "1. Update .env.local with your Supabase credentials"
    echo "2. Run 'npm run dev' to start development server"
    echo "3. Or deploy the 'dist' folder to your hosting platform"
    echo ""
    echo "Deployment options:"
    echo "• Vercel: Connect your GitHub repo to Vercel"
    echo "• Netlify: Drag and drop the 'dist' folder"
    echo "• Lovable: Use the Publish button in Lovable interface"
}

# Run deployment
deploy
