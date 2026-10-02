$payload = @{
    horodatage = (Get-Date).ToString("dd/MM/yyyy HH:mm:ss")
    titreTD = "Séquence 1 : Séance Échelle d'un document"
    classe = "1MELEC2"
    groupe = "G2"
    isBinome = "Oui"
    eleve1 = "TRAORE Moussa"
    eleve2 = "DIAKITE Ibrahim"
    scoreBrut = "19.5 / 20"
    indicesUtilises = 1
    penaliteNoteSur20 = "0.00 pt"
    noteSur20 = 19.5
    competenceC1 = "Très bonne maîtrise"
    competenceC2 = "Très bonne maîtrise"
    nomFichierPDF = "TRAORE_Moussa_et_DIAKITE_Ibrahim_1MELEC2_G2_S1_Echelle.pdf"
}
$json = $payload | ConvertTo-Json -Compress
Write-Host "Sending Binôme: $json"

$response = Invoke-RestMethod -Uri "https://script.google.com/macros/s/AKfycbzEX7l1BYeOLoGc1ULmUh5SlyGkLivc5f_xB6o3G81wco9rE4hpcZmVE2cYHofURNr_6Q/exec" -Method Post -Body $json -ContentType "text/plain;charset=utf-8"
Write-Host "Response:" ($response | ConvertTo-Json)
