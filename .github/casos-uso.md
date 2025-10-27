 CU01 – Login al sistema
Campo
Contenido
Número de CU
CU01
Nombre
Autenticarse en el sistema
Versión


Autores


Objetivos asociados
Permitir el acceso seguro al sistema.
Requisitos asociados
Validar credenciales y estado del usuario.
Actor principal
Usuario
Descripción
El actor ingresa sus credenciales para acceder al sistema.
Precondiciones
El usuario debe estar registrado y activo.
Postcondiciones
El usuario accede al sistema con su perfil habilitado.
Secuencia normal
Paso 1 – El actor accede a la pantalla de login.


Paso 2 – Ingresa usuario y contraseña.


Paso 3 – El sistema valida las credenciales.


Paso 4 – El sistema permite el acceso.
Flujo alternativo
Paso A1 – El actor solicita recuperación de contraseña.
Excepciones
Paso E1 – Usuario o contraseña incorrectos.


Paso E2 – Usuario inactivo.
Validaciones
El sistema debe verificar existencia en D7 y estado activo.
Importancia
Alta
Urgencia
Alta
Comentarios
Este CU inicia la sesión de trabajo del usuario en el sistema.


🧾 CU02 – Registrar  paciente
Campo
Contenido
Número de CU
CU02
Nombre
Registrar paciente
Versión


Autores


Objetivos asociados
Incorporar nuevos pacientes al sistema.
Requisitos asociados
Validar datos personales y estado inicial.
Actor principal
Administrativo
Descripción
El actor registra un nuevo paciente en el sistema.
Precondiciones
El paciente no debe estar previamente registrado.
Postcondiciones
El paciente queda registrado y activo en el sistema.
Secuencia normal
Paso 1 – El actor accede al módulo de pacientes.


Paso 2 – Ingresa los datos personales del paciente.


Paso 3 – El sistema verifica que no esté registrado previamente.


Paso 4 – El sistema guarda el registro y activa al paciente.
Flujo alternativo
Paso A1 – El actor adjunta documentación adicional.
Excepciones
Paso E1 – Paciente duplicado.
Validaciones
El sistema debe verificar unicidad en D1.
Importancia
Alta
Urgencia
Alta
Comentarios
Este CU inicia el ciclo clínico y administrativo del paciente.


🧾 CU03 – Consultar Paciente
Campo
Contenido
Número de CU
CU03
Nombre
Consultar paciente
Versión


Autores


Objetivos asociados
Acceder a la ficha del paciente.
Requisitos asociados
Permitir búsqueda por nombre, documento o estado.
Actor principal
Administrativo
Descripción
El actor accede a la información de un paciente registrado.
Precondiciones
El paciente debe estar registrado.
Postcondiciones
Se muestra la ficha del paciente.
Secuencia normal
Paso 1 – El actor accede al módulo de pacientes.


Paso 2 – Ingresa criterios de búsqueda.


Paso 3 – El sistema verifica que el paciente esté registrado.


Paso 4 – El sistema muestra la ficha del paciente.
Flujo alternativo
Paso A1 – El actor exporta la ficha.
Excepciones
Paso E1 – Paciente no encontrado.
Validaciones
El sistema debe consultar existencia en D1.
Importancia
Alta
Urgencia
Media
Comentarios
Este CU permite acceder a datos clínicos y administrativos del paciente.


🧾 CU04 – Modificar paciente
Campo
Contenido
Número de CU
CU04
Nombre
Modificar paciente
Versión


Autores


Objetivos asociados
Actualizar datos del paciente.
Requisitos asociados
Validar existencia y registrar cambios.
Actor principal
Administrativo
Descripción
El actor modifica los datos de un paciente registrado.
Precondiciones
El paciente debe estar registrado.
Postcondiciones
Se actualiza la ficha del paciente.
Secuencia normal
Paso 1 – El actor accede al módulo de pacientes.


Paso 2 – Selecciona el paciente.


Paso 3 – El sistema verifica que esté registrado.


Paso 4 – Realiza las modificaciones.


Paso 5 – El sistema guarda los cambios.
Flujo alternativo
Paso A1 – El actor deja una nota justificando el cambio.
Excepciones
Paso E1 – Paciente no encontrado.
Validaciones
El sistema debe verificar existencia en D1.
Importancia
Alta
Urgencia
Media
Comentarios
Este CU permite mantener actualizada la información del paciente.


🧾 CU05 – Dar de baja paciente
Campo
Contenido
Número de CU
CU05
Nombre
Dar de baja paciente
Versión


Autores


