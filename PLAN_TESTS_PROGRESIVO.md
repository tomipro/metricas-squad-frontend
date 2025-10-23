# Plan Progresivo de Implementación de Tests
## Metricas Squad Frontend

---

## 🎯 FASE 1: AUTENTICACIÓN (Semanas 1-2)

### Sprint 1.1: authService Tests (Días 1-2) ✅ EN PROGRESO
**Prioridad:** CRÍTICA  
**Archivo:** `src/__tests__/services/authService.test.ts`

- [x] Setup y configuración
- [ ] Tests de login()
  - [ ] Login exitoso guarda token
  - [ ] Login exitoso guarda userData
  - [ ] Login exitoso retorna estructura correcta
  - [ ] Credenciales inválidas lanzan error
  - [ ] Error de red manejado
  - [ ] Transformación de datos API → interno
- [ ] Tests de logout()
- [ ] Tests de getUserData()
- [ ] Tests de isAuthenticated()
- [ ] Tests de isTokenExpired()
- [ ] Tests de forgotPassword()

**Estimado:** 40-45 tests | 2 días

---

### Sprint 1.2: Login Component Tests (Días 3-4)
**Prioridad:** CRÍTICA  
**Archivo:** `src/__tests__/components/Auth/Login.test.tsx`

- [ ] Renderizado del formulario
- [ ] Validación de campos
- [ ] Envío de formulario
- [ ] Manejo de errores
- [ ] Estados de carga
- [ ] Redirección exitosa
- [ ] Integración con useAuth

**Estimado:** 18-20 tests | 2 días

---

### Sprint 1.3: AuthContext Tests (Días 5-6)
**Prioridad:** CRÍTICA  
**Archivo:** `src/__tests__/contexts/AuthContext.test.tsx`

- [ ] Inicialización del contexto
- [ ] Función login
- [ ] Función logout
- [ ] Estados de autenticación
- [ ] Integración con localStorage
- [ ] useAuth hook

**Estimado:** 20-25 tests | 2 días

---

### Sprint 1.4: ProtectedRoute Tests (Día 7)
**Prioridad:** CRÍTICA  
**Archivo:** `src/__tests__/components/ProtectedRoute.test.tsx`

- [ ] Verificación de autenticación
- [ ] Verificación de rol admin
- [ ] Estados de carga
- [ ] Redirecciones
- [ ] Mensaje de acceso denegado

**Estimado:** 12-14 tests | 1 día

---

### Sprint 1.5: useTokenValidation Tests (Día 8)
**Prioridad:** CRÍTICA  
**Archivo:** `src/__tests__/hooks/useTokenValidation.test.ts`

- [ ] Validación periódica
- [ ] Logout automático
- [ ] Configuración de intervalo

**Estimado:** 10-12 tests | 1 día

---

### Sprint 1.6: Auth Integration Tests (Días 9-10)
**Prioridad:** CRÍTICA  
**Archivo:** `src/__tests__/integration/Auth.integration.test.tsx`

- [ ] Flujo Login → Dashboard
- [ ] Token expira → Logout
- [ ] Usuario no admin → Denegado
- [ ] Protected route flow

**Estimado:** 12-15 tests | 2 días

**TOTAL FASE 1:** ~130 tests | 10 días

---

## 🎯 FASE 2: DASHBOARD Y COMPONENTES CORE (Semanas 3-4)

### Sprint 2.1: Dashboard Component Tests (Días 1-2)
**Prioridad:** ALTA  
**Archivo:** `src/__tests__/components/Dashboard.test.tsx`

- [ ] Renderizado inicial
- [ ] Navegación entre tabs
- [ ] Header con usuario
- [ ] Botón de logout
- [ ] Selector de período

**Estimado:** 12-15 tests | 2 días

---

### Sprint 2.2: MetricCard Tests (Día 3)
**Prioridad:** ALTA  
**Archivo:** `src/__tests__/components/Common/MetricCard.test.tsx`

- [ ] Renderizado básico
- [ ] Con/sin unidad
- [ ] Cambio positivo/negativo
- [ ] Formato de números

**Estimado:** 8-10 tests | 1 día

---

### Sprint 2.3: ChartCard Tests (Días 4-5)
**Prioridad:** ALTA  
**Archivo:** `src/__tests__/components/Common/ChartCard.test.tsx`

- [ ] 5 tipos de gráficos
- [ ] Configuración de colores
- [ ] Tooltips y leyendas
- [ ] Datos vacíos

**Estimado:** 15-18 tests | 2 días

---

