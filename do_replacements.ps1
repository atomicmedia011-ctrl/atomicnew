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

# Recursively find all HTML, JS, and MJS files in the site directory
$files = Get-ChildItem -Path $targetParent -Recurse -Include *.html, *.js, *.mjs

$replacements = @(
    @("Joseph Alexander", "ATOMIC MEDIA"),
    @("joseph@launchnow.design", "info@atomicmedia.in"),
    @("hello@atomicmedia.in", "info@atomicmedia.in"),
    @("https://x.com/JosephAlexWeb", "https://x.com/atomic_media"),
    @("JosephAlexWeb", "atomic_media"),
    @("https://framerusercontent.com", "/framerusercontent.com"),
    @("https://unpkg.com", "/unpkg.com"),
    @("Working with Joseph", "Working with Atomic Media"),
    @("LaunchNow", "Atomic Media"),
    @("https://www.instagram.com", "https://www.instagram.com/atomic.media.in?igsh=MWFrbGh3a3ppbnMwaQ=="),
    @("https://www.linkedin.com/", "https://www.linkedin.com/company/atomic-mediaa/"),
    @("https://www.linkedin.com", "https://www.linkedin.com/company/atomic-mediaa/")
)

foreach ($file in $files) {
    Write-Output "Checking file: $($file.FullName)"
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $modified = $false
    
    foreach ($pair in $replacements) {
        $target = $pair[0]
        $replacement = $pair[1]
        if ($content.Contains($target)) {
            $content = $content.Replace($target, $replacement)
            $modified = $true
            Write-Output "  -> Replacing '$target' with '$replacement'"
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Output "Successfully updated $($file.Name)"
    }
}
