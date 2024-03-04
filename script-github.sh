#!/bin/bash

# Votre nom d'utilisateur GitHub
username="KaynoxDev"

# Votre token d'accès personnel GitHub
token="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"

# Demande le nom du dépôt
echo "Entrez le nom du dépôt : "
read repo_name

# Demande la description du dépôt
echo "Entrez la description du dépôt : "
read description

# Demande si le dépôt doit être privé ou public
while true; do
    read -p "Le dépôt doit-il être privé ? (y/n) " yn
    case $yn in
        [Yy]* ) private=true; break;;
        [Nn]* ) private=false; break;;
        * ) echo "Veuillez répondre par oui (y) ou non (n).";;
    esac
done

# Crée le dépôt
curl -u $username:$token https://api.github.com/user/repos -d "{\"name\":\"$repo_name\", \"description\":\"$description\", \"private\":$private}"

# Initialise le dépôt localement
git init

# Ajoute le dépôt distant
git remote add origin https://github.com/$username/$repo_name.git

# Crée un fichier README.md
echo "# $repo_name" >> README.md

# Ajoute tous les fichiers et les commit
git add .
git commit -m "Initial commit"
git branch -M main

# Pousse sur le dépôt distant
git push -u origin main