Objetivos asociados
Revocar el acceso del paciente al sistema.
Requisitos asociados
Validar que no tenga procesos activos.
Actor principal
Administrativo
Descripción
El actor cambia el estado del paciente a inactivo.
Precondiciones
El paciente debe estar registrado y sin procesos activos.
Postcondiciones
El paciente queda inactivo en el sistema.
Secuencia normal
Paso 1 – El actor accede al módulo de pacientes.


Paso 2 – Selecciona el paciente.


Paso 3 – El sistema verifica que esté registrado.


Paso 4 – El sistema verifica que no tenga procesos activos.


Paso 5 – Cambia el estado a inactivo.
Flujo alternativo
Paso A1 – El actor deja una nota de baja en la ficha del paciente.
Excepciones
Paso E1 – Paciente con procesos activos.
Validaciones
El sistema debe verificar estado en D1 y procesos en curso.
Importancia
Alta
Urgencia
Alta
Comentarios
Este CU garantiza la seguridad operativa y el cierre administrativo.



🧾 CU06 – Consultar agenda médica
Campo
Contenido
Número de CU
CU06
Nombre
Consultar agenda médica
Versión


Autores


Objetivos asociados
Visualizar disponibilidad de turnos por profesional.
Requisitos asociados
Permitir filtros por fecha, profesional y consultorio.
Actor principal
Administrativo
Descripción
El actor accede a la agenda médica para consultar disponibilidad.
Precondiciones
Debe existir al menos un profesional activo con agenda configurada.
Postcondiciones
Se muestra la disponibilidad de turnos.
Secuencia normal
Paso 1 – El actor accede al módulo de agenda médica.


Paso 2 – Selecciona profesional, fecha y consultorio.


Paso 3 – El sistema verifica que el profesional esté activo.


Paso 4 – El sistema muestra la disponibilidad de turnos.
Flujo alternativo
Paso A1 – El actor exporta la agenda.
Excepciones
Paso E1 – Profesional sin agenda configurada.
Validaciones
El sistema debe consultar disponibilidad en D5.
Importancia
Alta
Urgencia
Media
Comentarios
Este CU permite gestionar la asignación de turnos de forma eficiente.

🧾 CU07 – Configurar agenda médica
Campo
Contenido
Número de CU
CU07
Nombre
Configurar agenda médica
Versión


Autores


Objetivos asociados
Establecer disponibilidad de atención por profesional.
Requisitos asociados
Validar horarios, consultorios y especialidades.
Actor principal
Administrativo
Descripción
El actor configura la agenda médica de un profesional.
Precondiciones
El profesional debe estar registrado y activo.
Postcondiciones
La agenda queda registrada y disponible para asignación de turnos.
Secuencia normal
Paso 1 – El actor accede al módulo de agenda médica.


Paso 2 – Selecciona el profesional.


Paso 3 – Define días, horarios y consultorios disponibles.


Paso 4 – El sistema guarda la configuración.
Flujo alternativo
Paso A1 – El actor adjunta observaciones o restricciones.
Excepciones
Paso E1 – Horario inválido.


Paso E2 – Consultorio no disponible.
Validaciones
El sistema debe validar disponibilidad en D5.
Importancia
Alta
Urgencia
Alta
Comentarios
Este CU permite establecer la lógica de atención médica en la clínica.


🧾 CU08 – Solicitar turno
Campo
Contenido
Número de CU
CU08
Nombre
Solicitar turno
Versión


Autores


Objetivos asociados
Asignar turnos de forma organizada y accesible.
Requisitos asociados
Validar estado del paciente y profesional. Permitir registro multicanal.
Actor principal
Administrativo
Descripción
El actor registra una solicitud de turno realizada por el paciente.
Precondiciones
El paciente debe estar registrado y activo. Debe existir disponibilidad.
Postcondiciones
El turno queda registrado en el sistema.
Secuencia normal
Paso 1 – El paciente solicita turno por teléfono o presencialmente.


Paso 2 – El actor accede al módulo de turnos.


Paso 3 – Selecciona el paciente.


Paso 4 – El sistema verifica que el paciente esté registrado y activo.


Paso 5 – Selecciona profesional, fecha y consultorio.


Paso 6 – El sistema verifica que el profesional esté registrado y activo.


Paso 7 – El sistema consulta disponibilidad en la agenda médica.


Paso 8 – Se registra el turno.
Flujo alternativo
Paso A1 – El actor registra observaciones en el turno.
Excepciones
Paso E1 – Agenda sin disponibilidad.


Paso E2 – Paciente inactivo.


Paso E3 – Profesional inactivo.
Validaciones
El sistema debe consultar disponibilidad en D5 y registrar el turno en D4.
Importancia
Alta
Urgencia
Alta
Comentarios
Este CU refleja la interacción directa entre paciente, administrativo y profesional.

















