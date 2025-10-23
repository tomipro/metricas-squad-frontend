# Análisis Exhaustivo de Pruebas Unitarias
## Metricas Squad Frontend

**Fecha de Análisis:** 23 de Octubre, 2025  
**Estado Actual:** Cobertura Parcial (≈30%)  
**Objetivo de Cobertura:** 80-85%

---

## 📊 Resumen Ejecutivo

### Estado Actual de las Pruebas

| Categoría | Con Tests | Sin Tests | Cobertura Estimada |
|-----------|-----------|-----------|-------------------|
| **Componentes** | 2/15 | 13/15 | ~13% |
| **Hooks** | 2/7 | 5/7 | ~29% |
| **Servicios** | 1/5 | 4/5 | ~20% |
| **Contextos** | 0/1 | 1/1 | 0% |
| **Integraciones** | 2 | N/A | Parcial |
| **TOTAL** | **7** | **23** | **≈23%** |

### Métricas Clave
- ✅ **Tests Implementados:** ~50+ casos de prueba
- ❌ **Tests Faltantes:** Estimado ~150+ casos necesarios
- 📈 **Funcionalidades Cubiertas:** ExecutiveSummary, Operations
- 📉 **Funcionalidades Sin Cobertura:** Auth, Analytics, Fleet, Search, Summary, Common components

---

## 🎯 Análisis Detallado por Categoría

## 1. COMPONENTES

### ✅ Componentes CON Tests

#### 1.1 ExecutiveSummary (Cobertura: ~85%)
**Archivo:** `src/__tests__/components/ExecutiveSummary.test.tsx`

**Tests Implementados:**
- ✅ Renderizado de estados de carga (skeletons)
- ✅ Manejo de errores de API
- ✅ Renderizado exitoso con datos
- ✅ Manejo de datos vacíos
- ✅ Cambios de período (7, 30, 90, 180, 365 días)
- ✅ Transformación de datos de API a UI
- ✅ Características de accesibilidad
- ✅ Validación de métricas financieras

**Funcionalidad Cubierta:**
```typescript
- Embudo de conversión (Búsqueda → Pago)
- Tarifa promedio de reservas
- Ingresos mensuales
- Ingresos por usuario
- Tasa de éxito de pagos
- Anticipación de reservas
```

**Cobertura:** Excelente (15+ casos de prueba)

---

#### 1.2 Operations (Cobertura: ~80%)
**Archivo:** `src/__tests__/components/Operations.test.tsx`

**Tests Implementados:**
- ✅ Estados de carga
- ✅ Métricas operacionales
- ✅ Datos de aerolíneas populares
- ✅ Manejo de estados vacíos
- ✅ Manejo de errores parciales
- ✅ Transformación de datos

**Funcionalidad Cubierta:**
```typescript
- Conversión Búsqueda → Reserva
- Tasa de éxito de pagos
- Tasa de cancelación
- Aerolíneas populares
- Distribución de reservas
```

**Cobertura:** Muy buena (10+ casos de prueba)

---

### ❌ Componentes SIN Tests (CRÍTICO)

#### 1.3 Analytics (Prioridad: ALTA) 🔴
**Archivo:** `src/components/Analytics/Analytics.tsx`

**Funcionalidad Actual:**
```typescript
- Horas de reserva (distribución por hora UTC)
- Orígenes de usuarios (por país)
- Tasa de éxito de pagos
- Anticipación de reservas
- 4 gráficos principales
- 2 tablas de datos
```

**Tests Necesarios:**
- [ ] Renderizado de estados de carga
- [ ] Manejo de errores de API
- [ ] Renderizado exitoso con datos de horas de reserva
- [ ] Renderizado exitoso con datos de orígenes de usuarios
- [ ] Transformación correcta de datos de API
- [ ] Validación de formato de horas (formato 24h)
- [ ] Validación de países en tabla de orígenes
- [ ] Gráficos de línea/barra renderizados correctamente
- [ ] Datos vacíos manejados correctamente
- [ ] Cambios de período actualizan datos
- [ ] Formato de números y porcentajes
- [ ] Accesibilidad (ARIA labels, headings)

**Casos de Prueba Estimados:** 15-18

---

#### 1.4 FleetManagement (Prioridad: ALTA) 🔴
**Archivo:** `src/components/FleetManagement/FleetManagement.tsx`

**Funcionalidad Actual:**
```typescript
- Total de aerolíneas
- Total de vuelos
- Ingresos totales por aerolínea
- Aerolínea principal
- Top aerolíneas por ingresos
- Distribución de tipos de aeronaves
- Tabla de aerolíneas con detalles
```

**Tests Necesarios:**
- [ ] Renderizado de métricas de flota
- [ ] Cálculo correcto de totales (aerolíneas, vuelos, ingresos)
- [ ] Identificación correcta de aerolínea principal
- [ ] Gráfico de aerolíneas por ingresos
- [ ] Gráfico pie de tipos de aeronaves
- [ ] Tabla de aerolíneas con todas las columnas
- [ ] Formato de monedas (USD con separadores)
- [ ] Manejo de múltiples monedas
- [ ] Estados de carga de 3 queries simultáneas
- [ ] Errores parciales (una query falla, otras exitosas)
- [ ] Datos vacíos (sin aerolíneas)
- [ ] Ordenamiento de tabla
- [ ] Cambios de período

