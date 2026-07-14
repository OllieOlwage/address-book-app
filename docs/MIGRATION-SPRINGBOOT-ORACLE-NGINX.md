# Migration Guide: Node.js/SQLite to Spring Boot/Oracle/Nginx

A guide explaining what changes are needed to move the address-book-app backend from Node.js + Express + SQLite to Java Spring Boot + Oracle DB, served behind Nginx.

---

## 1. Architecture Comparison

### Current Architecture

```
┌─────────────────────────────┐
│   Angular Dev Server (:4200)│
│   proxy.conf.json → :3000   │
└──────────────┬──────────────┘
               │ HTTP
┌──────────────▼──────────────┐
│   Node.js + Express (:3000) │
│   TypeScript, CORS, JSON    │
└──────────────┬──────────────┘
               │ Synchronous
┌──────────────▼──────────────┐
│   SQLite (file: contacts.db)│
└─────────────────────────────┘
```

### Target Architecture

```
┌─────────────────────────────────────────────────┐
│                 Nginx (:80/:443)                 │
│                                                 │
│   /          → Angular static files (dist/)     │
│   /api/*     → proxy_pass to Spring Boot :8080  │
└──────────┬───────────────────────┬──────────────┘
           │ static files          │ HTTP proxy
┌──────────▼──────────┐  ┌────────▼──────────────┐
│  Angular dist/      │  │ Spring Boot (:8080)    │
│  (pre-built HTML/   │  │ Java 17+, Maven       │
│   JS/CSS)           │  │ Spring Data JPA       │
└─────────────────────┘  └────────┬──────────────┘
                                  │ JDBC
                         ┌────────▼──────────────┐
                         │  Oracle Database       │
                         │  (on-premise)          │
                         └───────────────────────┘
```

---

## 2. What Gets Removed

Delete the entire `backend/` folder. Everything in it is Node.js-specific:

| File/Folder | Why It's Removed |
|-------------|-----------------|
| `backend/package.json` | npm dependencies (Express, better-sqlite3) |
| `backend/tsconfig.json` | TypeScript config |
| `backend/src/index.ts` | Express app entry point |
| `backend/src/routes/contacts.ts` | Express route handlers |
| `backend/src/models/contact.ts` | TypeScript interfaces + validation |
| `backend/src/db/database.ts` | SQLite connection |
| `backend/src/middleware/errorHandler.ts` | Express error middleware |
| `backend/tests/` | Vitest + supertest tests |
| `backend/node_modules/` | npm packages |
| `backend/data/contacts.db` | SQLite database file |

---

## 3. What Gets Added

A new `backend/` folder with a Spring Boot project.

### 3.1 Prerequisites

| Tool | Version | What It Is |
|------|---------|-----------|
| JDK | 17 or 21 (LTS) | Java runtime + compiler |
| Maven | 3.9+ | Build tool (like npm for Java) |
| Oracle JDBC | ojdbc11 | Database driver for Oracle |

### 3.2 Generate the Project

Go to https://start.spring.io/ and configure:

| Field | Value |
|-------|-------|
| Project | Maven |
| Language | Java |
| Spring Boot | 3.3.x (latest stable) |
| Group | com.adaptit |
| Artifact | addressbook |
| Packaging | Jar |
| Java | 17 |

Add these dependencies:
- **Spring Web** (REST controllers)
- **Spring Data JPA** (database access)
- **Validation** (Jakarta Bean Validation)
- **Oracle Driver** (JDBC driver)

Download and unzip into `backend/`.

### 3.3 Project Structure