### Sprint 2.4: DataTable Tests (Día 6)
**Prioridad:** ALTA  
**Archivo:** `src/__tests__/components/Common/DataTable.test.tsx`

- [ ] Renderizado de tabla
- [ ] Headers y columnas
- [ ] Formateo de datos
- [ ] Datos vacíos

**Estimado:** 10-12 tests | 1 día

---

### Sprint 2.5: Analytics Component Tests (Días 7-8)
**Prioridad:** ALTA  
**Archivo:** `src/__tests__/components/Analytics/Analytics.test.tsx`

- [ ] Renderizado de métricas
- [ ] Datos de horas de reserva
- [ ] Datos de orígenes
- [ ] Gráficos
- [ ] Estados y errores

**Estimado:** 15-18 tests | 2 días

---

### Sprint 2.6: FleetManagement Tests (Días 9-10)
**Prioridad:** ALTA  
**Archivo:** `src/__tests__/components/FleetManagement/FleetManagement.test.tsx`

- [ ] Métricas de flota
- [ ] Cálculos de totales
- [ ] Gráficos de aerolíneas
- [ ] Tabla de detalles

**Estimado:** 18-20 tests | 2 días

**TOTAL FASE 2:** ~80 tests | 10 días

---

## 🎯 FASE 3: ANALYTICS Y BÚSQUEDA (Semana 5)

### Sprint 3.1: SearchAnalytics Tests (Días 1-2)
**Prioridad:** ALTA  
**Archivo:** `src/__tests__/components/SearchAnalytics/SearchAnalytics.test.tsx`

- [ ] Métricas de búsqueda
- [ ] Cálculos de conversión
- [ ] Gráficos de destinos
- [ ] Tabla de carrito

**Estimado:** 16-18 tests | 2 días

---

### Sprint 3.2: Summary Component Tests (Día 3)
**Prioridad:** MEDIA  
**Archivo:** `src/__tests__/components/Summary/Summary.test.tsx`

- [ ] Métricas del resumen
- [ ] Actividad reciente
- [ ] Eventos

**Estimado:** 12-14 tests | 1 día

---

### Sprint 3.3: useAnalytics Hook Tests (Días 4-5)
**Prioridad:** ALTA  
**Archivo:** `src/__tests__/hooks/useAnalytics.test.ts`

- [ ] Hook compuesto useAnalytics
- [ ] Hooks individuales (selección)
- [ ] Estados y errores

**Estimado:** 20-25 tests | 2 días

**TOTAL FASE 3:** ~50 tests | 5 días

---

## 🎯 FASE 4: SERVICIOS Y HOOKS RESTANTES (Semana 6)

### Sprint 4.1: ingestService Tests (Días 1-2)
**Prioridad:** MEDIA  
**Archivo:** `src/__tests__/services/ingestService.test.ts`

- [ ] ingestEvent
- [ ] Eventos específicos
- [ ] Manejo de errores

**Estimado:** 20-25 tests | 2 días

---

### Sprint 4.2: useIngest Hooks Tests (Día 3)
**Prioridad:** MEDIA  
**Archivo:** `src/__tests__/hooks/useIngest.test.ts`

- [ ] Hooks de ingest
- [ ] Journey tracking
- [ ] Cache invalidation

**Estimado:** 18-20 tests | 1 día

---

### Sprint 4.3: axiosConfig Tests (Día 4)
**Prioridad:** MEDIA  
**Archivo:** `src/__tests__/services/axiosConfig.test.ts`

- [ ] Configuración de axios
- [ ] Interceptores
- [ ] Manejo de errores

**Estimado:** 12-15 tests | 1 día

---

### Sprint 4.4: Componentes Complementarios (Día 5)
**Prioridad:** BAJA

- [ ] ForgotPassword tests
- [ ] Skeleton tests
- [ ] DateFilter tests
- [ ] TabNavigation tests

**Estimado:** 25-30 tests | 1 día

**TOTAL FASE 4:** ~75 tests | 5 días

---

## 🎯 FASE 5: INTEGRACIÓN Y E2E (Semana 7)

### Sprint 5.1: Integration Tests (Días 1-3)
**Prioridad:** MEDIA

- [ ] Dashboard Navigation Integration
- [ ] Data Flow Integration
- [ ] Error Recovery Integration

**Estimado:** 20-25 tests | 3 días

---

### Sprint 5.2: E2E Tests Setup (Días 4-5)
**Prioridad:** BAJA (Opcional)

- [ ] Cypress/Playwright setup
- [ ] Escenarios principales
- [ ] CI/CD integration

