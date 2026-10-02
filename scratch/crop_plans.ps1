Add-Type -AssemblyName System.Drawing

function CropImage($srcPath, $dstPath, $x, $y, $w, $h) {
    $src = [System.Drawing.Bitmap]::FromFile($srcPath)
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $cropped = $src.Clone($rect, $src.PixelFormat)
    $cropped.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    $src.Dispose()
    Write-Host "Cropped $dstPath : ${w}x${h}"
}

# Crop Plan RDC (Page 1)
CropImage ".\img\student_clean_page_1.png" ".\img\plan_rdc_clean.png" 70 360 1450 1640
CropImage ".\img\page_1.png" ".\img\plan_rdc_corrige.png" 70 360 1450 1640

# Crop Plan Echelle Graduée (Page 2)
CropImage ".\img\student_clean_page_2.png" ".\img\plan_echelle_graduee_clean.png" 80 340 1430 1680
CropImage ".\img\page_2.png" ".\img\plan_echelle_graduee_corrige.png" 80 340 1430 1680

# Crop Façades (Page 3)
CropImage ".\img\student_clean_page_3.png" ".\img\facade_principale_clean.png" 80 350 1430 520
CropImage ".\img\student_clean_page_3.png" ".\img\facade_arriere_clean.png" 80 980 1430 550
CropImage ".\img\student_clean_page_3.png" ".\img\facade_gauche_clean.png" 80 1600 1430 560

CropImage ".\img\page_3.png" ".\img\facade_principale_corrige.png" 80 350 1430 520
CropImage ".\img\page_3.png" ".\img\facade_arriere_corrige.png" 80 980 1430 550
CropImage ".\img\page_3.png" ".\img\facade_gauche_corrige.png" 80 1600 1430 560
