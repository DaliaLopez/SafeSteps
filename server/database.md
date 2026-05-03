# Database Schema

The following tables must be created in the DB before running the application.

# Users

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);
```


## Users SQL Queries

### getUsers

```sql
SELECT * FROM users;
```

### getUserById

```sql
SELECT * FROM users WHERE id = $1;
```

### authenticateUser

```sql
SELECT * FROM users WHERE email = $1;
```

### createUser

```sql
INSERT INTO users (id, name, role, email)
VALUES ($1, $2, $3, $4)
RETURNING *;
```

### updateUser

```sql
UPDATE users SET name = $2 WHERE id = $1
RETURNING *;
```

### deleteUser

```sql
DELETE FROM users WHERE id = $1 RETURNING *;
```


# Locations

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    boundary GEOGRAPHY(POLYGON, 4326) NOT NULL, /* boundary es limite, esta es la tabla donde se guardan los poligonos que dicen que edificios hay y eso*/
    type TEXT NOT NULL, 
    description TEXT
);
```
## Locations SQL Queries

### getLocations
```sql
SELECT * FROM locations;
```

### createLocation
```sql
INSERT INTO locations (name, boundary, type, description)
VALUES ($1, $2::geography, $3, $4)
RETURNING *;
```

### checkIfUserIsInside
```sql
SELECT name, description 
FROM locations 
WHERE ST_Intersects(boundary, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography);
```

### deleteLocation
```sql
DELETE FROM locations WHERE id = $1;
```


# Reports

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    problem_type TEXT NOT NULL,
    danger_level TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    status TEXT DEFAULT 'Pendiente',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP

);
```
## Reports SQL Queries

### getReports
```sql
SELECT * FROM reports;
```

### getReportsById
```sql
SELECT * FROM reports WHERE id=$1;
```

### getPendingReports
```sql
SELECT r.*, u.name as reporter_name 
FROM reports r
JOIN users u ON r.user_id = u.id
WHERE r.status = 'Pendiente'
ORDER BY r.created_at ASC;
```

### updateReport
```sql
UPDATE reports 
SET status = $1 
WHERE id = $2 
RETURNING *;
```

### promoteReportToAlert
```sql
INSERT INTO alerts (location_id, message)
SELECT l.id, r.description
FROM reports r, locations l
WHERE r.id = $1
AND r.status = 'Aprobado' -- CAMBIO
AND ST_Intersects(l.boundary, r.location);
```

### createReport
```sql
INSERT INTO reports(user_id, description, problem_type, danger_level, location) 
VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($6, $5), 4326)::geography) 
RETURNING *;
```

### updateReportStatus
```sql
UPDATE reports SET status = $1 WHERE id = $2 RETURNING *;
```




# Alerts

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    location_id UUID NOT NULL REFERENCES locations(id),
    message TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true, --NUEVO
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```
## Alerts SQL Queries

### createAlert
```sql
INSERT INTO alerts (location_id, message)
VALUES ($1, $2)
RETURNING *;
```

### getAlertByLocation
```sql
SELECT a.message, l.name as building_name
FROM alerts a
JOIN locations l ON a.location_id = l.id
WHERE a.location_id = $1
AND a.is_active = true -- CAMBIO
ORDER BY a.created_at DESC
LIMIT 1;
```

### getAlertsForAccessibility
```sql
SELECT l.name, a.message, l.type
FROM alerts a
JOIN locations l ON a.location_id = l.id
WHERE a.is_active = true --CAMBIO
ORDER BY l.name ASC;

-- NUEVO resolver alerta (cuando el problema ya no existe)
UPDATE alerts 
SET is_active = false
WHERE location_id = $1;
```



# Notifications

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    alert_id UUID NOT NULL REFERENCES alerts(id),
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notified BOOLEAN NOT NULL DEFAULT false
);
```
## Notifications SQL Queries

### createNotification
```sql
INSERT INTO notifications (user_id, alert_id)
VALUES ($1, $2)
RETURNING *;
```

### updateNotificationAtDelivered
```sql
UPDATE notifications 
SET delivered_at = CURRENT_TIMESTAMP, notified = true 
WHERE id = $1 
RETURNING *;
```

### getLastNotificationForUser
```sql
SELECT * FROM notifications WHERE user_id = $1 AND alert_id = $2 
AND created_at > NOW() - INTERVAL '3 minutes' ORDER BY created_at DESC 
LIMIT 1;
```

### getUserNotificationHistory
```sql
SELECT n.*, a.message 
FROM notifications n
JOIN alerts a ON n.alert_id = a.id
WHERE n.user_id = $1
ORDER BY n.created_at DESC;
```
