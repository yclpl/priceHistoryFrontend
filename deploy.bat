@echo off
echo ========================================
echo 🚀 Frontend Deployment Script (Vercel)
echo ========================================
echo.

echo ONEMLI: Backend URL'inizi hazir edin!
echo Ornek: https://gecmisi-backend-xxxx.onrender.com
echo.

set /p BACKEND_URL="Backend URL'inizi girin: "

if "%BACKEND_URL%"=="" (
    echo ⚠️  Backend URL girilmedi! Deployment iptal edildi.
    pause
    exit /b
)

echo.
echo [1/5] .env.local dosyasi olusturuluyor...
echo NEXT_PUBLIC_API_URL=%BACKEND_URL% > .env.local
echo ✓ .env.local olusturuldu

echo.
echo [2/5] Git repository kontrol ediliyor...
if not exist .git (
    echo Git repository olusturuluyor...
    git init
    echo ✓ Git repository olusturuldu
) else (
    echo ✓ Git repository mevcut
)

echo.
echo [3/5] .gitignore kontrol ediliyor...
if not exist .gitignore (
    echo ⚠️  .gitignore bulunamadi!
) else (
    echo ✓ .gitignore mevcut
)

echo.
echo [4/5] Dosyalar commit ediliyor...
git add .
git commit -m "Frontend deployment ready"
echo ✓ Commit tamamlandi

echo.
echo [5/5] GitHub'a push...
set /p REPO_URL="GitHub repository URL'inizi girin: "

if not "%REPO_URL%"=="" (
    git remote remove origin 2>nul
    git remote add origin %REPO_URL%
    git push -u origin main
    echo ✓ Push tamamlandi!
    
    echo.
    echo ==========================================
    echo ✅ Frontend GitHub'a yuklendi!
    echo.
    echo 📋 Sirada Vercel'de deployment:
    echo 1. https://vercel.com adresine gidin
    echo 2. 'Add New...' → 'Project' secin
    echo 3. GitHub repo'nuzu import edin
    echo 4. Framework: Next.js (otomatik)
    echo 5. Environment Variables ekleyin:
    echo    Key: NEXT_PUBLIC_API_URL
    echo    Value: %BACKEND_URL%
    echo 6. 'Deploy' tiklayin
    echo.
    echo 🌐 Deploy sonrasi sitenizi ziyaret edin!
    echo ==========================================
) else (
    echo ⚠️  Repository URL girilmedi!
)

pause
