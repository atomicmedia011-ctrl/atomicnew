# PowerShell script to perform branding and links replacements in HTML files

$htmlFiles = @(
    "c:\Users\saura\Downloads\breakable_works_007788.framer.app\breakable-works-007788.framer.app\index.html",
    "c:\Users\saura\Downloads\breakable_works_007788.framer.app\breakable-works-007788.framer.app\terms\index.html",
    "c:\Users\saura\Downloads\breakable_works_007788.framer.app\breakable-works-007788.framer.app\privacy-policy\index.html"
)

foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        Write-Output "Processing file: $file"
        $content = Get-Content -Path $file -Raw -Encoding UTF8
        
        # Replace Joseph Alexander with ATOMIC MEDIA
        $content = $content -replace "Joseph Alexander", "ATOMIC MEDIA"
        
        # Replace emails
        $content = $content -replace "joseph@launchnow.design", "info@atomicmedia.in"
        $content = $content -replace "hello@atomicmedia.in", "info@atomicmedia.in"
        
        # Replace Twitter link
        $content = $content -replace "https://x.com/JosephAlexWeb", "https://x.com/atomic_media"
        
        # Rewrite CDN urls to local/relative paths so that local modifications in .mjs files are loaded
        $content = $content -replace "https://framerusercontent.com", "/framerusercontent.com"
        $content = $content -replace "https://unpkg.com", "/unpkg.com"
        
        # Save back
        Set-Content -Path $file -Value $content -Encoding UTF8
        Write-Output "Successfully updated $file"
    } else {
        Write-Output "File not found: $file"
    }
}

# Move framerusercontent.com and unpkg.com to the static website directory if they exist at root
$rootDirsToMove = @("framerusercontent.com", "unpkg.com")
$targetParent = "c:\Users\saura\Downloads\breakable_works_007788.framer.app\breakable-works-007788.framer.app"

foreach ($dirName in $rootDirsToMove) {
    $srcDir = Join-Path "c:\Users\saura\Downloads\breakable_works_007788.framer.app" $dirName
    $destDir = Join-Path $targetParent $dirName
    
    if (Test-Path $srcDir) {
        Write-Output "Moving $srcDir to $destDir..."
        if (Test-Path $destDir) {
            Remove-Item -Recurse -Force $destDir
        }
        Move-Item -Path $srcDir -Destination $destDir
        Write-Output "Successfully moved $dirName"
    } else {
        Write-Output "Source directory not found (already moved or missing): $srcDir"
    }
}