**Casos de Prueba Estimados:** 18-20

---

#### 1.5 SearchAnalytics (Prioridad: ALTA) 🔴
**Archivo:** `src/components/SearchAnalytics/SearchAnalytics.tsx`

**Funcionalidad Actual:**
```typescript
- Total de búsquedas
- Promedio de resultados por búsqueda
- Tasa de conversión de búsquedas
- Destinos más buscados
- Gráfico de top destinos buscados
- Gráfico de ítems agregados al carrito
- Tabla de métricas de búsqueda
- Tabla de resumen de carrito
```

**Tests Necesarios:**
- [ ] Renderizado de métricas de búsqueda
- [ ] Cálculo de promedio de resultados
- [ ] Cálculo de tasa de conversión
- [ ] Identificación de destinos más buscados
- [ ] Gráfico de barra de destinos
- [ ] Gráfico de línea de ítems en carrito
- [ ] Tabla con métricas de búsqueda detalladas
- [ ] Tabla con datos del carrito
- [ ] Formato de porcentajes de conversión
- [ ] Estados de carga de 2 queries
- [ ] Errores en búsqueda o carrito
- [ ] Datos vacíos
- [ ] Cambios de período (default 14 días)

**Casos de Prueba Estimados:** 16-18

---

#### 1.6 Summary (Prioridad: MEDIA) 🟡
**Archivo:** `src/components/Summary/Summary.tsx`

**Funcionalidad Actual:**
```typescript
- Total de eventos del sistema
- Total de reservas
- Ingresos totales
- Tasa de validación
- Gráfico de actividad reciente
- Tabla de eventos recientes
- No depende de período (datos globales)
```

**Tests Necesarios:**
- [ ] Renderizado de métricas del resumen
- [ ] Cálculo de métricas totales
- [ ] Formato de ingresos totales
- [ ] Porcentaje de validación
- [ ] Gráfico de área de actividad reciente
- [ ] Tabla de eventos recientes (últimas 24 horas)
- [ ] Formato de tipos de eventos (capitalización)
- [ ] Estados de carga
- [ ] Manejo de errores
- [ ] Datos vacíos
- [ ] Actualización automática (refetch interval)

**Casos de Prueba Estimados:** 12-14

---

#### 1.7 Dashboard (Prioridad: ALTA) 🔴
**Archivo:** `src/components/Dashboard.tsx`

**Funcionalidad Actual:**
```typescript
- Navegación entre tabs (6 tabs)
- Header con información de usuario
- Botón de logout
- Selector de período
- Renderizado condicional de componentes hijos
```

**Tests Necesarios:**
- [ ] Renderizado inicial con tab por defecto
- [ ] Cambio entre tabs funciona correctamente
- [ ] Cada tab renderiza el componente correcto
- [ ] Header muestra nombre de usuario correcto
- [ ] Botón de logout llama a función de logout
- [ ] Selector de período pasa valor correcto a tabs
- [ ] Usuario no autenticado es redirigido
- [ ] Datos de usuario se obtienen del contexto
- [ ] Navegación entre todos los tabs (6 tabs)
- [ ] Responsividad del layout

**Casos de Prueba Estimados:** 12-15

---

#### 1.8 Login (Prioridad: CRÍTICA) 🔴
**Archivo:** `src/components/Auth/Login.tsx`

**Funcionalidad Actual:**
```typescript
- Formulario con email y contraseña
- Validación de campos (email válido, contraseña min 6 chars)
- Manejo de errores de login
- Estados de carga
- Redirección después de login exitoso
- Link a "Olvidaste tu contraseña"
```

**Tests Necesarios:**
- [ ] Renderizado inicial del formulario
- [ ] Campos de email y contraseña presentes
- [ ] Validación de email vacío
- [ ] Validación de email inválido
- [ ] Validación de contraseña vacía
- [ ] Validación de contraseña corta (< 6 chars)
- [ ] Envío de formulario con datos válidos
- [ ] Login exitoso llama a función login()
- [ ] Login exitoso redirige a /dashboard
- [ ] Login fallido muestra mensaje de error
- [ ] Login fallido muestra error de credenciales
- [ ] Estado de carga deshabilita botones
- [ ] Estado de carga muestra spinner
- [ ] Botón "Olvidaste contraseña" funciona
- [ ] Limpieza de errores al cambiar campos
- [ ] Integración con AuthContext

**Casos de Prueba Estimados:** 18-20

---

#### 1.9 ForgotPassword (Prioridad: MEDIA) 🟡
**Archivo:** `src/components/Auth/ForgotPassword.tsx`