🧾 CU09 – Registrar atención médica
Campo
Contenido
Número de CU
CU09
Nombre
Registrar atención médica
Versión


Autores


Objetivos asociados
Registrar la atención clínica realizada al paciente.
Requisitos asociados
Validar turno asignado y profesional activo.
Actor principal
Profesional médico
Descripción
El actor registra la atención médica realizada al paciente.
Precondiciones
Debe existir un turno asignado y el profesional debe estar activo.
Postcondiciones
Se guarda la atención médica en el historial del paciente.
Secuencia normal
Paso 1 – El actor accede al módulo de atención médica.


Paso 2 – Selecciona el turno asignado.


Paso 3 – El sistema verifica que el turno esté registrado.


Paso 4 – Ingresa diagnóstico, tratamiento y observaciones.


Paso 5 – El sistema guarda el registro.
Flujo alternativo
Paso A1 – El actor adjunta estudios complementarios.
Excepciones
Paso E1 – Turno no encontrado.


Paso E2 – Profesional inactivo.
Validaciones
El sistema debe verificar existencia en D4 y estado en D2.
Importancia
Alta
Urgencia
Alta
Comentarios
Este CU vincula la atención clínica con el historial del paciente.

🧾 CU10 – Consultar evolución clínica
Campo
Contenido
Número de CU
CU10
Nombre
Consultar evolución clínica
Versión


Autores


Objetivos asociados
Acceder al historial clínico del paciente.
Requisitos asociados
Permitir filtros por fecha, profesional y diagnóstico.
Actor principal
Profesional médico
Descripción
El actor accede al historial de atenciones médicas registradas.
Precondiciones
Deben existir atenciones médicas registradas.
Postcondiciones
Se muestra la evolución clínica del paciente.
Secuencia normal
Paso 1 – El actor accede al módulo de atención médica.


Paso 2 – Selecciona el paciente.


Paso 3 – El sistema verifica que existan atenciones registradas.


Paso 4 – El sistema muestra la evolución clínica.
Flujo alternativo
Paso A1 – El actor exporta el historial.
Excepciones
Paso E1 – Paciente sin atenciones registradas.
Validaciones
El sistema debe consultar existencia en D6.
Importancia
Alta
Urgencia
Media
Comentarios
Este CU permite el seguimiento clínico del paciente por parte del profesional.



🧾 CU11 – Cancelar turno
Campo
Contenido
Número de CU
CU11
Nombre
Cancelar turno
Versión


Autores


Objetivos asociados
Liberar un turno previamente asignado.
Requisitos asociados
Validar existencia del turno y motivo de cancelación.
Actor principal
Administrativo
Descripción
El actor cancela un turno registrado en el sistema.
Precondiciones
Debe existir un turno registrado.
Postcondiciones
El turno queda cancelado y disponible para reasignación.
Secuencia normal
Paso 1 – El actor accede al módulo de turnos.


Paso 2 – Selecciona el turno a cancelar.


Paso 3 – Ingresa motivo de cancelación.


Paso 4 – El sistema guarda la cancelación.
Flujo alternativo
Paso A1 – El actor deja una nota en la ficha del paciente.
Excepciones
Paso E1 – Turno no encontrado.
Validaciones
El sistema debe verificar existencia en D4.
Importancia
Alta
Urgencia
Alta
Comentarios
Este CU permite gestionar la disponibilidad de la agenda médica.

🧾 CU12 – Reprogramar turno
Campo
Contenido
Número de CU
CU12
Nombre
Reprogramar turno
Versión


Autores


Objetivos asociados
Cambiar la fecha y hora de un turno previamente asignado.
Requisitos asociados
Validar existencia del turno y disponibilidad en agenda.
Actor principal
Administrativo
Descripción
El actor modifica la fecha y hora de un turno registrado.
Precondiciones
Debe existir un turno registrado.
Postcondiciones
El turno queda actualizado con nueva fecha y hora.
Secuencia normal
Paso 1 – El actor accede al módulo de turnos.


Paso 2 – Selecciona el turno a reprogramar.


Paso 3 – El sistema verifica que el turno esté registrado.


Paso 4 – Selecciona nueva fecha y hora.


Paso 5 – El sistema verifica disponibilidad en agenda.


Paso 6 – El sistema guarda los cambios.
Flujo alternativo
Paso A1 – El actor deja una nota justificando la reprogramación.
Excepciones
Paso E1 – Turno no encontrado.


