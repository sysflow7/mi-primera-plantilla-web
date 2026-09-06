# SIDeN Multisite Dispatcher

Esta rama corresponde al Worker de entrada de producción de SIDeN.

- `sidenred.com` -> instancia `siden-corporativo`
- `*.sidenred.com` -> instancia identificada por el primer subdominio
- La configuración de cada instancia no se comparte con otra instancia.
- Un hostname no configurado devuelve HTTP 404; nunca reutiliza la configuración corporativa.
- `/config.json` y `/images/*` se resuelven según el hostname actual.

La plantilla maestra (`siden-template-v1.3` / futuras versiones) permanece separada de este Worker de producción.