```
backend/
├── pom.xml                              # Maven build file (like package.json)
├── src/
│   ├── main/
│   │   ├── java/com/adaptit/addressbook/
│   │   │   ├── AddressbookApplication.java   # Entry point (like index.ts)
│   │   │   ├── controller/
│   │   │   │   └── ContactController.java    # REST endpoints (like routes/contacts.ts)
│   │   │   ├── model/
│   │   │   │   └── Contact.java              # Entity class (like models/contact.ts)
│   │   │   ├── repository/
│   │   │   │   └── ContactRepository.java    # Database queries (like db/database.ts)
│   │   │   └── exception/
│   │   │       └── GlobalExceptionHandler.java # Error handling (like middleware/errorHandler.ts)
│   │   └── resources/
│   │       └── application.properties         # Config (DB connection, port)
│   └── test/
│       └── java/com/adaptit/addressbook/
│           └── ContactControllerTest.java     # Tests (like tests/contacts.test.ts)
└── mvnw / mvnw.cmd                            # Maven wrapper (run without installing Maven globally)
```

### 3.4 Key File: `application.properties`

```properties
# Server
server.port=8080

# Oracle Database Connection
spring.datasource.url=jdbc:oracle:thin:@//your-oracle-host:1521/your-service-name
spring.datasource.username=addressbook_user
spring.datasource.password=your_password
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver

# JPA / Hibernate
spring.jpa.database-platform=org.hibernate.dialect.OracleDialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
```

**Important:** Never commit passwords. Use environment variables or a secrets manager:
```properties
spring.datasource.password=${ORACLE_DB_PASSWORD}
```

### 3.5 Key File: `Contact.java` (Entity)

```java
package com.adaptit.addressbook.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "CONTACTS")
public class Contact {

    @Id
    @Column(length = 36)
    private String id;

    @NotBlank
    @Size(max = 50)
    @Column(name = "FIRST_NAME", nullable = false, length = 50)
    private String firstName;

    @NotBlank
    @Size(max = 50)
    @Column(name = "LAST_NAME", nullable = false, length = 50)
    private String lastName;

    @NotBlank
    @Pattern(regexp = "^\\+?[\\d\\s\\-()]{7,15}$")
    @Column(name = "CELL_NUMBER", nullable = false)
    private String cellNumber;

    @NotBlank
    @Email
    @Size(max = 254)
    @Column(nullable = false, length = 254)
    private String email;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "UPDATED_AT", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    // Getters and setters...
}
```

### 3.6 Key File: `ContactRepository.java`

```java
package com.adaptit.addressbook.repository;

import com.adaptit.addressbook.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, String> {
    List<Contact> findAllByOrderByCreatedAtDesc();
}
```

That's it — Spring Data JPA generates all the SQL (SELECT, INSERT, UPDATE, DELETE) automatically from this one interface.

### 3.7 Key File: `ContactController.java`

```java
package com.adaptit.addressbook.controller;

import com.adaptit.addressbook.model.Contact;
import com.adaptit.addressbook.repository.ContactRepository;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactRepository repo;

    public ContactController(ContactRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Contact> getAll() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/{id}")
    public Contact getById(@PathVariable String id) {
        return repo.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Contact create(@Valid @RequestBody Contact contact) {
        return repo.save(contact);
    }

    @PutMapping("/{id}")
    public Contact update(@PathVariable String id, @Valid @RequestBody Contact contact) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found");
        }
        contact.setId(id);
        return repo.save(contact);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found");
        }
        repo.deleteById(id);
        return ResponseEntity.ok(java.util.Map.of("message", "Contact deleted successfully"));
    }
}
```

### 3.8 Key File: `pom.xml` Dependencies (the important part)

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>com.oracle.database.jdbc</groupId>
        <artifactId>ojdbc11</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## 4. Oracle DB Setup

### What to Ask Your DBA For

| Item | Example | Why You Need It |
|------|---------|----------------|
| Hostname | `oracledb.internal.adaptit.com` | Where the database lives |
| Port | `1521` | Oracle's default listener port |
| Service Name | `ADDRBOOK` | Identifies the specific database |
| Username | `addressbook_user` | Your app's login |
| Password | (from secrets vault) | Authentication |
| Network access | Firewall rule: app server → DB:1521 | Your app must be able to reach it |

### Connection String Format

