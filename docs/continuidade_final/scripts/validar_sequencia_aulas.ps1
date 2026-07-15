param(
    [string]$AulasPath = "docs/aulas"
)

$files = Get-ChildItem -Path $AulasPath -Filter "*.md" -ErrorAction Stop |
    Sort-Object Name

$numbers = foreach ($file in $files) {
    if ($file.Name -match "^(\d{3})_") {
        [int]$Matches[1]
    }
}

if (-not $numbers) {
    throw "Nenhuma aula numerada encontrada em $AulasPath"
}

$min = ($numbers | Measure-Object -Minimum).Minimum
$max = ($numbers | Measure-Object -Maximum).Maximum
$missing = $min..$max | Where-Object { $_ -notin $numbers }
$duplicates = $numbers |
    Group-Object |
    Where-Object { $_.Count -gt 1 } |
    ForEach-Object { $_.Name }
$dirty = $files |
    Where-Object { $_.Name -notmatch "^\d{3}_" -or $_.Name -match "\(\d+\)|\.md\.md" } |
    Select-Object -ExpandProperty Name

[pscustomobject]@{
    TotalMd = $files.Count
    Min = $min
    Max = $max
    Missing = ($missing -join ",")
    Duplicates = ($duplicates -join ",")
    DirtyNames = ($dirty -join ",")
} | Format-List

if ($missing -or $duplicates -or $dirty) {
    exit 1
}

exit 0
