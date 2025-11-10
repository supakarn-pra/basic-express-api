# Express.js API with LINE Messaging API

โปรเจค Express.js API สำหรับผู้เริ่มต้น พร้อมระบบ Authentication, LINE Messaging API, และ Database

## 📁 โครงสร้างโปรเจค

```
project/
├── src/
│   ├── controllers/       # จัดการ HTTP requests และ responses
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   └── line.controller.ts
│   ├── services/          # Business logic และการติดต่อกับฐานข้อมูล
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   └── line.service.ts
│   ├── models/            # TypeScript interfaces และ types
│   │   ├── auth.model.ts
│   │   ├── user.model.ts
│   │   └── line.model.ts
│   ├── routes/            # กำหนด API endpoints
│   │   ├── auth.route.ts
│   │   ├── user.route.ts
│   │   ├── line.route.ts
│   │   └── index.ts
│   ├── middleware/        # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── cors.middleware.ts
│   │   └── errorHandler.middleware.ts
│   ├── config/            # การตั้งค่าต่างๆ
│   │   ├── database.ts
│   │   └── env.ts
│   ├── utils/             # Utility functions
│   │   └── jsonReader.ts
│   ├── app.ts             # Express app setup
│   └── server.ts          # Entry point
├── data/                  # ไฟล์ JSON ตัวอย่าง
│   └── sample.json
├── .env.example           # ตัวอย่างไฟล์ environment variables
├── tsconfig.json          # TypeScript configuration
└── package.json
```

## 🚀 การติดตั้งและเริ่มใช้งาน

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` จากไฟล์ `.env.example`:

```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env` ให้เหมาะสม:

```
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRES_IN=24h
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token
LINE_CHANNEL_SECRET=your-line-channel-secret
```

### 3. สร้างตารางในฐานข้อมูล (Supabase)

เข้าไปที่ Supabase Dashboard แล้วรัน SQL นี้:

```sql
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  line_user_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

### 4. Build และรันโปรเจค

```bash
# Build TypeScript
npm run build

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## 📚 API Endpoints

### Authentication (`/api/auth`)

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### User Management (`/api/users`)

**หมายเหตุ:** Endpoints เหล่านี้ต้องใช้ JWT Token ใน Authorization header

```http
Authorization: Bearer <your-token>
```

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <your-token>
```

#### Get All Users
```http
GET /api/users/all
Authorization: Bearer <your-token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "New Name",
  "line_user_id": "U1234567890"
}
```

#### Delete User
```http
DELETE /api/users/profile
Authorization: Bearer <your-token>
```

### LINE Messaging API (`/api/line`)

#### Webhook (สำหรับ LINE)
```http
POST /api/line/webhook
x-line-signature: <signature-from-line>

{
  "destination": "...",
  "events": [...]
}
```

#### Send Message
```http
POST /api/line/send
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "to": "U1234567890",
  "messages": [
    {
      "type": "text",
      "text": "Hello from API!"
    }
  ]
}
```

### Health Check
```http
GET /api/health
```

## 🔧 การใช้งาน JSON Reader

อ่านไฟล์ JSON แบบ Synchronous:

```typescript
import { JsonReader } from './utils/jsonReader';

const data = JsonReader.read<any>('./data/sample.json');
console.log(data);
```

อ่านไฟล์ JSON แบบ Asynchronous:

```typescript
import { JsonReader } from './utils/jsonReader';

const data = await JsonReader.readAsync<any>('./data/sample.json');
console.log(data);
```

เขียนไฟล์ JSON:

```typescript
import { JsonReader } from './utils/jsonReader';

const data = { name: 'John', age: 30 };
JsonReader.write('./data/output.json', data);
```

## 🔐 JWT Authentication

1. **Register** หรือ **Login** เพื่อรับ Token
2. ใช้ Token ใน Header เมื่อเรียก API ที่ต้องการ authentication:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📱 LINE Messaging API Setup

1. สร้าง LINE Channel ที่ [LINE Developers Console](https://developers.line.biz/)
2. คัดลอก **Channel Access Token** และ **Channel Secret**
3. ใส่ค่าใน `.env`:
   - `LINE_CHANNEL_ACCESS_TOKEN`
   - `LINE_CHANNEL_SECRET`
4. ตั้งค่า Webhook URL ในหน้า LINE Developers:
   ```
   https://your-domain.com/api/line/webhook
   ```

## ��️ Database (Supabase)

โปรเจคนี้ใช้ Supabase เป็น Database โดยค่าเริ่มต้น

### การเชื่อมต่อกับฐานข้อมูล

ดูตัวอย่างใน `src/config/database.ts`:

```typescript
import { supabase } from './config/database';

const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', 'user@example.com')
  .maybeSingle();
```

## 🛠️ เทคโนโลยีที่ใช้

- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Supabase** - Database (PostgreSQL)
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-Origin Resource Sharing
- **LINE Messaging API** - LINE Bot integration

## 📝 Scripts

```json
{
  "dev": "ts-node-dev --respawn src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

## 🎯 คำอธิบายแต่ละส่วน

### Controllers
จัดการ HTTP requests และ responses รับข้อมูลจาก client ส่งไปให้ service ประมวลผล แล้วส่งผลลัพธ์กลับ

### Services
ประมวลผล Business logic ติดต่อกับฐานข้อมูล และจัดการ external APIs

### Models
กำหนด TypeScript interfaces และ types สำหรับข้อมูลต่างๆ

### Routes
กำหนด API endpoints และเชื่อมต่อกับ controllers

### Middleware
ฟังก์ชันที่ทำงานระหว่าง request และ response เช่น authentication, CORS, error handling

### Config
ไฟล์การตั้งค่าต่างๆ เช่น database connection, environment variables

### Utils
Utility functions ที่ใช้ซ้ำได้ทั่วโปรเจค

## 🔒 Security Best Practices

1. เปลี่ยน `JWT_SECRET` เป็นค่าที่ปลอดภัย
2. ไม่ commit ไฟล์ `.env` เข้า Git
3. ใช้ HTTPS ใน production
4. เปิด RLS (Row Level Security) ในฐานข้อมูล
5. ตรวจสอบ input validation ทุกครั้ง

## 📞 LINE Webhook Testing

ทดสอบ Webhook ด้วย ngrok:

```bash
ngrok http 3000
```

จากนั้นตั้งค่า Webhook URL ใน LINE Developers:
```
https://your-ngrok-url.ngrok.io/api/line/webhook
```

## 🐛 Troubleshooting

### ฐานข้อมูลเชื่อมต่อไม่ได้
- ตรวจสอบว่าใส่ `SUPABASE_URL` และ `SUPABASE_ANON_KEY` ถูกต้อง
- ตรวจสอบว่าสร้างตาราง `users` แล้ว

### LINE Webhook ไม่ทำงาน
- ตรวจสอบว่า URL สามารถเข้าถึงได้จาก internet
- ตรวจสอบ `LINE_CHANNEL_SECRET` ว่าถูกต้อง
- ดู logs เพื่อตรวจสอบ signature validation

### JWT Token ไม่ถูกต้อง
- ตรวจสอบว่าส่ง token ใน header ถูกรูปแบบ: `Authorization: Bearer <token>`
- ตรวจสอบว่า token ยังไม่หมดอายุ

## 📖 เอกสารเพิ่มเติม

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [LINE Messaging API Documentation](https://developers.line.biz/en/docs/messaging-api/)
- [JWT.io](https://jwt.io/)

## 📄 License

MIT