**Tests Necesarios:**
- [ ] Renderizado del formulario
- [ ] Validación de email
- [ ] Envío de solicitud de recuperación
- [ ] Mensaje de éxito
- [ ] Manejo de errores
- [ ] Botón "Volver al login"
- [ ] Estados de carga

**Casos de Prueba Estimados:** 10-12

---

#### 1.10 ProtectedRoute (Prioridad: CRÍTICA) 🔴
**Archivo:** `src/components/ProtectedRoute.tsx`

**Funcionalidad Actual:**
```typescript
- Verificación de autenticación
- Verificación de rol admin
- Estados de carga durante verificación
- Redirección a /login si no autenticado
- Mensaje de acceso denegado si no es admin
- Renderizado de children si todo OK
```

**Tests Necesarios:**
- [ ] Muestra loading mientras verifica autenticación
- [ ] Usuario no autenticado redirige a /login
- [ ] Usuario autenticado pero no admin muestra mensaje denegado
- [ ] Usuario autenticado y admin renderiza children
- [ ] Verificación case-insensitive del rol ('admin', 'Admin', 'ADMIN')
- [ ] Botón "Volver a login" funciona en página de denegado
- [ ] Location state se preserva en redirección
- [ ] Integración con useAuth hook
- [ ] Renderizado correcto de loading spinner
- [ ] Mensaje de acceso denegado tiene diseño correcto

**Casos de Prueba Estimados:** 12-14

---

### 1.11-1.15 Componentes Comunes (Prioridad: ALTA) 🔴

#### 1.11 MetricCard
**Funcionalidad:**
```typescript
- Renderizado de título y valor
- Unidad opcional
- Cambio porcentual (positivo/negativo)
- Iconos de tendencia (↗/↘)
- Estilos condicionales (verde/rojo)
```

**Tests Necesarios:**
- [ ] Renderizado básico con título y valor
- [ ] Renderizado con unidad
- [ ] Cambio positivo muestra flecha arriba y color verde
- [ ] Cambio negativo muestra flecha abajo y color rojo
- [ ] Cambio cero o undefined no muestra indicador
- [ ] Formato correcto de números grandes
- [ ] Accesibilidad

**Casos de Prueba Estimados:** 8-10

---

#### 1.12 ChartCard
**Funcionalidad:**
```typescript
- 5 tipos de gráficos: bar, line, pie, funnel, area
- Configuración de colores
- Múltiples claves de valores (valueKey, valueKey2)
- Altura configurable
- Tooltips personalizados
- Leyendas
- Gradientes para gráficos de área
```

**Tests Necesarios:**
- [ ] Renderizado de gráfico de barras
- [ ] Renderizado de gráfico de líneas
- [ ] Renderizado de gráfico circular (pie)
- [ ] Renderizado de gráfico de embudo
- [ ] Renderizado de gráfico de área
- [ ] Configuración de altura personalizada
- [ ] Colores personalizados aplicados
- [ ] Múltiples series de datos (valueKey2)
- [ ] Datos vacíos muestran mensaje
- [ ] Tooltips funcionan correctamente
- [ ] Leyendas se muestran
- [ ] Responsive container funciona

**Casos de Prueba Estimados:** 15-18

---

#### 1.13 DataTable
**Funcionalidad:**
```typescript
- Renderizado de columnas dinámicas
- Formateo de celdas personalizado
- Soporte para números, strings, objetos
- Estilos por columna
- Headers configurables
```

**Tests Necesarios:**
- [ ] Renderizado de tabla con datos
- [ ] Headers correctos
- [ ] Formateo de celdas numéricas
- [ ] Formateo de celdas de texto
- [ ] Manejo de datos vacíos
- [ ] Manejo de columnas sin datos
- [ ] Accesibilidad de tabla

**Casos de Prueba Estimados:** 10-12

---

#### 1.14 DateFilter
**Tests Necesarios:**
- [ ] Renderizado del selector
- [ ] Opciones disponibles (7, 30, 90, 180, 365 días)
- [ ] Cambio de período llama a callback
- [ ] Valor por defecto correcto
- [ ] Accesibilidad

**Casos de Prueba Estimados:** 6-8

---

#### 1.15 TabNavigation
**Tests Necesarios:**
- [ ] Renderizado de todos los tabs
- [ ] Tab activo tiene estilo correcto
- [ ] Clic en tab llama a callback
- [ ] Selector de período integrado
- [ ] Responsividad

**Casos de Prueba Estimados:** 8-10

---

#### 1.16 Skeletons (MetricCardSkeleton, ChartCardSkeleton, DataTableSkeleton)
**Tests Necesarios:**
- [ ] Renderizado de skeleton de métrica
- [ ] Renderizado de skeleton de gráfico
- [ ] Renderizado de skeleton de tabla
- [ ] Animación de carga presente
- [ ] Dimensiones correctas

**Casos de Prueba Estimados:** 6-8

---

## 2. HOOKS

### ✅ Hooks CON Tests

#### 2.1 useExecutiveSummary (Cobertura: ~85%)
**Archivo:** `src/__tests__/hooks/useExecutiveSummary.test.tsx`

