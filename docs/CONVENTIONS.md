# Convenciones de Código - Gentleman Stack

## 🌍 Idiomas

| Contexto | Idioma | Ejemplo |
|----------|--------|---------|
| UI / User-facing | **Español** | `<h1>Bienvenido</h1>` |
| Código / Variables | **Inglés** | `const userName = "..."` |
| Comentarios | **Inglés** | `// Initialize user session` |
| Commits | **Inglés** | `feat: add user authentication` |
| Docs técnicas | **Español** | Este archivo |

---

## 📁 Estructura de Archivos

```
proyecto/
├── cmd/                     # Entry points (Go)
├── internal/                # Código privado
│   ├── handlers/            # HTTP handlers
│   ├── middleware/          # Middleware
│   ├── models/              # Modelos de datos
│   ├── store/               # Acceso a datos
│   └── config/              # Configuración
├── pkg/                     # Código público/reusable
├── web/                     # Frontend (si aplica)
├── scripts/                 # Scripts de utilidad
├── docs/                    # Documentación
└── AGENTS.md                # Contexto para agentes
```

---

## 🎨 Estilo de Código

### Go
```go
// ─── Package Description ─────────────────
package handlers

import (
    "net/http"
)

// UserHandler maneja operaciones de usuario
type UserHandler struct {
    store  *store.Store
    config *config.Config
}

// NewUserHandler crea un nuevo handler
func NewUserHandler(s *store.Store, cfg *config.Config) *UserHandler {
    return &UserHandler{
        store:  s,
        config: cfg,
    }
}

// GetUser obtiene un usuario por ID
// Returns: User, error
func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    
    user, err := h.store.GetUser(id)
    if err != nil {
        // Error messages: lowercase, no period
        respondWithError(w, http.StatusNotFound, "user not found")
        return
    }
    
    respondWithJSON(w, http.StatusOK, user)
}
```

### JavaScript
```javascript
// ─── Configuración API ────────────────────
const API_CONFIG = {
    baseUrl: 'https://api.ejemplo.com',
    endpoints: {
        users: '/api/v1/users',
        auth: {
            login: '/api/v1/auth/login',
            register: '/api/v1/auth/register'
        }
    }
};

/**
 * Obtiene usuario por ID
 * @param {string} id - User ID
 * @returns {Promise<User>}
 */
async function getUser(id) {
    const response = await fetch(`${API_CONFIG.baseUrl}/users/${id}`);
    if (!response.ok) {
        throw new Error('user not found');
    }
    return response.json();
}
```

### CSS
```css
/* ─── Variables Globales ───────────────── */
:root {
    --color-primary: #6366f1;
    --color-secondary: #a855f7;
    --spacing-unit: 1rem;
}

/* ─── Componente Card ───────────────── */
.card {
    padding: var(--spacing-unit);
    border-radius: 8px;
}

/* Mobile-first responsive */
@media (min-width: 768px) {
    .card {
        padding: calc(var(--spacing-unit) * 2);
    }
}
```

---

## 📝 Comentarios

### Secciones (obligatorio)
```go
// ─── Nombre de Sección ─────────────────
```

### Funciones
```go
// FunctionName hace X
// Parameters: ...
// Returns: ...
```

### Decisiones importantes
```go
// NOTE: Decidimos usar X en lugar de Y porque Z
// Ver: AGENTS.md#decisiones
```

---

## 🏷️ Naming Conventions

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Variables | camelCase | `userName`, `totalCount` |
| Funciones | PascalCase (export) / camelCase (private) | `GetUser()`, `validateInput()` |
| Structs/Types | PascalCase | `UserHandler`, `Config` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Archivos | snake_case | `user_handler.go` |
| Paquetes | lowercase | `handlers`, `middleware` |

---

## 🧪 Testing

```go
// TestGetUser prueba obtener usuario
func TestGetUser(t *testing.T) {
    tests := []struct {
        name       string
        id         string
        wantStatus int
    }{
        {
            name:       "user exists",
            id:         "123",
            wantStatus: http.StatusOK,
        },
        {
            name:       "user not found",
            id:         "999",
            wantStatus: http.StatusNotFound,
        },
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // Test implementation
        })
    }
}
```

---

## 🔒 Seguridad

- Nunca commitear secrets (usar .env)
- Sanitizar input de usuarios
- Usar HTTPS en producción
- Rate limiting en endpoints públicos
- JWT con expiración corta (24h default)

---

## 📚 Recursos

- [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)

---

*Estas convenciones son nuestra "fuente de verdad" para mantener consistencia entre proyectos.*
