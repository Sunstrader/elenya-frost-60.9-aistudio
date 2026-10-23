@echo off
REM Optimise des COPIES de vos vidéos MP4 (H.264 + AAC + faststart). Les originaux ne sont jamais modifiés.
REM Usage : glisser un dossier sur ce fichier. Résultat : dossier "assets_optimises" à côté.
REM ffmpeg doit être installé (gratuit) : https://ffmpeg.org/download.html
setlocal enabledelayedexpansion
if "%~1"=="" (echo Glissez un dossier sur ce fichier.& pause & exit /b 1)
set "SRC=%~1"
set "OUT=%~dp1assets_optimises"
if not exist "%OUT%" mkdir "%OUT%"
where ffmpeg >nul 2>nul || (echo ffmpeg introuvable : https://ffmpeg.org/download.html & pause & exit /b 1)
for /r "%SRC%" %%F in (*.mp4) do (
  ffmpeg -nostdin -loglevel error -y -i "%%F" -c:v libx264 -profile:v high -preset slow -crf 23 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "%OUT%\%%~nxF"
  echo Optimise : %%~nxF
)
for /r "%SRC%" %%F in (*.webp *.png *.jpg *.jpeg) do (
  ffmpeg -nostdin -loglevel error -y -i "%%F" -quality 82 "%OUT%\%%~nF.webp"
  echo Image : %%~nxF
)
echo Termine. Copies dans "%OUT%". Comparez les poids avant de remplacer quoi que ce soit.
pause
