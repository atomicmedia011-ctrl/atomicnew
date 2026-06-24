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
        
        # Save back
        Set-Content -Path $file -Value $content -Encoding UTF8
        Write-Output "Successfully updated $file"
    } else {
        Write-Output "File not found: $file"
    }
}
