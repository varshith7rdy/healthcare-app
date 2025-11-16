
const createUsersTable = `

  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    role text DEFAULT 'patient',
    full_name TEXT NOT NULL,
    phone_number TEXT,
    date_of_birth DATE,
    blood_type VARCHAR(3),
    allergies TEXT,
    emergency_contact text,
    status text NOT NULL DEFAULT 'active',
    member_since TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

`

export async function ensureUsersTable(pool) {
    await pool.query(createUsersTable);    
}