**Tests Implementados:**
- ✅ Estado de carga inicial
- ✅ Estado exitoso con datos
- ✅ Manejo de errores
- ✅ Paso de parámetros
- ✅ Estados de carga parciales
- ✅ Estados de error parciales
- ✅ Parámetros por defecto
- ✅ Respuestas vacías

**Cobertura:** Excelente (12+ casos de prueba)

---

#### 2.2 useOperations (Cobertura: ~80%)
**Archivo:** `src/__tests__/hooks/useOperations.test.tsx`

**Tests Implementados:**
- ✅ Estado de carga
- ✅ Estado exitoso
- ✅ Manejo de errores
- ✅ Múltiples queries
- ✅ Estados parciales

**Cobertura:** Muy buena (10+ casos de prueba)

---

### ❌ Hooks SIN Tests (CRÍTICO)

#### 2.3 useAnalytics (Prioridad: ALTA) 🔴
**Archivo:** `src/hooks/useAnalytics.ts`

**Funcionalidad:**
```typescript
- Compone 4 queries:
  - bookingHours
  - userOrigins
  - paymentSuccess
  - anticipation
- Agrega estados isLoading e isError
```

**Tests Necesarios:**
- [ ] Retorna estado de carga cuando queries están cargando
- [ ] Retorna datos cuando todas las queries tienen éxito
- [ ] Retorna error si alguna query falla
- [ ] Pasa parámetro `days` correctamente
- [ ] Estados parciales de carga
- [ ] Estados parciales de error
- [ ] Validación de estructura de datos retornados
- [ ] Múltiples llamadas con diferentes días

**Casos de Prueba Estimados:** 10-12

---

#### 2.4 Hooks Individuales de Analytics (Prioridad: MEDIA) 🟡

**Hooks sin tests:**
```typescript
- useHealthStatus
- useFunnelData ✅ (parcialmente testeado en executiveSummary)
- useAverageFare ✅ (parcialmente testeado en executiveSummary)
- useMonthlyRevenue
- useLifetimeValue
- useRevenuePerUser
- usePopularAirlines
- useUserOrigins
- useBookingHours
- usePaymentSuccessRate
- useCancellationRate
- useAnticipation
- useTimeToComplete
- useSummary
- useRecentActivity
- useSearchMetrics
- useCatalogAirlineSummary
- useSearchCartSummary
- useFlightsAircraft
```

**Tests Necesarios por Hook:**
- [ ] Configuración correcta de queryKey
- [ ] Llamada correcta a función de servicio
- [ ] Paso de parámetros
- [ ] Configuración de staleTime
- [ ] Configuración de refetchInterval (donde aplique)
- [ ] Manejo de errores
- [ ] Transformación de datos (si aplica)

**Casos de Prueba Estimados:** 5-6 por hook = 90-108 tests

---

#### 2.5 useIngest Hooks (Prioridad: MEDIA) 🟡
**Archivo:** `src/hooks/useIngest.ts`

**Funcionalidad:**
```typescript
- useIngestEvent (genérico)
- useIngestSearch
- useIngestReservation
- useIngestPayment
- useIngestCancellation
- useUserJourneyTracking (composed)
```

**Tests Necesarios:**
- [ ] useIngestEvent envía evento correctamente
- [ ] useIngestEvent invalida queries después de éxito
- [ ] useIngestEvent maneja errores
- [ ] useIngestSearch estructura datos correctamente
- [ ] useIngestSearch retorna funciones correctas
- [ ] useIngestReservation funciona correctamente
- [ ] useIngestPayment funciona correctamente
- [ ] useIngestCancellation funciona correctamente
- [ ] useUserJourneyTracking compone todos los hooks
- [ ] Todos los hooks invalidan cache correctamente
- [ ] Estados de carga se manejan correctamente
- [ ] Errores se registran en console

**Casos de Prueba Estimados:** 18-20

---

#### 2.6 useTokenValidation (Prioridad: CRÍTICA) 🔴
**Archivo:** `src/hooks/useTokenValidation.ts`

**Funcionalidad:**
```typescript
- Validación periódica de token JWT
- Logout automático si token expirado
- Intervalo configurable (default 5 min)
- Puede deshabilitarse con enabled:false
```

**Tests Necesarios:**
- [ ] Ejecuta validación inicial al montar
- [ ] No ejecuta si enabled=false
- [ ] Valida token periódicamente según intervalo
- [ ] Llama a logoutAndRedirect si token inválido
- [ ] Llama a logoutAndRedirect si token expirado
- [ ] Llama a logoutAndRedirect si no hay token
- [ ] Limpia interval al desmontar
- [ ] Cambia intervalo si prop cambia
- [ ] No redirige si token es válido

**Casos de Prueba Estimados:** 10-12

---

## 3. SERVICIOS

### ✅ Servicios CON Tests

#### 3.1 analyticsService (Cobertura: ~40%)
**Archivo:** `src/__tests__/services/analyticsService.test.ts`

