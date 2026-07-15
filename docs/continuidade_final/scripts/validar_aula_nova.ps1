param(
    [Parameter(Mandatory = $true)]
    [int]$Numero,

    [string]$AulasPath = "docs/aulas",

    [string]$GradePath = "docs/continuidade_final/04_GRADE_OPERACIONAL_FINAL_POS_635.csv",

    [switch]$StrictMarkdown
)

$row = Import-Csv -Delimiter ";" -Path $GradePath |
    Where-Object { [int]$_.numero_aula -eq $Numero } |
    Select-Object -First 1

if (-not $row) {
    throw "Numero $Numero nao encontrado na grade $GradePath"
}

$expectedFile = $row.arquivo_md
$path = Join-Path $AulasPath $expectedFile

if (-not (Test-Path -LiteralPath $path)) {
    throw "Arquivo esperado nao encontrado: $path"
}

$text = [System.Text.Encoding]::UTF8.GetString(
    [System.IO.File]::ReadAllBytes((Resolve-Path -LiteralPath $path))
)

$h1 = ($text -split "`r?`n" |
    Where-Object { $_ -match "^#\s+" } |
    Select-Object -First 1)

$expectedH1 = "# $($row.numero_aula) - $($row.codigo_aula) - $($row.titulo_aula)"
$words = [regex]::Matches($text, "\S+").Count
$fenceCount = [regex]::Matches($text, '```').Count

$insideFence = $false
$hashInsideCode = 0
$brokenPackageImport = 0

foreach ($line in ($text -split "`r?`n")) {
    if ($line -match '^```') {
        $insideFence = -not $insideFence
        continue
    }

    if ($insideFence -and $line -match "^##\s") {
        $hashInsideCode++
    }

    if ($insideFence -and (
        $line -match "^package [^;]+$" -or
        $line -match "^import [^;]+$" -or
        $line -match "^\s+\.[A-Za-z].*;$"
    )) {
        $brokenPackageImport++
    }
}

[pscustomobject]@{
    Numero = $Numero
    Arquivo = $expectedFile
    H1 = $h1
    H1Esperado = $expectedH1
    H1Ok = ($h1 -eq $expectedH1)
    Palavras = $words
    CodeFenceMarkers = $fenceCount
    CodeFencesOk = ($fenceCount % 2 -eq 0)
    HashInsideCode = $hashInsideCode
    BrokenPackageImport = $brokenPackageImport
} | Format-List

if ($h1 -ne $expectedH1 -or
    $fenceCount % 2 -ne 0 -or
    ($StrictMarkdown -and $hashInsideCode -gt 0) -or
    $brokenPackageImport -gt 0) {
    exit 1
}

exit 0