Paso E2 – Sin disponibilidad en la nueva fecha.
Validaciones
El sistema debe verificar existencia en D4 y disponibilidad en D5.
Importancia
Alta
Urgencia
Alta
Comentarios
Este CU permite mantener la continuidad asistencial sin perder trazabilidad.

🧾 CU13 – Registrar profesional
Campo
Contenido
Número de CU
CU13
Nombre
Registrar profesional
Versión


Autores


Objetivos asociados
Incorporar nuevos profesionales al sistema.
Requisitos asociados
Validar datos y credenciales.
Actor principal
Administrativo
Descripción
El actor registra un nuevo profesional en el sistema.
Precondiciones
El profesional no debe estar previamente registrado.
Postcondiciones
El profesional queda registrado y activo.
Secuencia normal
Paso 1 – El actor accede al módulo de profesionales.


Paso 2 – Ingresa los datos del profesional.


Paso 3 – El sistema verifica que no esté registrado previamente.


Paso 4 – El sistema guarda el registro y activa al profesional.
Flujo alternativo
Paso A1 – El actor adjunta documentación de título o matrícula.
Excepciones
Paso E1 – Profesional duplicado.
Validaciones
El sistema debe verificar unicidad en D2.
Importancia
Alta
Urgencia
Alta
Comentarios
Este CU inicia el ciclo operativo del profesional en la clínica.


🧾 CU14 – Consultar profesional
Campo
Contenido
Número de CU
CU14
Nombre
Consultar profesional
Versión


Autores


Objetivos asociados
Acceder a la ficha del profesional.
Requisitos asociados
Permitir búsqueda por nombre, matrícula o estado.
Actor principal
Administrativo
Descripción
El actor accede a la información de un profesional registrado.
Precondiciones
El profesional debe estar registrado.
Postcondiciones
Se muestra la ficha del profesional.
Secuencia normal
Paso 1 – El actor accede al módulo de profesionales.


Paso 2 – Ingresa criterios de búsqueda.


Paso 3 – El sistema verifica que el profesional esté registrado.


Paso 4 – El sistema muestra la ficha del profesional.
Flujo alternativo
Paso A1 – El actor exporta la ficha.
Excepciones
Paso E1 – Profesional no encontrado.
Validaciones
El sistema debe consultar existencia en D2.
Importancia
Alta
Urgencia
Media
Comentarios
Este CU permite acceder a datos operativos y clínicos del profesional.


🧾 CU15 – Modificar profesional
Campo
Contenido
Número de CU
CU15
Nombre
Modificar profesional
Versión


Autores


Objetivos asociados
Actualizar datos del profesional.
Requisitos asociados
Validar existencia y registrar cambios.
Actor principal
Administrativo
Descripción
El actor modifica los datos de un profesional registrado.
Precondiciones
El profesional debe estar registrado.
Postcondiciones
Se actualiza la ficha del profesional.
Secuencia normal
Paso 1 – El actor accede al módulo de profesionales.


Paso 2 – Selecciona el profesional.


Paso 3 – Realiza las modificaciones necesarias.


Paso 4 – El sistema guarda los cambios.
Flujo alternativo
Paso A1 – El actor deja una nota justificando el cambio.
Excepciones
Paso E1 – Profesional no encontrado.
Validaciones
El sistema debe verificar existencia en D2.
Importancia
Alta
Urgencia
Media
Comentarios
Este CU permite mantener actualizada la información del profesional.


🧾 CU16 – Dar de baja profesional
Campo
Contenido
Número de CU
CU16
Nombre
Dar de baja profesional
Versión


Autores


Objetivos asociados
Inactivar profesionales que ya no prestan servicios.
Requisitos asociados
Validar que no tengan turnos ni agenda activa.
Actor principal
Administrativo
Descripción
El actor cambia el estado del profesional a inactivo.
Precondiciones
El profesional debe estar registrado y sin actividad vigente.
Postcondiciones
El profesional queda inactivo en el sistema.
Secuencia normal
Paso 1 – El actor accede al módulo de profesionales.


Paso 2 – Selecciona el profesional.


Paso 3 – El sistema verifica que no tenga turnos ni agenda activa.


Paso 4 – Cambia el estado a inactivo.
Flujo alternativo
Paso A1 – El actor deja una nota justificando la baja.
Excepciones
Paso E1 – Profesional con actividad vigente.
Validaciones
El sistema debe verificar estado en D2 y uso en D4 y D5.
Importancia
Alta
Urgencia
Alta
Comentarios
Este CU permite mantener la integridad operativa del sistema.


🧾 CU17 – Registrar consultorio
Campo
Contenido
Número de CU
CU17
Nombre
Registrar consultorio
Versión


