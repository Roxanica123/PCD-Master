tsc -b .
mkdir "deploy"
Copy-Item -Path "dist/**" -Destination "deploy" -Recurse -Force
Copy-Item -Path "package.json" -Destination "deploy" -Force
Copy-Item -Path "app.yaml" -Destination "deploy" -Force
Set-Location "deploy"
gcloud app deploy
Set-Location ..
Remove-Item -Path "deploy" -Recurse -Force