**Tests Implementados:**
- ✅ Llamadas a API con parámetros correctos
- ✅ Manejo de parámetros por defecto
- ✅ Manejo de errores
- ✅ Validación de datos
- ✅ Errores de red
- ✅ Validación de parámetros

**Cobertura:** Parcial (18 casos, pero solo para algunas funciones)

**Tests Faltantes:**
- [ ] Tests para las 15+ funciones restantes
- [ ] Validación de tipos de respuesta
- [ ] Tests de timeout
- [ ] Tests de retry logic
- [ ] Mock de axios más completo

**Casos de Prueba Adicionales Necesarios:** 30-35

---

### ❌ Servicios SIN Tests (CRÍTICO)

#### 3.2 authService (Prioridad: CRÍTICA) 🔴
**Archivo:** `src/services/authService.ts`

**Funcionalidad:**
```typescript
Funciones:
- login(credentials)
- logout()
- logoutAndRedirect()
- getToken()
- getUserData()
- isAuthenticated()
- isValidToken(token)
- isTokenExpired(token)
- getAuthHeaders()
- forgotPassword(email)

Interfaces:
- LoginRequest, LoginResponse, AuthError
- ForgotPasswordRequest, ForgotPasswordResponse
```

**Tests Necesarios:**

**login():**
- [ ] Login exitoso guarda token en localStorage
- [ ] Login exitoso guarda userData en localStorage
- [ ] Login exitoso retorna LoginResponse con estructura correcta
- [ ] Login con credenciales inválidas lanza AuthError
- [ ] Error de red lanza AuthError con mensaje apropiado
- [ ] Error 404 lanza AuthError
- [ ] Error 500 lanza AuthError
- [ ] Timeout lanza AuthError
- [ ] Transforma datos de API a formato interno correctamente
- [ ] Valida response.success=true antes de guardar
- [ ] Maneja response.success=false

**logout():**
- [ ] Remueve auth_token de localStorage
- [ ] Remueve user_data de localStorage
- [ ] No lanza error si no hay datos

**logoutAndRedirect():**
- [ ] Llama a logout()
- [ ] Redirige a /login
- [ ] No redirige si ya está en /login

**getToken():**
- [ ] Retorna token si existe
- [ ] Retorna null si no existe

**getUserData():**
- [ ] Retorna datos de usuario transformados
- [ ] Transforma formato API (rol, nombre_completo) a interno (role, name)
- [ ] Retorna null si no hay datos
- [ ] Maneja JSON inválido sin crashear
- [ ] Retorna datos ya en formato interno sin transformar

**isAuthenticated():**
- [ ] Retorna true si hay token válido
- [ ] Retorna false si no hay token
- [ ] Retorna false si token está expirado
- [ ] Llama a logout() si token expirado

**isValidToken():**
- [ ] Retorna true para token JWT válido
- [ ] Retorna false para token sin 3 partes
- [ ] Retorna false para string vacío

**isTokenExpired():**
- [ ] Retorna false para token válido no expirado
- [ ] Retorna true para token expirado
- [ ] Retorna true para token sin exp claim
- [ ] Retorna true para token con formato inválido
- [ ] Retorna true para token mal formado

**getAuthHeaders():**
- [ ] Retorna headers con Bearer token si token existe
- [ ] Retorna headers vacíos si no hay token

**forgotPassword():**
- [ ] Envía solicitud correctamente
- [ ] Retorna respuesta de éxito
- [ ] Maneja error de email no encontrado
- [ ] Maneja errores de red
- [ ] Maneja timeout

**Casos de Prueba Estimados:** 40-45

---

#### 3.3 ingestService (Prioridad: MEDIA) 🟡
**Archivo:** `src/services/ingestService.ts`

**Funcionalidad:**
```typescript
Funciones:
- ingestEvent(event)
- ingestSearchEvent(params)
- ingestReservationEvent(params)
- ingestPaymentEvent(params)
- ingestCancellationEvent(params)

Tipos de eventos:
- SearchEvent
- ReservationEvent
- PaymentEvent
- CancellationEvent
```

**Tests Necesarios:**

**ingestEvent():**
- [ ] Envía evento genérico correctamente
- [ ] Usa endpoint correcto
- [ ] Incluye headers correctos
- [ ] Maneja respuesta exitosa
- [ ] Maneja errores de API

**ingestSearchEvent():**
- [ ] Estructura evento con type 'busqueda_realizada'
- [ ] Incluye timestamp automático
- [ ] Incluye todos los campos requeridos
- [ ] Valida parámetros
- [ ] Maneja errores

**ingestReservationEvent():**
- [ ] Estructura evento con type 'reserva_creada'
- [ ] Incluye todos los campos de reserva
- [ ] Maneja errores

**ingestPaymentEvent():**
- [ ] Estructura evento con type 'pago_aprobado'
- [ ] Incluye campos de pago
- [ ] Maneja errores

**ingestCancellationEvent():**
- [ ] Estructura evento con type 'reserva_cancelada'
- [ ] Incluye motivo de cancelación
- [ ] Maneja errores

