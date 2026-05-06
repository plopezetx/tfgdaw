# Viabilidad de un IDE Web Colaborativo para TFG

## Conclusión ejecutiva

Tu idea **sí es factible como TFG**, pero no con cualquier alcance. La versión que veo claramente viable es un **IDE web orientado a escritorio para proyectos JavaScript/TypeScript/Node**, con editor en navegador, guardado de proyectos, ejecución con vista previa, publicación pública/privada y capacidad de forkar o remixar proyectos. Esa combinación encaja muy bien con el stack que propones y, sobre todo, con las capacidades reales de WebContainers, que están pensadas precisamente para experiencias de codificación en navegador, IDEs web y ejecución de Node.js dentro de la pestaña del usuario. Monaco te resuelve la parte de editor y xterm.js la del terminal embebido. Además, ya existe una prueba de viabilidad de mercado muy clara: StackBlitz, Replit, Judge0 IDE y GitHub Codespaces demuestran que el concepto general de “programar, ejecutar y compartir desde el navegador” no solo es posible, sino que ya está consolidado en distintos formatos. citeturn10view0turn11view0turn11view1turn19view0turn19view1turn19view2turn10view16

La decisión que separa un TFG razonable de un proyecto excesivo es **cómo ejecutas el código** y **qué significa exactamente “colaborativo”**. Si colaboración significa “compartir proyectos, explorarlos y forkar”, el proyecto es muy asumible. Si significa “edición simultánea en tiempo real tipo Google Docs/Replit”, sigue siendo posible, pero ya entra en una segunda capa de complejidad porque necesitas un modelo de sincronización de documentos, presencia de usuarios y resolución de conflictos; Yjs, su binding para Monaco y y-websocket están diseñados para eso. Y si además quieres desde la primera versión **multi-lenguaje arbitrario ejecutado en servidores tuyos**, el alcance se dispara: ahí ya no basta con Docker “sin más”, porque ejecutar código no confiable en multi-tenant exige aislamiento serio y defensa en profundidad, donde aparecen gVisor, Firecracker o plataformas tipo Judge0. citeturn10view7turn10view8turn12view0turn13view1turn13view0turn10view9turn10view10turn10view12

Mi veredicto, por tanto, es este: **muy factible** si lo planteas como un IDE web para web stack con comunidad y sharing; **factible pero arriesgado** si añades coedición en tiempo real como objetivo principal; y **poco recomendable para un TFG individual** si intentas empezar ya con un backend completo de ejecución multi-lenguaje, terminal persistente Linux y sandboxing server-side de nivel producción. citeturn10view0turn10view2turn10view12turn13view0turn10view10

## Factibilidad real del proyecto

La parte más viable del proyecto es la del **IDE embebido y la ejecución para proyectos web/Node**. WebContainer API expone sistema de ficheros, montaje de árboles de archivos, arranque de procesos con `spawn`, eventos `server-ready` para enganchar la preview y capacidad de exportar el filesystem como JSON o ZIP. En la práctica esto te permite montar una plantilla de proyecto, editar archivos, instalar dependencias y lanzar un servidor de desarrollo dentro del navegador, algo muy cercano a la experiencia que tú describes. Monaco, por su parte, es el editor de código del que se deriva buena parte de la experiencia de VS Code y soporta modelos, URIs y providers para completado y validación; xterm.js aporta un terminal plenamente funcional en el navegador. citeturn14view1turn14view2turn10view5turn11view0turn11view1

La parte de **persistencia y comunidad** también es totalmente razonable para un TFG. Guardar proyectos, listarlos, marcarlos como públicos o privados, generar páginas públicas de proyecto y permitir forks encaja con una arquitectura web estándar. De hecho, PostgreSQL te ofrece una ventaja interesante si más adelante quieres reforzar permisos por usuario o visibilidad de proyectos, porque soporta Row-Level Security a nivel de tabla y fila. No digo que sea obligatorio usarlo desde el día uno, pero sí que, comparado con un enfoque documental puro, casa muy bien con entidades como usuario, proyecto, snapshot, visibilidad, fork y ejecución. citeturn10view13