```
jdbc:oracle:thin:@//hostname:port/service_name
```

Example:
```
jdbc:oracle:thin:@//oracledb.internal.adaptit.com:1521/ADDRBOOK
```

### Table DDL (give this to your DBA)

```sql
CREATE TABLE CONTACTS (
    ID            VARCHAR2(36)   PRIMARY KEY,
    FIRST_NAME    VARCHAR2(50)   NOT NULL,
    LAST_NAME     VARCHAR2(50)   NOT NULL,
    CELL_NUMBER   VARCHAR2(20)   NOT NULL,
    EMAIL         VARCHAR2(254)  NOT NULL,
    CREATED_AT    TIMESTAMP      DEFAULT SYSTIMESTAMP NOT NULL,
    UPDATED_AT    TIMESTAMP      DEFAULT SYSTIMESTAMP NOT NULL
);
```

**Note:** Oracle uses `VARCHAR2` (not `TEXT`), `TIMESTAMP` (not `TEXT` with ISO dates), and `SYSTIMESTAMP` (not `datetime('now')`).

---

## 5. Nginx Configuration

### Sample `nginx.conf`

```nginx
server {
    listen 80;
    server_name your-app-domain.adaptit.com;

    # Serve Angular static files
    root /var/www/addressbook;
    index index.html;

    # Angular routes — always return index.html for client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Spring Boot
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Where to Put the Angular Build

```bash
# Build the Angular app
cd frontend
ng build --configuration production

