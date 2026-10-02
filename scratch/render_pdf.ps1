Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() | ? { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' }

function AwaitOperation($winRtOp, $resultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($resultType)
    $netTask = $asTask.Invoke($null, @($winRtOp))
    $netTask.Wait()
    return $netTask.Result
}

$asTaskAction = [System.WindowsRuntimeSystemExtensions].GetMethods() | ? { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncAction' }
function AwaitAction($winRtOp) {
    $netTask = $asTaskAction.Invoke($null, @($winRtOp))
    $netTask.Wait()
}

[Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null

$pdfPath = 'C:\Users\adiak\.gemini\antigravity-ide\brain\27387d7b-1a12-443a-b402-3a43cc5beb0e\.user_uploaded\media_1789942600264.pdf'
$outFolder = Join-Path (Get-Location) 'img'
if (!(Test-Path $outFolder)) { New-Item -ItemType Directory -Path $outFolder | Out-Null }

$op = [Windows.Storage.StorageFile]::GetFileFromPathAsync($pdfPath)
$file = AwaitOperation $op ([Windows.Storage.StorageFile])

$opDoc = [Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)
$doc = AwaitOperation $opDoc ([Windows.Data.Pdf.PdfDocument])

Write-Host "Total Pages: $($doc.PageCount)"

for ($i = 0; $i -lt $doc.PageCount; $i++) {
    $page = $doc.GetPage($i)
    $renderOptions = New-Object Windows.Data.Pdf.PdfPageRenderOptions
    $renderOptions.DestinationWidth = [uint32]($page.Size.Width * 2.0)
    
    $outFile = Join-Path $outFolder ("page_" + ($i + 1) + ".png")
    New-Item -Path $outFile -ItemType File -Force | Out-Null
    
    $opStorage = [Windows.Storage.StorageFile]::GetFileFromPathAsync((Resolve-Path $outFile).Path)
    $storageFile = AwaitOperation $opStorage ([Windows.Storage.StorageFile])
    
    $opStream = $storageFile.OpenAsync([Windows.Storage.FileAccessMode]::ReadWrite)
    $stream = AwaitOperation $opStream ([Windows.Storage.Streams.IRandomAccessStream])
    
    $opRender = $page.RenderToStreamAsync($stream, $renderOptions)
    AwaitAction $opRender
    
    $opFlush = $stream.FlushAsync()
    $netFlush = $asTaskGeneric.MakeGenericMethod([bool]).Invoke($null, @($opFlush))
    $netFlush.Wait()
    
    $stream.Dispose()
    $page.Dispose()
    Write-Host "Rendered: $outFile"
}