La capa que más cuidado exige es la de **colaboración en tiempo real**. Técnicamente es viable porque Yjs soporta Monaco, es agnóstico a la red y separa el modelo compartido del proveedor de transporte; además, y-websocket implementa un modelo cliente-servidor clásico donde los clientes se conectan por WebSocket y el servidor distribuye actualizaciones y presencia. Eso hace muy razonable una estrategia de TFG donde el MVP no sea “todo el proyecto colaborativo”, sino algo más acotado: por ejemplo, **coedición de un único archivo abierto** con cursores compartidos y awareness básica. citeturn10view7turn10view8turn12view0

Donde aparecen restricciones fuertes es en el **navegador y el despliegue**. WebContainers necesita `SharedArrayBuffer`, y eso implica que tu app debe estar en un contexto **cross-origin isolated** con cabeceras COOP/COEP. La documentación oficial de WebContainers indica que, para su caso de uso real de embeber recursos arbitrarios, la experiencia está efectivamente habilitada en navegadores basados en Chromium. Además, Monaco no está soportado en navegadores móviles. Traducido a alcance de TFG: debes plantearlo **desktop-first** y necesitas desplegar el frontend en una plataforma que sí te deje fijar headers HTTP de respuesta. citeturn10view1turn10view2turn10view3turn16view0turn11view0

También hay una restricción estratégica importante: **Monaco no es VS Code completo**. Aunque hereda mucho de su experiencia, no ejecuta extensiones de VS Code de forma directa; la propia documentación deja claro que una extensión escrita para VS Code no “funciona sin más” en Monaco, salvo casos muy concretos basados en LSP y servidores en JavaScript. Esto importa porque conviene vender el proyecto como “plataforma web con editor avanzado y preview integrada”, no como “clon completo de VS Code en navegador”. citeturn11view0

Por último, hay una buena noticia para el contexto académico: la licencia comercial de WebContainer API se exige para uso productivo y comercial, mientras que la propia docs dice que **prototipos o POCs no requieren licencia comercial**. Para un TFG, ese encaje es bastante favorable, aunque debes tenerlo en cuenta si más adelante quisieras transformar el proyecto en producto real. citeturn10view4

## Decisiones de arquitectura recomendadas

Mi recomendación principal es que tu arquitectura se apoye en **WebContainers como motor de ejecución del MVP**. La razón no es solo comodidad, sino reducción de riesgo: si el código se ejecuta dentro del navegador del usuario, te ahorras levantar una infraestructura de runners remotos, colas, aislamiento kernel, límites de CPU/memoria y hardening del host. La propia documentación presenta WebContainers como un runtime de Node.js en navegador con filesystem, procesos y previews integradas, precisamente como alternativa a entornos cloud basados en VMs para este tipo de experiencias. citeturn10view0turn10view5turn14view2

El trade-off de esa decisión es que tu MVP queda **delimitado a ecosistema Node/web**. Eso no es malo para un TFG; de hecho, es un recorte muy sano. Monaco puede colorear y editar muchos lenguajes, pero la ejecución real del MVP debería limitarse a plantillas compatibles con el runtime en navegador. Si intentaras prometer Python, Java, C o terminal Linux persistente desde la primera iteración, ya te sales del radio de acción natural de WebContainers y te metes en otra arquitectura muy distinta. citeturn11view0turn10view0

Si en algún momento quieres una vía de crecimiento, la opción más lógica es una **arquitectura híbrida**. Mantienes WebContainers para edición y preview de proyectos web, y dejas la ejecución multi-lenguaje como una ampliación opcional con Judge0 o con runners propios basados en Docker endurecido. Judge0 se define como un sistema abierto, escalable y sandboxed para ejecución online, con soporte para más de 90 lenguajes y uso explícito en online IDEs. Y si quisieras hacer runners propios, lo prudente sería usar al menos Docker rootless y capas adicionales como gVisor o microVMs tipo Firecracker para código no confiable, porque incluso el proyecto gVisor insiste en que “los contenedores no son una sandbox” por sí solos. citeturn10view12turn10view11turn13view0turn10view9turn10view10

