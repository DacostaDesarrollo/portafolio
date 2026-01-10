#!/bin/bash
# Script para optimizar imágenes de proyectos para el portafolio

echo "🎨 Optimizador de imágenes para portafolio"
echo "========================================="
echo ""

# Verificar si ImageMagick está instalado
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick no está instalado."
    echo "Para instalar en Ubuntu/Debian:"
    echo "   sudo apt update && sudo apt install imagemagick"
    echo ""
    echo "Para instalar en macOS:"
    echo "   brew install imagemagick"
    exit 1
fi

echo "✅ ImageMagick encontrado"
echo ""

# Crear directorio si no existe
mkdir -p ./assets/img/optimized

echo "📁 Preparando directorio de imágenes optimizadas..."

# Función para optimizar imagen
optimize_image() {
    local input_file="$1"
    local output_file="$2"
    local project_name="$3"
    
    if [ -f "$input_file" ]; then
        echo "🔧 Procesando: $project_name"
        
        # Optimizar imagen:
        # - Redimensionar a 600x400px manteniendo proporción
        # - Aplicar compresión
        # - Convertir a WebP para mejor rendimiento
        convert "$input_file" \
            -resize 600x400^ \
            -gravity center \
            -extent 600x400 \
            -quality 85 \
            -strip \
            "$output_file"
            
        echo "   ✓ Guardada como: $output_file"
        
        # También crear versión WebP
        local webp_file="${output_file%.*}.webp"
        convert "$output_file" -quality 80 "$webp_file"
        echo "   ✓ WebP creada: $webp_file"
    else
        echo "⚠️  No se encontró: $input_file"
        echo "   Por favor, coloca la imagen original en esta ubicación."
    fi
    echo ""
}

echo "🚀 Iniciando optimización de imágenes..."
echo ""

# Optimizar cada proyecto
optimize_image "./assets/img/license-pass-original.jpg" "./assets/img/project-license-pass.jpg" "License Pass"
optimize_image "./assets/img/sipesa-original.jpg" "./assets/img/project-sipesa.jpg" "Sipesa Industrial"
optimize_image "./assets/img/tulogo-original.jpg" "./assets/img/project-tulogo.jpg" "Tu Logo"

echo "📋 INSTRUCCIONES:"
echo "=================="
echo "1. Coloca tus imágenes originales en ./assets/img/ con los nombres:"
echo "   - license-pass-original.jpg (para License Pass)"
echo "   - sipesa-original.jpg (para Sipesa)"
echo "   - tulogo-original.jpg (para Tu Logo)"
echo ""
echo "2. Ejecuta este script nuevamente: ./optimize-images.sh"
echo ""
echo "3. Las imágenes optimizadas se crearán automáticamente"
echo ""
echo "✨ ¡El script optimizará las imágenes para mantener el rendimiento!"
echo "   - Tamaño: 600x400px"
echo "   - Calidad optimizada"
echo "   - Formatos: JPG + WebP"