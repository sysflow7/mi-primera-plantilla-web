# SIDeN — Decisión Arquitectónica: operación de ramas e instancias

**Versión:** 1.1  
**Fecha:** 2026-09-24  
**Estado:** Propuesta para revisión y posterior integración

## 1. Decisión

SIDeN mantiene un **monorepo multisite** con un Worker central compartido y las instancias de clientes bajo:

`/sites/<instanceId>/`

No se crea un repositorio, Worker ni proyecto técnico independiente por cliente mientras el motor compartido pueda mantener aislamiento y seguridad.

## 2. Qué significa una rama de cliente

Una rama Git representa el estado completo del repositorio en el punto desde el cual fue creada. Por tanto, una rama temporal de cliente puede mostrar en GitHub otras carpetas existentes dentro de `/sites/`.

Esto es normal y **no significa que esas instancias pertenezcan al cliente**.

La rama no es el mecanismo de aislamiento. El aislamiento se obtiene mediante:

- `instanceId`
- resolución del Worker
- `/sites/<instanceId>/`
- `config.json`
- `custom.css`
- assets de la instancia
- reglas de Preview y `?site=`

## 3. Política de ramas

Las ramas de clientes son temporales:

1. Partir de la rama de producción vigente y actualizada.
2. Crear o modificar únicamente la instancia objetivo.
3. Registrar inmediatamente el alias de Preview cuando corresponda.
4. Generar y probar Preview.
5. Aprobar.
6. Crear Pull Request hacia la rama de producción vigente.
7. Hacer merge.
8. Verificar producción y aislamiento.
9. Retirar aliases temporales.
10. Eliminar la rama de trabajo cuando ya no sea necesaria.

## 4. Producción y plantillas

`siden-corporativo-v1.3` continúa siendo la **rama de producción vigente** hasta que exista una nueva liberación formal.

La existencia de una rama de desarrollo o referencia de plantilla, como `siden-template-v1.4`, no la convierte automáticamente en base de alta de clientes ni en rama de producción.

Una nueva versión de plantilla o motor debe pasar por desarrollo, Preview, validación y liberación antes de convertirse en la nueva referencia productiva.

## 5. Implicación para Dr. Carlos Reyes

La rama preliminar existente se conserva durante esta revisión. No se modifica ni se elimina todavía.

Una vez aprobada esta actualización arquitectónica, se recomienda crear una nueva rama limpia de trabajo desde la producción vigente para continuar el desarrollo del Dr. Carlos bajo el procedimiento definitivo.

## 6. Regla de escalabilidad

Tener 100 o más instancias bajo `/sites/` no implica tener 100 Workers ni 100 repositorios.

La estructura esperada continúa siendo:

```
sites/
├── registry.json
├── corporativo/
├── cliente01/
├── cliente02/
├── ...
└── cliente100/
```

Cada instancia mantiene solamente sus datos y recursos propios.

## 7. Regla de cambios compartidos

Si una solicitud de cliente requiere modificar CSS, JS, Worker, plantilla, registry u otro componente compartido, debe detenerse el cambio específico hasta evaluar su impacto.

Solo se incorpora al motor compartido una capacidad que sea genérica, configurable, segura y reutilizable. Si la diferencia es estructural y no puede convivir con las instancias existentes, se evalúa una nueva plantilla.

## 8. Resultado esperado

La arquitectura queda conceptualmente separada en:

`Motor común → Familia de plantilla → Instancia → Configuración y assets`

y las ramas quedan definidas como:

`Producción → Rama temporal → Preview → PR → Merge → Limpieza`

Esta separación evita confundir **rama**, **plantilla** e **instancia**.