Para la persistencia, escogería **PostgreSQL** por encima de MongoDB para el MVP, no porque MongoDB no sirva, sino porque el dominio del problema es muy relacional: usuarios, proyectos, snapshots, permisos, forks, publicaciones y ejecuciones. Además, PostgreSQL te deja crecer hacia controles de acceso más finos mediante políticas por fila si quisieras endurecer la parte multiusuario. Una estrategia simple y muy efectiva para el TFG es guardar **metadatos relacionales** en base de datos y **snapshots del filesystem** como JSON o ZIP exportados del runtime; WebContainers ya soporta exportación del filesystem. citeturn10view13turn14view0

Para la capa de colaboración, recomiendo una decisión de alcance muy concreta: usa **Yjs + y-websocket solo para el archivo activo** y deja fuera del MVP la sincronización de árboles completos, terminales compartidos o sesiones colaborativas permanentes. Así conviertes “colaborativo” en una mejora defendible y no en el centro de gravedad del proyecto. Si más adelante quieres presencia, awareness o cursores compartidos, esa misma pila ya te lo deja bastante encarrilado. citeturn10view7turn10view8turn12view0

En despliegue, necesitas un frontend alojado en una plataforma que soporte cabeceras personalizadas, porque WebContainers requiere COOP/COEP y depende de `SharedArrayBuffer`. Vercel, Netlify y Cloudflare Pages permiten definir headers personalizados; eso sí, tanto Netlify como Cloudflare indican que esos headers no se aplican automáticamente a respuestas generadas por funciones/SSR, por lo que un enfoque **SPA estática en React** te simplifica bastante la vida para este caso de TFG. citeturn10view3turn16view0turn15view0turn15view1turn15view2

## Riesgos y decisiones de alcance

El primer riesgo real es la **compatibilidad del navegador**. Tu aplicación puede tener un editor excelente gracias a Monaco y un terminal compatible en xterm.js sobre Chrome, Edge, Firefox o Safari modernos, pero eso no elimina la restricción específica de WebContainers: para el caso de uso de preview y recursos arbitrarios, la experiencia está realmente pensada para Chromium. Por eso, desde la primera página del producto deberías tratar la compatibilidad como requisito funcional: o bien el navegador es compatible y la experiencia completa se habilita, o bien muestras una pantalla de incompatibilidad con una alternativa de solo lectura. citeturn10view2turn11view1turn11view0

El segundo riesgo es la **tentación de sobreprometer la parte de IDE**. Un editor embebido con sintaxis, validación, terminal y preview puede parecer “un VS Code web”, pero técnicamente no es lo mismo que un entorno cloud completo con extensiones, devcontainers, máquinas virtuales y repositorios complejos. GitHub Codespaces, por ejemplo, ejecuta cada entorno en un contenedor Docker sobre una máquina virtual; ese listón de complejidad está muy por encima de lo que conviene asumir en un TFG cuando ya tienes una alternativa mucho más ligera para el MVP. citeturn10view16turn11view0

El tercer riesgo es **seguridad**, pero solo si decides mover ejecución al servidor. Docker aporta namespaces, cgroups y capacidades reducidas, y rootless mode mitiga parte de la superficie de ataque. Aun así, la propia documentación de Docker insiste en el ataque potencial del daemon y gVisor remarca explícitamente que los contenedores no deben tratarse como sandbox suficiente para código potencialmente malicioso. Si el tribunal o tu tutor valoran mucho el análisis de seguridad, aquí tienes una línea académica muy buena: justificar por qué el MVP se ejecuta client-side y qué implicaría un runner remoto de verdad. citeturn13view1turn10view11turn13view0turn10view9turn10view10