**Casos de Prueba Estimados:** 20-25

---

#### 3.4 axiosConfig (Prioridad: MEDIA) 🟡
**Archivo:** `src/services/axiosConfig.ts`

**Funcionalidad:**
```typescript
- Configuración de axios para analytics API
- Configuración de axios para ingest API
- Interceptores de request (añade token)
- Interceptores de response (maneja errors 401)
- Función apiRequest genérica
```

**Tests Necesarios:**
- [ ] analyticsApi tiene baseURL correcta
- [ ] ingestApi tiene baseURL correcta
- [ ] Request interceptor añade token si existe
- [ ] Request interceptor no añade token si no existe
- [ ] Request interceptor valida token no expirado
- [ ] Response interceptor maneja 401
- [ ] Response interceptor llama a logoutAndRedirect en 401
- [ ] Response interceptor pasa otras respuestas sin cambios
- [ ] apiRequest hace llamada correcta
- [ ] apiRequest maneja errores correctamente

**Casos de Prueba Estimados:** 12-15

---

## 4. CONTEXTOS

### ❌ Contextos SIN Tests (CRÍTICO)

#### 4.1 AuthContext (Prioridad: CRÍTICA) 🔴
**Archivo:** `src/contexts/AuthContext.tsx`

**Funcionalidad:**
```typescript
- AuthProvider component
- useAuth hook
- AuthGuard component
- Estados: user, isAuthenticated, isLoading, error
- Funciones: login, logout, clearError
- Integración con useTokenValidation
```

**Tests Necesarios:**

**AuthProvider:**
- [ ] Inicializa con isLoading=true
- [ ] Carga usuario de localStorage si existe
- [ ] Establece isAuthenticated=true si hay usuario
- [ ] Establece isAuthenticated=false si no hay usuario
- [ ] Termina con isLoading=false después de init

**login():**
- [ ] Establece isLoading=true durante login
- [ ] Llama a authService.login con credenciales
- [ ] Transforma respuesta de API a User interno
- [ ] Establece user en estado
- [ ] Establece isAuthenticated=true en éxito
- [ ] Establece error en estado si falla
- [ ] Lanza error para que componente lo maneje
- [ ] Establece isLoading=false al terminar

**logout():**
- [ ] Llama a authService.logout()
- [ ] Limpia user en estado
- [ ] Limpia error en estado
- [ ] Establece isAuthenticated=false

**clearError():**
- [ ] Limpia error del estado

**useAuth hook:**
- [ ] Lanza error si se usa fuera de AuthProvider
- [ ] Retorna contexto correcto dentro de Provider

**AuthGuard:**
- [ ] Muestra fallback mientras carga
- [ ] Muestra children si autenticado
- [ ] Retorna null si no autenticado
- [ ] Usa fallback personalizado si se provee

**Integración:**
- [ ] useTokenValidation está habilitado solo cuando hay usuario
- [ ] useTokenValidation recibe checkInterval correcto

**Casos de Prueba Estimados:** 20-25

---

## 5. INTEGRACIONES

### ✅ Tests de Integración Existentes

#### 5.1 ExecutiveSummary Integration (Cobertura: ~80%)
**Archivo:** `src/__tests__/integration/ExecutiveSummary.integration.test.tsx`

**Tests Implementados:**
- ✅ Flujo completo API → Hook → Component → UI
- ✅ Manejo de errores integrado
- ✅ Transformación de datos end-to-end
- ✅ Escenarios de performance
- ✅ Accesibilidad integrada

**Cobertura:** Muy buena (8 casos de prueba)

---

#### 5.2 Operations Integration (Cobertura: ~75%)
**Archivo:** `src/__tests__/integration/Operations.integration.test.tsx`

**Tests Implementados:**
- ✅ Flujo completo de datos
- ✅ Manejo de errores
- ✅ Múltiples queries
- ✅ Estados parciales

**Cobertura:** Buena (6+ casos de prueba)

---

### ❌ Tests de Integración Faltantes

#### 5.3 Auth Flow Integration (Prioridad: CRÍTICA) 🔴
**Tests Necesarios:**
- [ ] Flujo completo: Login → Dashboard
- [ ] Login fallido → Mensaje de error → Retry exitoso
- [ ] Token expira → Logout automático → Redirect a login
- [ ] Usuario no admin → Acceso denegado → Volver a login
- [ ] Refresh de página mantiene sesión si token válido
- [ ] Refresh de página logout si token expirado
- [ ] Forgot password → Envío email → Mensaje confirmación
- [ ] Protected route sin auth → Redirect → Login → Redirect back

**Casos de Prueba Estimados:** 12-15

---

#### 5.4 Dashboard Navigation Integration (Prioridad: ALTA) 🔴
**Tests Necesarios:**
- [ ] Navegación entre todos los tabs funciona
- [ ] Datos se cargan al cambiar tab
- [ ] Cambio de período actualiza datos en tab actual
- [ ] Navegación rápida entre tabs no causa errores
- [ ] Logout desde cualquier tab funciona
- [ ] Deep links a tabs funcionan
- [ ] Estado de tab se mantiene en navegación