**Estimado:** 10-15 tests | 2 días

**TOTAL FASE 5:** ~35 tests | 5 días

---

## 📊 RESUMEN GLOBAL

| Fase | Duración | Tests | Estado |
|------|----------|-------|--------|
| **Fase 1: Auth** | 2 semanas | ~130 | 🔵 EN PROGRESO |
| **Fase 2: Dashboard** | 2 semanas | ~80 | ⚪ Pendiente |
| **Fase 3: Analytics** | 1 semana | ~50 | ⚪ Pendiente |
| **Fase 4: Servicios** | 1 semana | ~75 | ⚪ Pendiente |
| **Fase 5: Integración** | 1 semana | ~35 | ⚪ Pendiente |
| **TOTAL** | **7 semanas** | **~370 tests** | |

---

## 🎯 MÉTRICAS DE PROGRESO

### Cobertura Objetivo por Fase

```
Inicial:    ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  23%
Fase 1:     ████████████████████░░░░░░░░░░░░░░░░░░  50%
Fase 2:     ████████████████████████████░░░░░░░░░░  65%
Fase 3:     ██████████████████████████████████░░░░  75%
Fase 4:     ████████████████████████████████████░░  82%
Fase 5:     ██████████████████████████████████████  85%
```

---

## 📝 CHECKLIST DIARIO

### Antes de Empezar Cada Sprint
- [ ] Leer análisis de funcionalidad
- [ ] Revisar código fuente
- [ ] Identificar casos edge
- [ ] Preparar mocks necesarios

### Durante el Sprint
- [ ] Escribir tests descriptivos
- [ ] Usar arrange-act-assert
- [ ] Mockear dependencias externas
- [ ] Verificar cobertura parcial

### Al Finalizar el Sprint
- [ ] Ejecutar todos los tests
- [ ] Verificar cobertura alcanzada
- [ ] Actualizar documentación
- [ ] Commit y push

---

## 🔄 PROCESO DE DESARROLLO

### 1. Red-Green-Refactor
```
1. 🔴 Escribir test que falla
2. 🟢 Escribir código mínimo para pasar
3. 🔵 Refactorizar y mejorar
4. ✅ Repetir
```

### 2. Estructura de Test
```typescript
describe('Feature', () => {
  beforeEach(() => {
    // Setup
  });
  
  afterEach(() => {
    // Cleanup
  });
  
  it('should do something specific', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### 3. Naming Convention
- Archivos: `ComponentName.test.tsx`
- Describes: Nombre del componente/función
- Its: "should [comportamiento esperado]"

---

## 🛠️ HERRAMIENTAS

### Testing Stack
- **Test Runner:** Jest
- **Component Testing:** React Testing Library
- **Mocking:** Jest mocks + MSW (si necesario)
- **Coverage:** Jest coverage
- **E2E:** Cypress/Playwright (Fase 5)

### Scripts
```bash
# Run all tests
npm test

# Run specific test file
npm test -- Login.test.tsx

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Update snapshots
npm test -- -u
```

---

## ⚠️ CONSIDERACIONES

### Evitar
- ❌ Tests que dependen de orden de ejecución
- ❌ Tests con sleep/timeout hardcoded
- ❌ Tests que no limpian el estado
- ❌ Mockear demasiado (over-mocking)
- ❌ Tests demasiado genéricos

### Preferir
- ✅ Tests aislados e independientes
- ✅ waitFor para operaciones async
- ✅ Cleanup automático con afterEach
- ✅ Mock solo dependencias externas
- ✅ Tests específicos y descriptivos

---

## 📈 HITOS

### Semana 2: Autenticación Completa ✅
- Auth service testeado
- Login/Logout funcionando
- Protected routes validados
- **Cobertura: ~50%**

### Semana 4: Dashboard Operativo ✅
- Todos los tabs testeados
- Componentes comunes validados
- Navegación funcionando
- **Cobertura: ~65%**

### Semana 5: Analytics Completo ✅
- Hooks de analytics testeados
- Componentes de analytics validados
- **Cobertura: ~75%**

### Semana 6: Servicios Integrados ✅
- Servicios testeados
- Ingest funcionando
- **Cobertura: ~82%**

### Semana 7: Todo Integrado ✅
- Tests E2E funcionando
- CI/CD configurado
- **Cobertura: 85%+ 🎉**

---

**Plan creado:** 23 de Octubre, 2025  
**Inicio:** Sprint 1.1 - authService Tests  
**Objetivo Final:** 85% de cobertura en 7 semanas