Autores


Objetivos asociados
Incorporar nuevos espacios físicos al sistema.
Requisitos asociados
Validar nombre, ubicación y disponibilidad.
Actor principal
Administrativo
Descripción
El actor registra un nuevo consultorio en el sistema.
Precondiciones
El consultorio no debe estar previamente registrado.
Postcondiciones
El consultorio queda disponible para asignación en agendas.
Secuencia normal
Paso 1 – El actor accede al módulo de consultorios.


Paso 2 – Ingresa los datos del consultorio.


Paso 3 – El sistema verifica que no esté registrado previamente.


Paso 4 – El sistema guarda el registro.
Flujo alternativo
Paso A1 – El actor adjunta plano o referencia física.
Excepciones
Paso E1 – Consultorio duplicado.
Validaciones
El sistema debe verificar unicidad en D3.
Importancia
Alta
Urgencia
Alta
Comentarios
Este CU permite ampliar la capacidad operativa de la clínica.


🧾 CU18 – Consultar consultorio
Campo
Contenido
Número de CU
CU18
Nombre
Consultar consultorio
Versión


Autores


Objetivos asociados
Acceder a la información de los consultorios registrados.
Requisitos asociados
Permitir búsqueda por nombre, ubicación o estado.
Actor principal
Administrativo
Descripción
El actor accede a los datos de un consultorio registrado.
Precondiciones
El consultorio debe estar registrado.
Postcondiciones
Se muestra la ficha del consultorio.
Secuencia normal
Paso 1 – El actor accede al módulo de consultorios.


Paso 2 – Ingresa criterios de búsqueda.


Paso 3 – El sistema verifica que el consultorio esté registrado.


Paso 4 – El sistema muestra la ficha del consultorio.
Flujo alternativo
Paso A1 – El actor exporta la ficha.
Excepciones
Paso E1 – Consultorio no encontrado.
Validaciones
El sistema debe consultar existencia en D3.
Importancia
Alta
Urgencia
Media
Comentarios
Este CU permite acceder a la infraestructura disponible para atención médica.


🧾 CU19 – Modificar consultorio
Campo
Contenido
Número de CU
CU19
Nombre
Modificar consultorio
Versión


Autores


Objetivos asociados
Actualizar los datos de un consultorio registrado.
Requisitos asociados
Validar existencia y registrar cambios.
Actor principal
Administrativo
Descripción
El actor modifica los datos de un consultorio registrado.
Precondiciones
El consultorio debe estar registrado.
Postcondiciones
Se actualiza la ficha del consultorio.
Secuencia normal
Paso 1 – El actor accede al módulo de consultorios.


Paso 2 – Selecciona el consultorio.


Paso 3 – Realiza las modificaciones necesarias.


Paso 4 – El sistema guarda los cambios.
Flujo alternativo
Paso A1 – El actor deja una nota justificando la modificación.
Excepciones
Paso E1 – Consultorio no encontrado.
Validaciones
El sistema debe verificar existencia en D3.
Importancia
Alta
Urgencia
Media
Comentarios
Este CU permite mantener actualizada la infraestructura operativa.


🧾 CU20 – Dar de baja consultorio
Campo
Contenido
Número de CU
CU20
Nombre
Dar de baja consultorio
Versión


Autores


Objetivos asociados
Inactivar consultorios que ya no estén disponibles.
Requisitos asociados
Validar que no estén asignados en agendas activas.
Actor principal
Administrativo
Descripción
El actor cambia el estado del consultorio a inactivo.
Precondiciones
El consultorio debe estar registrado y sin uso activo.
Postcondiciones
El consultorio queda inactivo en el sistema.
Secuencia normal
Paso 1 – El actor accede al módulo de consultorios.


Paso 2 – Selecciona el consultorio.


Paso 3 – El sistema verifica que no esté asignado en agendas activas.


Paso 4 – Cambia el estado a inactivo.
Flujo alternativo
Paso A1 – El actor deja una nota justificando la baja.
Excepciones
Paso E1 – Consultorio con agenda activa.
Validaciones
El sistema debe verificar estado en D3 y uso en D5.
Importancia
Alta
Urgencia
Alta
Comentarios
Este CU permite mantener la integridad de la infraestructura disponible.


🧾 CU21 – Registrar configuración
Campo
Contenido
Número de CU
CU21
Nombre
Registrar configuración
Versión


Autores


Objetivos asociados
Definir parámetros iniciales del sistema.
Requisitos asociados
Validar valores, rangos y dependencias.
Actor principal
Administrativo
Descripción
El actor registra una nueva configuración en el sistema.
Precondiciones
No debe existir una configuración previa para el parámetro.
Postcondiciones
La configuración queda registrada y activa.
Secuencia normal
Paso 1 – El actor accede al módulo de configuración.