**Casos de Prueba Estimados:** 10-12

---

#### 5.5 Data Flow Integration (Prioridad: MEDIA) 🟡
**Tests Necesarios:**
- [ ] Ingest event → Invalidate cache → Refetch → UI actualizado
- [ ] Multiple simultaneous queries
- [ ] Error en una query no afecta otras
- [ ] Network offline → Retry → Recovery
- [ ] Stale data handling

**Casos de Prueba Estimados:** 8-10

---

## 6. TESTS END-TO-END

### ❌ Tests E2E Faltantes (Recomendado, no crítico)

**Herramientas Sugeridas:** Cypress o Playwright

**Escenarios:**
- [ ] Usuario completo desde login hasta logout
- [ ] Navegación completa del dashboard
- [ ] Flujo de cambio de período en múltiples tabs
- [ ] Manejo de sesión expirada
- [ ] Responsive design en diferentes viewports
- [ ] Performance en carga de datos grandes

**Casos de Prueba Estimados:** 15-20

---

## 📈 PRIORIZACIÓN Y ROADMAP

### Fase 1: CRÍTICO (2-3 semanas)
**Impacto: Alto | Urgencia: Alta**

1. **Autenticación (Semana 1)**
   - [ ] authService tests (40-45 tests)
   - [ ] AuthContext tests (20-25 tests)
   - [ ] Login component tests (18-20 tests)
   - [ ] ProtectedRoute tests (12-14 tests)
   - [ ] useTokenValidation tests (10-12 tests)
   - [ ] Auth Integration tests (12-15 tests)
   - **Total Estimado:** ~120 tests

2. **Dashboard y Componentes Principales (Semana 2)**
   - [ ] Dashboard tests (12-15 tests)
   - [ ] Analytics component tests (15-18 tests)
   - [ ] FleetManagement tests (18-20 tests)
   - [ ] SearchAnalytics tests (16-18 tests)
   - **Total Estimado:** ~70 tests

3. **Componentes Comunes (Semana 3)**
   - [ ] MetricCard tests (8-10 tests)
   - [ ] ChartCard tests (15-18 tests)
   - [ ] DataTable tests (10-12 tests)
   - [ ] DateFilter tests (6-8 tests)
   - [ ] TabNavigation tests (8-10 tests)
   - **Total Estimado:** ~55 tests

**Total Fase 1:** ~245 tests

---

### Fase 2: ALTA (1-2 semanas)
**Impacto: Alto | Urgencia: Media**

1. **Hooks de Analytics**
   - [ ] useAnalytics tests (10-12 tests)
   - [ ] Hooks individuales tests (90-108 tests)
   - **Total Estimado:** ~110 tests

2. **Servicios Complementarios**
   - [ ] analyticsService completar tests (30-35 tests)
   - [ ] axiosConfig tests (12-15 tests)
   - **Total Estimado:** ~45 tests

**Total Fase 2:** ~155 tests

---

### Fase 3: MEDIA (1 semana)
**Impacto: Medio | Urgencia: Media**

1. **Ingesta de Datos**
   - [ ] ingestService tests (20-25 tests)
   - [ ] useIngest hooks tests (18-20 tests)
   - **Total Estimado:** ~43 tests

2. **Componentes Secundarios**
   - [ ] Summary component tests (12-14 tests)
   - [ ] ForgotPassword tests (10-12 tests)
   - [ ] Skeleton tests (6-8 tests)
   - **Total Estimado:** ~32 tests

3. **Integraciones**
   - [ ] Dashboard Navigation Integration (10-12 tests)
   - [ ] Data Flow Integration (8-10 tests)
   - **Total Estimado:** ~20 tests

**Total Fase 3:** ~95 tests

---

### Fase 4: BAJA (Opcional)
**Impacto: Bajo | Urgencia: Baja**

1. **Tests E2E**
   - [ ] Cypress/Playwright setup
   - [ ] 15-20 escenarios E2E
   - **Total Estimado:** ~20 tests

**Total Fase 4:** ~20 tests

---

## 🎯 RESUMEN DE TESTS NECESARIOS

| Fase | Categoría | Tests Estimados | Tiempo Estimado |
|------|-----------|----------------|-----------------|
| **Fase 1** | Auth + Dashboard + Comunes | ~245 | 2-3 semanas |
| **Fase 2** | Hooks + Servicios | ~155 | 1-2 semanas |
| **Fase 3** | Ingest + Secundarios + Integración | ~95 | 1 semana |
| **Fase 4** | E2E (Opcional) | ~20 | 1 semana |
| **TOTAL** | | **~515 tests** | **5-7 semanas** |

---

## 📋 CONSIDERACIONES TÉCNICAS

### Setup Necesario

