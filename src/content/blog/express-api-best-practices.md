---
title: Node.js Express API Best Practices — Structure, Validation, and Error Handling
date: 2024-06-30
description: How to structure a production Express API with proper error handling, input validation, and middleware that actually scales.
tags: [fullstack, nodejs, express, backend]
---

## Most Express Tutorials Skip the Important Parts

They show you `app.get('/', (req, res) => res.send('hello'))` and call it a day. Here's how to actually structure an Express API that doesn't become a nightmare at scale.

## Project Structure

```
src/
├── controllers/
│   ├── auth.controller.ts
│   └── user.controller.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── validate.middleware.ts
│   └── error.middleware.ts
├── routes/
│   ├── auth.routes.ts
│   └── user.routes.ts
├── services/
│   ├── auth.service.ts
│   └── user.service.ts
├── lib/
│   └── db.ts
└── app.ts
```

## app.ts — Clean Entry Point

```ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/user.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

// security
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));

// parsing
app.use(express.json({ limit: "10mb" }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// error handler — must be last
app.use(errorMiddleware);

export default app;
```

## Custom Error Classes

```ts
// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super("Unauthorized", 401, "UNAUTHORIZED");
  }
}
```

## Global Error Middleware

```ts
// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/errors";

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
      },
    });
  }

  // unexpected errors
  return res.status(500).json({
    error: {
      message: "Internal server error",
      code: "INTERNAL_ERROR",
    },
  });
}
```

## Input Validation with Zod

```ts
// src/middleware/validate.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../lib/errors";

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.errors
          .map((e) => `${e.path}: ${e.message}`)
          .join(", ");
        next(new ValidationError(message));
      } else {
        next(err);
      }
    }
  };
}
```

## A Real Route with Validation

```ts
// src/routes/auth.routes.ts
import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.middleware";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name too short"),
});

router.post("/login", validate(loginSchema), AuthController.login);
router.post("/register", validate(registerSchema), AuthController.register);
router.post("/logout", AuthController.logout);

export { router as authRoutes };
```

## Async Error Wrapper

Stop wrapping every handler in try/catch manually:

```ts
// src/lib/asyncHandler.ts
import { Request, Response, NextFunction } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

export const asyncHandler =
  (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
```

Use it in controllers:

```ts
export const AuthController = {
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  }),
};
```

Errors thrown anywhere in the async function automatically flow to your error middleware.
