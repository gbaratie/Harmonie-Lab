# Harmonie Lab

Application React (Vite) pour s'entraîner à l'impro au piano : progressions, gammes et clavier virtuel.

Site prévu pour GitHub Pages : https://gbaratie.github.io/Harmonie-Lab/

## Développement

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

## Publication GitHub Pages

Le workflow `.github/workflows/deploy.yml` construit le site et le publie à chaque push sur `main`.

Une seule configuration manuelle dans le dépôt GitHub :

1. **Settings → Pages**
2. **Source** : GitHub Actions

Sans cette étape, le workflow ne peut pas déployer.