1. **Actualizar Jest Config**
   ```javascript
   // Añadir coverage para nuevos archivos
   collectCoverageFrom: [
     'src/components/**/*.{ts,tsx}',
     'src/hooks/**/*.{ts,tsx}',
     'src/services/**/*.{ts}',
     'src/contexts/**/*.{tsx}',
     '!src/**/*.d.ts',
     '!src/**/*.stories.tsx',
   ]
   ```

2. **Mocks Globales Necesarios**
   - [ ] Mock de react-router-dom (useNavigate, Navigate)
   - [ ] Mock de recharts
   - [ ] Mock de window.location
   - [ ] Mock de localStorage
   - [ ] Mock de axios

3. **Utilidades de Testing**
   - [ ] Crear helpers para render con AuthProvider
   - [ ] Crear helpers para render con QueryClient
   - [ ] Crear factory functions para mock data
   - [ ] Crear custom matchers si necesario

### Best Practices

1. **Estructura de Tests**
   ```
   describe('ComponentName', () => {
     describe('Rendering', () => {
       // Tests de renderizado
     });
     
     describe('User Interactions', () => {
       // Tests de interacción
     });
     
     describe('Data Handling', () => {
       // Tests de manejo de datos
     });
     
     describe('Error Handling', () => {
       // Tests de errores
     });
   });
   ```

2. **Nomenclatura**
   - Usar 'should' para describir comportamiento esperado
   - Ser específico y descriptivo
   - Incluir contexto cuando sea necesario

3. **Coverage Goals**
   - Global: 80%
   - Componentes críticos (Auth, Dashboard): 85%
   - Servicios: 80%
   - Hooks: 80%
   - Componentes comunes: 75%

---

## 🚨 GAPS CRÍTICOS IDENTIFICADOS

### 1. Seguridad y Autenticación
**Impacto: CRÍTICO**
- ❌ Sin tests de login/logout
- ❌ Sin tests de validación de token
- ❌ Sin tests de roles y permisos
- ❌ Sin tests de redirect después de logout

**Riesgo:** Vulnerabilidades de seguridad no detectadas

---

### 2. Componentes Core del Dashboard
**Impacto: ALTO**
- ❌ 4 de 6 tabs sin tests
- ❌ Navegación de dashboard sin tests
- ❌ Componentes comunes sin tests (usados en todos lados)

**Riesgo:** Bugs en funcionalidad principal

---

### 3. Manejo de Errores
**Impacto: ALTO**
- ❌ Pocos tests de error handling
- ❌ Sin tests de recuperación de errores
- ❌ Sin tests de fallback UI

**Riesgo:** Mala experiencia de usuario ante errores

---

### 4. Performance y Optimización
**Impacto: MEDIO**
- ❌ Sin tests de múltiples queries simultáneas
- ❌ Sin tests de memory leaks
- ❌ Sin tests de stale data handling

**Riesgo:** Performance degradada

---

## 💡 RECOMENDACIONES

### Inmediatas (Esta Semana)
1. ✅ Comenzar con tests de autenticación (authService + AuthContext)
2. ✅ Implementar tests de ProtectedRoute
3. ✅ Añadir tests de Login component

### Corto Plazo (Próximas 2 Semanas)
1. ✅ Tests de Dashboard y navegación
2. ✅ Tests de componentes comunes (MetricCard, ChartCard, DataTable)
3. ✅ Tests de Analytics, FleetManagement, SearchAnalytics

### Mediano Plazo (Próximas 4 Semanas)
1. ✅ Completar tests de todos los hooks
2. ✅ Tests de ingestService y useIngest
3. ✅ Tests de integración adicionales

### Largo Plazo (Próximas 6 Semanas)
1. ✅ Tests E2E con Cypress/Playwright
2. ✅ Performance testing
3. ✅ Accessibility testing automatizado

---

## 📊 MÉTRICAS DE ÉXITO

### Objetivo de Cobertura
- **Actual:** ~23%
- **Objetivo Final:** 80-85%
- **Incremento Necesario:** +57-62%

### KPIs
- [ ] 80% de cobertura de líneas
- [ ] 80% de cobertura de branches
- [ ] 80% de cobertura de funciones
- [ ] 0 tests fallidos
- [ ] < 5% de tests flaky
- [ ] Tiempo de ejecución < 2 minutos para unit tests
- [ ] Tiempo de ejecución < 5 minutos para integration tests

---

## 🏁 CONCLUSIÓN

**Estado Actual:**
- Cobertura muy limitada (~23%)
- Solo 2 de 15 componentes principales testeados
- Funcionalidades críticas de auth sin tests
- Servicios importantes sin cobertura

**Trabajo Necesario:**
- ~515 tests adicionales necesarios
- 5-7 semanas de trabajo estimado
- Priorizar autenticación y componentes core
- Mantener calidad con buenos mocks y helpers

**Beneficios Esperados:**
- ✅ Mayor confianza en despliegues
- ✅ Detección temprana de bugs
- ✅ Mejor documentación del código
- ✅ Facilita refactoring seguro
- ✅ Mejora onboarding de nuevos devs

---

**Documento generado:** 23 de Octubre, 2025  
**Próxima Revisión:** Después de completar Fase 1