# Copy the output to Nginx's serving directory
cp -r dist/frontend/browser/* /var/www/addressbook/
```

### CORS — Two Options

**Option A: Let Nginx handle it (recommended for simplicity)**

Add to the `/api/` location block:
```nginx
add_header Access-Control-Allow-Origin *;
add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
add_header Access-Control-Allow-Headers "Content-Type, Authorization";
```

**Option B: Let Spring Boot handle it**

Add a config class:
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://your-app-domain.adaptit.com")
            .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

Since Nginx serves both the frontend and proxies the API on the same domain, **CORS is not actually needed in production** (same-origin). You only need it for local development when the Angular dev server runs on a different port.

---

## 6. Frontend Changes

The frontend (Angular) changes are **minimal** because the API contract stays the same.

| What | Change | Why |
|------|--------|-----|
| `environment.ts` | Keep `apiUrl: '/api'` | Nginx handles routing — no change needed |
| `environment.development.ts` | Change port to `8080` | Spring Boot runs on 8080, not 3000 |
| `proxy.conf.json` | Update target to `:8080` | Dev server proxy points to Spring Boot |
| API responses | No change | Spring Boot returns same JSON shape |

### Updated `environment.development.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
};
```

### Updated `proxy.conf.json` (for local dev only)

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false
  }
}
```

---

## 7. Developer Machine Setup Changes

### What to Install (in addition to existing tools)

| Tool | How to Install (Windows) | How to Install (Mac) |
|------|-------------------------|---------------------|
| **JDK 17+** | Download from https://adoptium.net/ → `.msi` installer | `brew install temurin@17` |
| **Maven 3.9+** | Download from https://maven.apache.org/download.cgi, add `bin/` to PATH | `brew install maven` |
| **Oracle Instant Client** | Download from https://www.oracle.com/database/technologies/instant-client.html | Same site, Mac version |
| **Nginx** (optional for local) | `choco install nginx` or Docker | `brew install nginx` |

### Verify Java Setup

```bash
java --version       # Should show 17+ or 21+
mvn --version        # Should show 3.9+
```

### Running Locally After Migration

```bash
# Terminal 1 — Spring Boot backend
cd backend
./mvnw spring-boot:run

# Terminal 2 — Angular frontend (with proxy to :8080)
cd frontend
ng serve
```

The Spring Boot app starts on http://localhost:8080.
The Angular dev server runs on http://localhost:4200 and proxies `/api` to `:8080`.

---

## 8. Testing Changes

| Current (Node.js) | Target (Spring Boot) |
|-------------------|---------------------|
| Vitest (test runner) | JUnit 5 (test runner) |
| supertest (HTTP assertions) | MockMvc (HTTP assertions) |
| In-process test (import app) | `@SpringBootTest` + `@AutoConfigureMockMvc` |
| `npm test` | `./mvnw test` |

### Example Test

```java
@SpringBootTest
@AutoConfigureMockMvc
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldCreateContact() throws Exception {
        String json = """
            {
                "firstName": "Jane",
                "lastName": "Smith",
                "cellNumber": "+27 82 555 1234",
                "email": "jane@example.com"
            }
            """;

        mockMvc.perform(post("/api/contacts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.firstName").value("Jane"))
            .andExpect(jsonPath("$.id").isNotEmpty());
    }

    @Test
    void shouldReturn400ForInvalidInput() throws Exception {
        mockMvc.perform(post("/api/contacts")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
            .andExpect(status().isBadRequest());
    }
}
```

For local testing without a real Oracle DB, add H2 as a test dependency:
```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
```

Then in `src/test/resources/application-test.properties`:
```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=create-drop
```

---

## 9. Key Mapping Table

| Current File | Purpose | Replaced By |
|-------------|---------|-------------|
| `backend/package.json` | Dependencies | `backend/pom.xml` |
| `backend/tsconfig.json` | TypeScript config | (not needed — Java compiles natively) |
| `backend/src/index.ts` | App entry point + Express setup | `AddressbookApplication.java` |
| `backend/src/routes/contacts.ts` | CRUD route handlers | `ContactController.java` |
| `backend/src/models/contact.ts` | TypeScript interfaces + validation | `Contact.java` (entity + annotations) |
| `backend/src/db/database.ts` | SQLite connection + schema | `application.properties` + `ContactRepository.java` |
| `backend/src/middleware/errorHandler.ts` | Global error handler | `GlobalExceptionHandler.java` (using `@ControllerAdvice`) |
| `backend/tests/contacts.test.ts` | API integration tests | `ContactControllerTest.java` |
| `backend/tests/validation.test.ts` | Validation unit tests | (covered by bean validation — tests optional) |
| `frontend/proxy.conf.json` | Dev proxy to :3000 | Dev proxy to :8080 |
| (none) | Web server | `nginx.conf` |

---

## 10. Deployment Summary

### Build Steps

```bash
# 1. Build the Angular frontend
cd frontend
ng build --configuration production

# 2. Build the Spring Boot backend
cd backend
./mvnw clean package -DskipTests

# 3. The outputs:
#    - Frontend: frontend/dist/frontend/browser/  (static HTML/JS/CSS)
#    - Backend:  backend/target/addressbook-0.0.1-SNAPSHOT.jar (single runnable JAR)
```

### Deploy Steps

```bash
# 1. Copy frontend to Nginx
cp -r frontend/dist/frontend/browser/* /var/www/addressbook/

# 2. Run the Spring Boot JAR
java -jar backend/target/addressbook-0.0.1-SNAPSHOT.jar \
  --spring.datasource.url=jdbc:oracle:thin:@//oracledb:1521/ADDRBOOK \
  --spring.datasource.username=addressbook_user \
  --spring.datasource.password=${ORACLE_DB_PASSWORD}

# 3. Start/reload Nginx
sudo systemctl reload nginx
```

---

## Quick Reference: Commands Comparison

| Task | Current (Node.js) | Target (Spring Boot) |
|------|-------------------|---------------------|
| Install deps | `npm install` | `./mvnw dependency:resolve` (auto on build) |
| Run dev server | `npm run dev` | `./mvnw spring-boot:run` |
| Run tests | `npm test` | `./mvnw test` |
| Build for production | `tsc` (not really used) | `./mvnw clean package` |
| Start production | `node dist/index.js` | `java -jar target/addressbook.jar` |
| Default port | 3000 | 8080 |