Paso 2 – Ingresa el parámetro y su valor.


Paso 3 – El sistema verifica que no esté registrado previamente.


Paso 4 – El sistema guarda la configuración.
Flujo alternativo
Paso A1 – El actor adjunta documentación técnica.
Excepciones
Paso E1 – Parámetro duplicado.
Validaciones
El sistema debe verificar unicidad en D8.
Importancia
Alta
Urgencia
Alta
Comentarios
Este CU permite establecer reglas operativas del sistema.


🧾 CU22 – Consultar configuración
Campo
Contenido
Número de CU
CU22
Nombre
Consultar configuración
Versión


Autores


Objetivos asociados
Acceder a los parámetros registrados en el sistema.
Requisitos asociados
Permitir búsqueda por nombre, categoría o estado.
Actor principal
Administrativo
Descripción
El actor accede a la información de una configuración registrada.
Precondiciones
Debe existir al menos una configuración registrada.
Postcondiciones
Se muestra el detalle del parámetro.
Secuencia normal
Paso 1 – El actor accede al módulo de configuración.


Paso 2 – Ingresa criterios de búsqueda.


Paso 3 – El sistema verifica que el parámetro esté registrado.


Paso 4 – El sistema muestra el detalle.
Flujo alternativo
Paso A1 – El actor exporta la configuración.
Excepciones
Paso E1 – Parámetro no encontrado.
Validaciones
El sistema debe consultar existencia en D8.
Importancia
Alta
Urgencia
Media
Comentarios
Este CU permite revisar y auditar parámetros del sistema.


🧾 CU23 – Modificar configuración
Campo
Contenido
Número de CU
CU23
Nombre
Modificar configuración
Versión


Autores


Objetivos asociados
Actualizar valores de parámetros registrados.
Requisitos asociados
Validar existencia y consistencia de cambios.
Actor principal
Administrativo
Descripción
El actor modifica una configuración previamente registrada.
Precondiciones
Debe existir el parámetro registrado.
Postcondiciones
Se actualiza el valor del parámetro.
Secuencia normal
Paso 1 – El actor accede al módulo de configuración.


Paso 2 – Selecciona el parámetro a modificar.


Paso 3 – Realiza las modificaciones necesarias.


Paso 4 – El sistema guarda los cambios.
Flujo alternativo
Paso A1 – El actor deja una nota justificando la modificación.
Excepciones
Paso E1 – Parámetro no encontrado.
Validaciones
El sistema debe verificar existencia en D8.
Importancia
Alta
Urgencia
Media
Comentarios
Este CU permite mantener actualizada la lógica operativa del sistema.


🧾 CU24 – Registrar evolución clínica
Campo
Contenido
Número de CU
CU24
Nombre
Registrar evolución clínica
Versión


Autores


Objetivos asociados
Documentar el seguimiento clínico del paciente.
Requisitos asociados
Validar atención previa y profesional activo.
Actor principal
Profesional médico
Descripción
El actor registra una evolución clínica posterior a una atención médica.
Precondiciones
Debe existir una atención médica registrada.
Postcondiciones
Se guarda la evolución clínica en el historial del paciente.
Secuencia normal
Paso 1 – El actor accede al módulo de evolución clínica.


Paso 2 – Selecciona la atención médica previa.


Paso 3 – Ingresa evolución, observaciones y recomendaciones.


Paso 4 – El sistema guarda el registro.
Flujo alternativo
Paso A1 – El actor adjunta estudios complementarios.
Excepciones
Paso E1 – Atención médica no encontrada.
Validaciones
El sistema debe verificar existencia en D6.
Importancia
Alta
Urgencia
Alta
Comentarios
Este CU permite dar continuidad clínica al tratamiento del paciente.


🧾 CU25 – Consultar evolución por profesional
Campo
Contenido
Número de CU
CU25
Nombre
Consultar evolución por profesional
Versión


Autores


Objetivos asociados
Acceder a los registros clínicos realizados por un profesional.
Requisitos asociados
Permitir filtros por fecha, paciente y diagnóstico.
Actor principal
Profesional médico
Descripción
El actor accede a las evoluciones clínicas que ha registrado.
Precondiciones
Deben existir evoluciones clínicas registradas por el profesional.
Postcondiciones
Se muestra el historial de evoluciones por profesional.
Secuencia normal
Paso 1 – El actor accede al módulo de evolución clínica.


Paso 2 – Selecciona su perfil profesional.


Paso 3 – Ingresa criterios de búsqueda.


