# SIDeN — creación de nuevos clientes

La plantilla maestra usa una arquitectura multisite. Cada cliente vive en su propia carpeta dentro de `sites/` y comparte el mismo shell HTML, CSS y JavaScript de la plantilla.

## Crear un cliente

1. Copiar `sites/plantilla-cliente/` y renombrar la carpeta con el `instanceId` del cliente.
2. Editar `config.json` con los datos reales del negocio.
3. Cambiar `siden.instanceId` para que coincida exactamente con el nombre de la carpeta/subdominio.
4. Colocar las imágenes del cliente dentro de `images/`.
5. Mantener `indexable: false` durante preparación y pruebas.
6. Cuando el sitio esté listo para publicar, cambiar `indexable` a `true`.
7. El subdominio `cliente.sidenred.com` utilizará automáticamente `sites/cliente/` mediante el dispatcher.

## Estructura

```text
sites/
└── cliente-slug/
    ├── config.json
    └── images/
        ├── logo.png
        ├── hero.jpg
        └── ...
```

No es necesario duplicar `index.html`, `css/`, `js/` ni `worker.js` para cada cliente.

## Regla de seguridad

Un cliente solo debe utilizar su propia carpeta y su propio `instanceId`. El dispatcher debe rechazar configuraciones inexistentes o inconsistentes; nunca debe utilizar la configuración corporativa como fallback.