El cuarto riesgo, y probablemente el más importante a nivel de TFG, es el de **originalidad y aporte**. El “simple hecho” de hacer un IDE web ya tiene muchísimo prior art en StackBlitz, Replit, Judge0 IDE y Codespaces. Eso no invalida tu proyecto, pero sí significa que la aportación académica debe estar mejor definida: por ejemplo, un IDE web **browser-native y de bajo coste operativo**, o una **comparativa WebContainers vs runners remotos**, o una **plataforma para aprendizaje de desarrollo web con remix/fork y análisis de uso**, o un **módulo opcional de coedición CRDT acotado a un archivo**. Ese recorte, más que la tecnología concreta, es lo que hará que tu TFG se vea maduro. citeturn19view0turn19view1turn19view2turn10view16

Mi recomendación final de alcance es esta: **MVP obligatorio** con autenticación, proyectos persistentes, editor multiarchivo, ejecución y preview, guardado, publicación pública/privada, feed público y fork/remix. **Stretch goal** con coedición de un archivo usando Yjs. **Fuera de alcance** para la primera versión: multi-lenguaje generalista, shells Linux persistentes del lado servidor, marketplace de extensiones y colaboración total de proyecto. Con ese recorte, el proyecto pasa de idea interesante a TFG con posibilidades reales de terminarse bien. citeturn10view0turn10view7turn10view8turn10view12turn11view0

## Specs.md

Como principio de Spec-Driven Development, conviene que la **especificación** se centre en valor de usuario, requisitos testables, escenarios y criterios de éxito, dejando el detalle de implementación para el **plan** posterior. GitHub Spec Kit formaliza precisamente esa separación entre especificación, plan y tareas, y recomienda que la spec sea medible, verificable y con el mínimo de detalles de implementación. También es razonable usar términos normativos tipo **MUST / SHOULD / MAY** con el sentido clásico definido por RFC 2119. El archivo siguiente sigue esa filosofía: acota el MVP de forma productiva y deja la implementación concreta al roadmap. citeturn10view14turn10view15turn20view0turn20view2turn17view0