Paso 4 – El sistema muestra las evoluciones registradas.
Flujo alternativo
Paso A1 – El actor exporta el historial.
Excepciones
Paso E1 – Profesional sin evoluciones registradas.
Validaciones
El sistema debe consultar existencia en D6.
Importancia
Alta
Urgencia
Media
Comentarios
Este CU permite evaluar el desempeño clínico y seguimiento por profesional.


🧾 CU26 – Consultar evolución por paciente
Campo
Contenido
Número de CU
CU26
Nombre
Consultar evolución por paciente
Versión


Autores


Objetivos asociados
Acceder al historial clínico de un paciente específico.
Requisitos asociados
Permitir filtros por fecha, profesional y diagnóstico.
Actor principal
Profesional médico
Descripción
El actor accede a las evoluciones clínicas registradas para un paciente.
Precondiciones
Deben existir evoluciones clínicas registradas para el paciente.
Postcondiciones
Se muestra el historial de evolución clínica del paciente.
Secuencia normal
Paso 1 – El actor accede al módulo de evolución clínica.


Paso 2 – Selecciona el paciente.


Paso 3 – Ingresa criterios de búsqueda.


Paso 4 – El sistema muestra las evoluciones registradas.
Flujo alternativo
Paso A1 – El actor exporta el historial.
Excepciones
Paso E1 – Paciente sin evoluciones registradas.
Validaciones
El sistema debe consultar existencia en D6.
Importancia
Alta
Urgencia
Media
Comentarios
Este CU permite el seguimiento clínico longitudinal del paciente.


🧾 CU27 – Registrar honorarios por atención
Campo
Contenido
Número de CU
CU27
Nombre
Registrar honorarios por atención
Versión


Autores


Objetivos asociados
Asociar un valor económico a cada atención médica registrada.
Requisitos asociados
Validar existencia de atención y profesional activo.
Actor principal
Administrativo
Descripción
El actor registra el monto correspondiente a una atención médica.
Precondiciones
Debe existir una atención médica registrada.
Postcondiciones
El honorario queda vinculado a la atención en el sistema.
Secuencia normal
Paso 1 – El actor accede al módulo de honorarios.


Paso 2 – Selecciona la atención médica.


Paso 3 – Ingresa el monto correspondiente.


Paso 4 – El sistema guarda el registro.
Flujo alternativo
Paso A1 – El actor adjunta comprobante o nota interna.
Excepciones
Paso E1 – Atención médica no encontrada.
Validaciones
El sistema debe verificar existencia en D6.
Importancia
Alta
Urgencia
Alta
Comentarios
Este CU permite consolidar la trazabilidad económica de cada prestación.


🧾 CU28 – Consultar honorarios por profesional
Campo
Contenido
Número de CU
CU28
Nombre
Consultar honorarios por profesional
Versión


Autores


Objetivos asociados
Acceder al detalle de honorarios acumulados por profesional.
Requisitos asociados
Permitir filtros por fecha, tipo de atención y estado de liquidación.
Actor principal
Administrativo
Descripción
El actor accede al resumen de honorarios registrados por profesional.
Precondiciones
Deben existir honorarios registrados.
Postcondiciones
Se muestra el detalle por profesional.
Secuencia normal
Paso 1 – El actor accede al módulo de honorarios.


Paso 2 – Selecciona el profesional.


Paso 3 – Ingresa criterios de búsqueda.


Paso 4 – El sistema muestra el resumen de honorarios.
Flujo alternativo
Paso A1 – El actor exporta el resumen.
Excepciones
Paso E1 – Profesional sin honorarios registrados.
Validaciones
El sistema debe consultar existencia en D9.
Importancia
Alta
Urgencia
Media
Comentarios
Este CU permite controlar el desempeño económico por profesional.


🧾 CU29 – Liquidar honorarios
Campo
Contenido
Número de CU
CU29
Nombre
Liquidar honorarios
Versión


Autores


Objetivos asociados
Generar el pago correspondiente a los honorarios acumulados.
Requisitos asociados
Validar estado de liquidación y datos bancarios.
Actor principal
Administrativo
Descripción
El actor realiza la liquidación de honorarios para un profesional.
Precondiciones
Deben existir honorarios pendientes de liquidación.
Postcondiciones
Se genera el comprobante de liquidación.
Secuencia normal
Paso 1 – El actor accede al módulo de liquidación.


Paso 2 – Selecciona el profesional.


Paso 3 – El sistema muestra los honorarios pendientes.


Paso 4 – El actor confirma la liquidación.


