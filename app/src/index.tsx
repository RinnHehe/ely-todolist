import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { html, Html } from "@elysiajs/html";
import { authRoutes } from "./routes/auth.routes";
import { todoRoutes } from "./routes/todo.routes";
import { authPages } from "./routes/auth.pages";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const app = new Elysia()
  .use(html())
  .use(jwt({ name: "jwt", secret: JWT_SECRET }))
  .derive(async ({ jwt, headers }) => {
    const auth = headers.authorization;
    if (!auth) return { user: null };
    const token = auth.replace("Bearer ", "");
    try {
      const payload = await jwt.verify(token);
      return { user: payload };
    } catch {
      return { user: null };
    }
  })
  .onError(({ code, error, set }) => {
    if (code === 'VALIDATION') {
      set.status = 400;
      return {
        success: false,
        error: 'Validation failed',
        details: error.toString()
      };
    }
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      set.status = 401;
      return {
        success: false,
        error: 'Unauthorized'
      };
    }

    set.status = 500;
    return {
      success: false,
      error: 'Internal server error'
    };
  })
  .get("/", () => (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ely TodoList - Organize Your Life</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 min-h-screen">
        <div class="container mx-auto px-4 py-16">
          <div class="text-center mb-12">
            <h1 class="text-6xl font-bold text-gray-900 mb-4">📝 Ely TodoList</h1>
            <p class="text-xl text-gray-600">Organize your life with elegance</p>
          </div>
          
          <div class="max-w-md mx-auto bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
            <h2 class="text-2xl font-bold mb-6 text-gray-900">Welcome!</h2>
            <p class="text-gray-600 mb-6">Server-side rendered with Elysia HTML plugin</p>
            
            <div class="space-y-4">
              <a 
                href="/login" 
                class="block w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all text-center"
              >
                Login
              </a>
              <a 
                href="/register" 
                class="block w-full py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all text-center"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  ))
  .use(authPages)
  .use(authRoutes)
  .use(todoRoutes)
  .listen(3000);

console.log(`🦊 Elysia Server with HTML/JSX running at http://localhost:3000`);
console.log(`🔐 Auth endpoints: /auth/register /auth/login /auth/forgot-password /auth/reset-password`);
console.log(`✅ Todos endpoints protected via Bearer token`);
console.log(`⚛️  Landing page with JSX at http://localhost:3000`);