```md
# Specs.md

## Estado

Borrador v1 para TFG

> Nota normativa:
> Las palabras MUST, MUST NOT, SHOULD, SHOULD NOT, MAY y OPTIONAL se interpretan en el sentido habitual de una especificación técnica.

## Resumen

IDE Web Colaborativo es una plataforma web que permite a una persona usuaria crear, editar, guardar, ejecutar y compartir proyectos de código desde el navegador, sin depender de una instalación local para el flujo principal del MVP.

El producto prioriza una experiencia desktop-first y un alcance de MVP centrado en proyectos web ejecutables desde un runtime compatible con el navegador. La colaboración síncrona en tiempo real se considera una capacidad ampliable, no un requisito bloqueante del MVP.

## Problema

Las personas que aprenden o prototipan software web suelen enfrentarse a tres fricciones:

- La necesidad de configurar entornos locales antes de empezar.
- La dificultad para compartir un proyecto ejecutable de forma inmediata.
- La separación entre edición, ejecución y descubrimiento de proyectos de otras personas.

El sistema debe reducir esas fricciones en una única plataforma.

## Objetivos del producto

- Permitir crear un proyecto y empezar a editar código en pocos minutos.
- Permitir ejecutar el proyecto desde la propia web.
- Permitir guardar y recuperar el trabajo desde una cuenta personal.
- Permitir publicar proyectos para que otras personas los exploren, ejecuten y remixen.
- Mantener un alcance realista para un TFG individual.

## No objetivos del MVP

- Soporte generalista para todos los lenguajes de programación.
- Compatibilidad con extensiones completas tipo marketplace de VS Code.
- Terminal Linux persistente del lado servidor.
- Colaboración síncrona de proyecto completo con árbol de archivos compartido.
- Infraestructura multi-tenant de ejecución remota de propósito general.

## Personas usuarias

### Persona estudiante

Quiere practicar, experimentar con proyectos pequeños y compartirlos con facilidad.

### Persona desarrolladora junior

Quiere prototipar una idea web y compartir una demo ejecutable sin preparar un entorno local.

### Persona visitante

Quiere navegar por proyectos públicos, ejecutarlos y clonar una base para empezar más rápido.

## Supuestos de alcance

- El MVP se orienta a escritorio.
- El MVP se orienta a proyectos web compatibles con ejecución en navegador para el flujo principal.
- La palabra "colaborativo" en el MVP significa, como mínimo, compartir, publicar, explorar y forkar proyectos.
- La coedición en tiempo real se trata como capacidad SHOULD, no MUST.

## Historias de usuario

### US-01 Crear, editar y guardar un proyecto

Como persona usuaria autenticada, quiero crear un proyecto desde una plantilla, editar varios archivos y guardar mis cambios para continuar más tarde.

### US-02 Ejecutar un proyecto desde la web

Como persona usuaria, quiero lanzar mi proyecto y ver una preview o un resultado de ejecución sin salir del navegador.

### US-03 Compartir y explorar proyectos

Como persona usuaria, quiero publicar un proyecto y como visitante quiero poder abrirlo, ejecutarlo y hacer fork/remix si me interesa.

### US-04 Colaboración síncrona opcional

Como persona usuaria, quiero poder invitar a otra persona a editar conmigo un archivo concreto, viendo presencia/cursores básicos, si esa funcionalidad llega a implementarse.

## Requisitos funcionales

### RF-01 Gestión de cuenta

El sistema MUST permitir registro, inicio de sesión y cierre de sesión.

### RF-02 Creación de proyectos

El sistema MUST permitir crear un proyecto nuevo a partir de al menos una plantilla inicial.

### RF-03 Edición multiarchivo

El sistema MUST permitir abrir, crear, renombrar, editar y eliminar archivos y carpetas dentro de un proyecto.

### RF-04 Guardado persistente

El sistema MUST permitir guardar el proyecto en la cuenta de la persona usuaria y recuperarlo en sesiones futuras.

### RF-05 Ejecución integrada

El sistema MUST permitir ejecutar el proyecto desde la interfaz web y mostrar un resultado observable por la persona usuaria.

### RF-06 Preview o salida de ejecución

El sistema MUST mostrar una preview embebida para proyectos compatibles o una salida equivalente cuando la ejecución no produzca interfaz visual.

### RF-07 Consola o logs

El sistema SHOULD mostrar logs, errores o salida textual asociada a la ejecución.

### RF-08 Visibilidad del proyecto

El sistema MUST permitir marcar un proyecto como privado o público.

### RF-09 Página pública de proyecto

El sistema MUST generar una vista pública para proyectos publicados con información básica, código visible y opción de ejecución cuando proceda.

### RF-10 Exploración de comunidad

El sistema MUST permitir consultar una lista de proyectos públicos.

### RF-11 Fork o remix

El sistema MUST permitir crear una copia propia a partir de un proyecto público.

### RF-12 Compartición mediante enlace

El sistema SHOULD permitir compartir un proyecto público mediante URL estable.

### RF-13 Compatibilidad y fallback

El sistema MUST detectar si el entorno del navegador no soporta la experiencia completa e informar a la persona usuaria con claridad.

### RF-14 Colaboración síncrona opcional

El sistema MAY ofrecer una sesión de coedición sobre el archivo activo con presencia básica y sincronización en tiempo real.

## Requisitos no funcionales

### RNF-01 Seguridad de ejecución

La ejecución de código del MVP MUST realizarse en un entorno aislado respecto al backend principal de negocio.

### RNF-02 Rendimiento percibido

Abrir un proyecto existente SHOULD sentirse inmediato para proyectos de tamaño pequeño o mediano.

### RNF-03 Usabilidad

La interfaz MUST priorizar una experiencia clara de editor, explorador de archivos, ejecución y preview.

### RNF-04 Integridad de datos

Los cambios guardados MUST poder recuperarse de forma consistente.

### RNF-05 Compatibilidad objetivo

La experiencia completa MUST definirse como desktop-first sobre navegadores compatibles anunciados por el sistema.

### RNF-06 Observabilidad básica

El sistema SHOULD registrar errores de ejecución, fallos de guardado y eventos clave del flujo de usuario.

## Entidades clave

### Usuario

Representa la identidad que posee proyectos y preferencias básicas.

### Proyecto

Representa una unidad de trabajo editable, ejecutable y compartible.

### Snapshot de proyecto

Representa el estado persistido de archivos y configuración del proyecto en un momento determinado.

### Publicación

Representa el estado público/privado del proyecto y su metadato de exposición comunitaria.

### Fork

Representa la relación entre un proyecto original y una copia derivada.

### Sesión de ejecución

Representa un intento de ejecución con su resultado, logs y estado.

## Escenarios de aceptación

### Escenario principal de creación y ejecución

1. La persona usuaria inicia sesión.
2. Crea un proyecto desde una plantilla.
3. Modifica al menos un archivo.
4. Ejecuta el proyecto.
5. Observa una preview o salida válida.
6. Guarda el proyecto.
7. Cierra sesión.
8. Vuelve a iniciar sesión y recupera el proyecto guardado.

Resultado esperado:
El proyecto se conserva y puede volver a ejecutarse.

### Escenario principal de publicación y exploración

1. La persona usuaria publica un proyecto.
2. Un visitante abre la página pública.
3. El visitante puede consultar el contenido y, si aplica, ejecutarlo.
4. El visitante crea un fork/remix.

Resultado esperado:
Se crea una copia independiente asociada al nuevo propietario.

### Escenario de entorno no compatible

1. La persona usuaria abre la aplicación en un entorno no compatible.
2. El sistema detecta la incompatibilidad.
3. Se informa con claridad del problema y de la limitación de experiencia.

Resultado esperado:
No hay fallo silencioso ni interfaz rota.

## Criterios de éxito

- Una persona usuaria nueva puede crear su primer proyecto y ejecutarlo sin ayuda externa.
- Una persona usuaria registrada puede recuperar un proyecto previamente guardado sin pérdida de estructura.
- Un visitante puede abrir un proyecto público y entender cómo reutilizarlo.
- El MVP puede mostrarse en una demo de TFG de principio a fin sin depender de configuración local previa.
- El alcance final implementado es defendible como TFG individual y no depende de una infraestructura compleja de sandboxing server-side.

## Riesgos asumidos

- La experiencia completa depende del soporte del navegador objetivo.
- La colaboración síncrona puede no entrar en el MVP si compromete el calendario.
- El soporte multi-lenguaje se pospone para evitar un alcance inviable.

## Criterio de cierre del MVP

El MVP se considerará cerrado cuando estén completas US-01, US-02 y US-03 de forma estable, y US-04 quede documentada como opcional o futura si no entra en tiempo.
```