Paso 5 – El sistema genera el comprobante.
Flujo alternativo
Paso A1 – El actor adjunta nota interna o comprobante externo.
Excepciones
Paso E1 – Profesional sin honorarios pendientes.
Validaciones
El sistema debe verificar estado en D9.
Importancia
Alta
Urgencia
Alta
Comentarios
Este CU permite cerrar el ciclo económico de las prestaciones médicas.

🧾 CU30 – Registrar usuario
Campo
Contenido
Número de CU
CU30
Nombre
Registrar usuario
Versión


Autores


Objetivos asociados
Incorporar nuevos usuarios al sistema.
Requisitos asociados
Validar rol, credenciales y datos personales.
Actor principal
Administrativo
Descripción
El actor registra un nuevo usuario con acceso al sistema.
Precondiciones
El usuario no debe estar previamente registrado.
Postcondiciones
El usuario queda registrado y activo.
Secuencia normal
Paso 1 – El actor accede al módulo de usuarios.


Paso 2 – Ingresa los datos personales y rol del usuario.


Paso 3 – El sistema verifica que no esté registrado previamente.


Paso 4 – El sistema guarda el registro y activa al usuario.
Flujo alternativo
Paso A1 – El actor adjunta documentación de respaldo.
Excepciones
Paso E1 – Usuario duplicado.
Validaciones
El sistema debe verificar unicidad en D7.
Importancia
Alta
Urgencia
Alta
Comentarios
Este CU permite gestionar el acceso al sistema por parte del personal.


🧾 CU31 – Modificar usuario
Campo
Contenido
Número de CU
CU31
Nombre
Modificar usuario
Versión


Autores


Objetivos asociados
Actualizar datos o rol de un usuario registrado.
Requisitos asociados
Validar existencia y registrar cambios.
Actor principal
Administrativo
Descripción
El actor modifica los datos de un usuario registrado.
Precondiciones
El usuario debe estar registrado.
Postcondiciones
Se actualiza la ficha del usuario.
Secuencia normal
Paso 1 – El actor accede al módulo de usuarios.


Paso 2 – Selecciona el usuario.


Paso 3 – Realiza las modificaciones necesarias.


Paso 4 – El sistema guarda los cambios.
Flujo alternativo
Paso A1 – El actor deja una nota justificando la modificación.
Excepciones
Paso E1 – Usuario no encontrado.
Validaciones
El sistema debe verificar existencia en D7.
Importancia
Alta
Urgencia
Media
Comentarios
Este CU permite mantener actualizada la gestión de accesos.


🧾 CU32 – Dar de baja usuario
Campo
Contenido
Número de CU
CU32
Nombre
Dar de baja usuario
Versión


Autores


Objetivos asociados
Inactivar usuarios que ya no requieren acceso al sistema.
Requisitos asociados
Validar que no tengan procesos activos.
Actor principal
Administrativo
Descripción
El actor cambia el estado del usuario a inactivo.
Precondiciones
El usuario debe estar registrado y sin procesos activos.
Postcondiciones
El usuario queda inactivo en el sistema.
Secuencia normal
Paso 1 – El actor accede al módulo de usuarios.


Paso 2 – Selecciona el usuario.


Paso 3 – El sistema verifica que no tenga procesos activos.


Paso 4 – Cambia el estado a inactivo.
Flujo alternativo
Paso A1 – El actor deja una nota justificando la baja.
Excepciones
Paso E1 – Usuario con procesos activos.
Validaciones
El sistema debe verificar estado en D7 y procesos en curso.
Importancia
Alta
Urgencia
Alta
Comentarios
Este CU garantiza la seguridad operativa y el cierre administrativo.


🧾 CU33 – Consultar usuario
Campo
Contenido
Número de CU
CU33
Nombre
Consultar usuario
Versión


Autores


Objetivos asociados
Acceder a la ficha de usuarios registrados.
Requisitos asociados
Permitir búsqueda por nombre, rol o estado.
Actor principal
Administrativo
Descripción
El actor accede a la información de un usuario registrado.
Precondiciones
El usuario debe estar registrado.
Postcondiciones
Se muestra la ficha del usuario.
Secuencia normal
Paso 1 – El actor accede al módulo de usuarios.


Paso 2 – Ingresa criterios de búsqueda.


Paso 3 – El sistema verifica que el usuario esté registrado.


Paso 4 – El sistema muestra la ficha del usuario.
Flujo alternativo
Paso A1 – El actor exporta la ficha.
Excepciones
Paso E1 – Usuario no encontrado.
Validaciones
El sistema debe consultar existencia en D7.
Importancia
Alta
Urgencia
Media
Comentarios
Este CU permite gestionar el acceso y roles del personal.