Este `Specs.md` mantiene la idea central del producto, pero la transforma en un alcance **medible y defendible**. La clave es que “colaborativo” no te obligue a resolver desde el día uno todos los problemas de sincronización y sandboxing: la spec deja clara la colaboración comunitaria como mínimo y la coedición síncrona como ampliación. Eso es coherente con el enfoque SDD de especificar primero el valor, acotar el alcance y medir el éxito antes de implementar. citeturn10view14turn10view15turn20view2turn10view7turn10view8

## RoadMap.md

En términos de Spec-Driven Development, el siguiente archivo funciona como tu **plan de implementación y roadmap de entrega**, inspirado en la separación entre `spec`, `plan` y `tasks` de Spec Kit. Lo he ordenado por **riesgo técnico real**: primero se valida la ejecución en navegador y la compatibilidad, luego la persistencia y por último la capa comunitaria; la colaboración en tiempo real queda como fase opcional porque es claramente la parte más expansiva del proyecto. Esa prioridad está directamente justificada por las restricciones de WebContainers, la necesidad de COOP/COEP y la complejidad añadida de Yjs para coedición. citeturn20view0turn18search4turn10view1turn10view2turn10view3turn10view8turn12view0

```md
# RoadMap.md

## Resumen

Roadmap de 14 semanas para un TFG individual.

Estrategia:
- Entregar primero un MVP sólido.
- Resolver pronto el mayor riesgo técnico: la ejecución en navegador.
- Posponer cualquier decisión de infraestructura pesada.
- Mantener la coedición en tiempo real como fase opcional.

## Contexto técnico propuesto

### Frontend
- React
- Monaco Editor
- xterm.js

### Backend
- Node.js
- Express

### Persistencia
- PostgreSQL para usuarios, proyectos, visibilidad, forks y metadatos
- Snapshot del proyecto persistido como estructura serializada

### Ejecución
- MVP: runtime en navegador compatible con proyectos web
- Ampliación futura: runner remoto multi-lenguaje

### Tiempo real opcional
- Yjs
- y-websocket

### Despliegue
- Frontend en hosting con headers configurables
- Backend y base de datos en hosting estándar de Node

## Principios de planificación

- No empezar por la “comunidad” antes de validar el núcleo del IDE.
- No prometer multi-lenguaje en el MVP.
- No mover ejecución al servidor salvo que el spike técnico obligue a pivotar.
- Cada fase debe terminar con una demo verificable.

## Historias de usuario priorizadas

### P1
US-01 Crear, editar y guardar un proyecto

### P1
US-02 Ejecutar un proyecto y ver su salida

### P1
US-03 Publicar, explorar y forkar proyectos

### P2
US-04 Coeditar un archivo en tiempo real con presencia básica

## Fase de descubrimiento y spike técnico

### Semanas objetivo
Semana 1 a Semana 2

### Objetivo
Demostrar que el núcleo técnico del proyecto funciona antes de construir producto alrededor.

### Tareas
- Crear un prototipo mínimo de editor + explorador de archivos.
- Montar una plantilla de proyecto.
- Editar un archivo y reflejar cambios.
- Lanzar ejecución y mostrar preview.
- Probar guardado/carga de snapshot.
- Verificar soporte real del navegador objetivo.
- Verificar despliegue con headers requeridos.

### Entregables
- Demo técnica mínima funcionando
- Registro de decisiones de arquitectura
- Lista de riesgos confirmados y mitigaciones

### Criterio de salida
Debe existir una demo en la que se pueda:
- abrir editor,
- cambiar código,
- ejecutar,
- ver preview,
- exportar o persistir snapshot.

### Regla de pivot
Si el spike de ejecución no es estable, el proyecto debe pivotar a:
- editor web + persistencia + ejecución simplificada,
o
- editor web + ejecución single-file por backend separado.

## Fase de base de producto

### Semanas objetivo
Semana 3 a Semana 5

### Objetivo
Construir la base multiusuario y la persistencia de proyectos.

### Tareas
- Diseño de esquema de datos
- Autenticación
- CRUD de proyectos
- Gestión de visibilidad pública/privada
- Persistencia de snapshots
- Lista de proyectos de la persona usuaria
- Recuperación de proyecto guardado
- Gestión básica de errores

### Entregables
- Login funcional
- Crear proyecto
- Guardar proyecto
- Abrir proyecto existente
- Proyectos privados por defecto

### Criterio de salida
US-01 debe ser demostrable de principio a fin.

## Fase de IDE ejecutable

### Semanas objetivo
Semana 6 a Semana 8

### Objetivo
Convertir la base del producto en un IDE usable.

### Tareas
- Integración final del editor
- Explorador de archivos estable
- Consola/logs
- Ejecución desde botón Run
- Preview embebida
- Estados de carga, error y reset
- Detección de navegador no compatible
- UX mínima de editor, preview y logs

### Entregables
- Interfaz principal del IDE
- Ejecución repetible
- Preview estable para la plantilla objetivo
- Manejo claro de errores de ejecución

### Criterio de salida
US-02 debe ser demostrable de forma estable.

## Fase de comunidad y sharing

### Semanas objetivo
Semana 9 a Semana 10

### Objetivo
Añadir la parte pública que convierte el proyecto en plataforma y no solo en editor personal.

### Tareas
- Página pública de proyecto
- Feed o galería de proyectos públicos
- Fork/remix
- Metadatos básicos de proyecto
- Vistas de propietario vs visitante
- URL compartible

### Entregables
- Navegación de proyectos públicos
- Página pública ejecutable o visualizable
- Fork funcional a cuenta propia

### Criterio de salida
US-03 debe estar cerrada.

## Fase de endurecimiento y validación

### Semanas objetivo
Semana 11 a Semana 12

### Objetivo
Asegurar que el MVP es defendible, estable y demostrable.

### Tareas
- Testing de flujos críticos
- Validación de seguridad del alcance elegido
- Observabilidad básica y logging
- Gestión de errores y estados vacíos
- Refinado visual mínimo
- Documentación técnica
- Preparación de demo final

### Entregables
- Checklist de validación del MVP
- Informe breve de límites conocidos
- Script de demo
- Capturas y arquitectura final

### Criterio de salida
La demo de TFG debe ejecutarse de principio a fin sin improvisación.

## Fase opcional de colaboración en tiempo real

### Semanas objetivo
Semana 13 a Semana 14

### Objetivo
Introducir colaboración síncrona solo si el MVP ya está cerrado.

### Alcance recomendado
- Coedición del archivo activo
- Presencia básica
- Cursores o awareness
- Sincronización de cambios
- Sin terminal compartida
- Sin sincronización completa del árbol del proyecto

### Tareas
- Integrar modelo colaborativo del editor
- Resolver sesiones o salas
- Añadir awareness de usuarios
- Gestionar conflictos básicos de UX
- Definir límites del feature

### Entregables
- Demo de dos clientes editando el mismo archivo
- Documentación de límites de la colaboración

### Criterio de salida
La colaboración debe percibirse claramente, aunque siga siendo un feature acotado.

## Riesgos y mitigaciones

### Riesgo
El navegador no soporta la experiencia completa.

### Mitigación
Detectar incompatibilidad y mostrar mensaje/flujo alternativo. No ocultar el problema.

### Riesgo
La ejecución integrada no es estable.

### Mitigación
Pivot temprano a una ejecución simplificada antes de seguir añadiendo features.

### Riesgo
La colaboración en tiempo real consume demasiado calendario.

### Mitigación
Mantenerla fuera del MVP y convertirla en ampliación evaluable.

### Riesgo
La comunidad pública dispersa el foco.

### Mitigación
Reducir comunidad a tres capacidades:
- listar proyectos públicos,
- abrir proyecto público,
- fork/remix.

## Definition of Done del TFG

El TFG se considera completo cuando existe una versión desplegada que permite:

- autenticarse,
- crear un proyecto,
- editar varios archivos,
- ejecutar el proyecto,
- guardar cambios,
- recuperar el proyecto,
- publicar un proyecto,
- abrir un proyecto público,
- crear un fork/remix.

La colaboración en tiempo real cuenta como mejora de nota o ampliación, no como condición para considerar fracasado el trabajo.

## Resultado esperado

Un MVP sólido, demostrable y técnicamente defendible, con una arquitectura de crecimiento clara y sin depender desde el inicio de una infraestructura compleja de sandboxing remoto.
```

El punto fuerte de este `RoadMap.md` es que pone el **spike técnico muy pronto** y define un **pivot explícito**. Eso es exactamente lo que conviene en un TFG con riesgo tecnológico: validar primero que tu núcleo funciona en ejecución real, no después de haber invertido semanas en autenticación, comunidad o UI. Además, el roadmap deja la colaboración en tiempo real como ampliación natural con Yjs, en vez de convertirla en un requisito que pueda hundir el calendario entero. citeturn10view5turn14view0turn10view1turn10view2turn10view3turn10view7turn10view8turn12view0