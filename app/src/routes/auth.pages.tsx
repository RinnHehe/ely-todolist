import { Elysia } from "elysia";
import { Html } from "@elysiajs/html";

export const authPages = (app: Elysia) =>
  app
    .get("/login", () => (
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Login - Ely TodoList</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 min-h-screen">
          <div class="min-h-screen flex items-center justify-center p-4">
            <div class="bg-white/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h1 class="text-3xl font-bold mb-6 text-gray-900">Login to Your Account</h1>
              
              <form id="loginForm" class="space-y-6">
                <div>
                  <label class="block mb-2 font-semibold text-gray-900">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="your@email.com"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600 focus:ring-opacity-10 transition-all"
                  />
                </div>

                <div>
                  <label class="block mb-2 font-semibold text-gray-900">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600 focus:ring-opacity-10 transition-all"
                  />
                </div>

                <div id="error" class="hidden p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm"></div>

                <div class="flex items-center justify-between">
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      class="mr-2 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span class="text-sm text-gray-700">Remember me</span>
                  </label>
                  <a href="/forgot-password" class="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  class="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Login
                </button>
              </form>

              <p class="text-center mt-6 text-gray-600">
                Don't have an account?{' '}
                <a href="/register" class="text-indigo-600 font-semibold hover:underline">
                  Sign up
                </a>
              </p>
            </div>
          </div>

          <script>{`
            const form = document.getElementById('loginForm');
            const errorDiv = document.getElementById('error');

            form.addEventListener('submit', async (e) => {
              e.preventDefault();
              errorDiv.classList.add('hidden');

              const email = document.getElementById('email').value;
              const password = document.getElementById('password').value;
              const rememberMe = document.getElementById('rememberMe').checked;

              // Basic validation
              if (!email.trim()) {
                showError('Email is required');
                return;
              }

              const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
              if (!emailRegex.test(email)) {
                showError('Please enter a valid email address');
                return;
              }

              if (!password) {
                showError('Password is required');
                return;
              }

              try {
                const response = await fetch('/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.error) {
                  showError(data.error);
                  return;
                }

                if (data.success && data.token) {
                  localStorage.setItem('token', data.token);
                  if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                  }
                  window.location.href = '/dashboard';
                }
              } catch (err) {
                showError('An error occurred. Please try again.');
              }
            });

            function showError(message) {
              errorDiv.textContent = message;
              errorDiv.classList.remove('hidden');
            }
          `}</script>
        </body>
      </html>
    ))
    .get("/register", () => (
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Register - Ely TodoList</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 min-h-screen">
          <div class="min-h-screen flex items-center justify-center p-4">
            <div class="bg-white/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h1 class="text-3xl font-bold mb-6 text-gray-900">Create Your Account</h1>
              
              <form id="registerForm" class="space-y-6">
                <div>
                  <label class="block mb-2 font-semibold text-gray-900">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Your Name"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600 focus:ring-opacity-10 transition-all"
                  />
                </div>

                <div>
                  <label class="block mb-2 font-semibold text-gray-900">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="your@email.com"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600 focus:ring-opacity-10 transition-all"
                  />
                </div>

                <div>
                  <label class="block mb-2 font-semibold text-gray-900">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    minlength="8"
                    placeholder="••••••••"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600 focus:ring-opacity-10 transition-all"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Min 8 characters, must include uppercase, lowercase, and number
                  </p>
                </div>

                <div>
                  <label class="block mb-2 font-semibold text-gray-900">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600 focus:ring-opacity-10 transition-all"
                  />
                </div>

                <div id="error" class="hidden p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm"></div>

                <button
                  type="submit"
                  class="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Sign Up
                </button>
              </form>

              <p class="text-center mt-6 text-gray-600">
                Already have an account?{' '}
                <a href="/login" class="text-indigo-600 font-semibold hover:underline">
                  Login
                </a>
              </p>
            </div>
          </div>

          <script>{`
            const form = document.getElementById('registerForm');
            const errorDiv = document.getElementById('error');

            form.addEventListener('submit', async (e) => {
              e.preventDefault();
              errorDiv.classList.add('hidden');

              const name = document.getElementById('name').value;
              const email = document.getElementById('email').value;
              const password = document.getElementById('password').value;
              const confirmPassword = document.getElementById('confirmPassword').value;

              // Validation
              if (!name.trim()) {
                showError('Name is required');
                return;
              }

              if (!email.trim()) {
                showError('Email is required');
                return;
              }

              const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
              if (!emailRegex.test(email)) {
                showError('Please enter a valid email address');
                return;
              }

              if (!password) {
                showError('Password is required');
                return;
              }

              if (password.length < 8) {
                showError('Password must be at least 8 characters long');
                return;
              }

              if (!/(?=.*[a-z])/.test(password)) {
                showError('Password must contain at least one lowercase letter');
                return;
              }

              if (!/(?=.*[A-Z])/.test(password)) {
                showError('Password must contain at least one uppercase letter');
                return;
              }

              if (!/(?=.*\\d)/.test(password)) {
                showError('Password must contain at least one number');
                return;
              }

              if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
              }

              try {
                const response = await fetch('/auth/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (data.error) {
                  if (data.error.includes('already')) {
                    showError('This email is already registered. Please use a different email or login.');
                  } else {
                    showError(data.error);
                  }
                  return;
                }

                if (data.success && data.user) {
                  // Auto login after registration
                  const loginResponse = await fetch('/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                  });

                  const loginData = await loginResponse.json();

                  if (loginData.success && loginData.token) {
                    localStorage.setItem('token', loginData.token);
                    window.location.href = '/dashboard';
                  }
                }
              } catch (err) {
                showError('An error occurred. Please try again.');
              }
            });

            function showError(message) {
              errorDiv.textContent = message;
              errorDiv.classList.remove('hidden');
            }
          `}</script>
        </body>
      </html>
    ))
    .get("/forgot-password", () => (
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Forgot Password - Ely TodoList</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 min-h-screen">
          <div class="min-h-screen flex items-center justify-center p-4">
            <div class="bg-white/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <a href="/login" class="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center gap-2 inline-block">
                <span>←</span> Back to Login
              </a>

              <h1 class="text-3xl font-bold mb-2 text-gray-900">Forgot Password?</h1>
              <p class="text-gray-600 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <div id="successMessage" class="hidden p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg mb-6">
                <p class="font-medium">Email Sent!</p>
                <p class="text-sm mt-1">
                  If the email is registered, a password reset link has been sent to your inbox.
                  Please check your email and follow the instructions.
                </p>
              </div>

              <form id="forgotPasswordForm" class="space-y-6">
                <div>
                  <label class="block mb-2 font-semibold text-gray-900">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="your@email.com"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600 focus:ring-opacity-10 transition-all"
                  />
                </div>

                <div id="error" class="hidden p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm"></div>

                <button
                  type="submit"
                  id="submitBtn"
                  class="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Send Reset Link
                </button>
              </form>

              <div class="mt-6 text-center">
                <p class="text-gray-600">
                  Remember your password?{' '}
                  <a href="/login" class="text-indigo-600 font-semibold hover:underline">
                    Login
                  </a>
                </p>
              </div>
            </div>
          </div>

          <script>{`
            const form = document.getElementById('forgotPasswordForm');
            const errorDiv = document.getElementById('error');
            const successDiv = document.getElementById('successMessage');
            const submitBtn = document.getElementById('submitBtn');

            form.addEventListener('submit', async (e) => {
              e.preventDefault();
              errorDiv.classList.add('hidden');
              successDiv.classList.add('hidden');

              const email = document.getElementById('email').value;

              if (!email.trim()) {
                showError('Email is required');
                return;
              }

              const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
              if (!emailRegex.test(email)) {
                showError('Please enter a valid email address');
                return;
              }

              submitBtn.disabled = true;
              submitBtn.textContent = 'Sending...';

              try {
                const response = await fetch('/auth/forgot-password', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email })
                });

                const data = await response.json();

                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Reset Link';

                // Always show success for security
                form.classList.add('hidden');
                successDiv.classList.remove('hidden');
                
                // Show reset link in console for development
                if (data.resetLink) {
                  console.log('Password Reset Link:', data.resetLink);
                }
              } catch (err) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Reset Link';
                showError('An error occurred. Please try again.');
              }
            });

            function showError(message) {
              errorDiv.textContent = message;
              errorDiv.classList.remove('hidden');
            }
          `}</script>
        </body>
      </html>
    ))
    .get("/reset-password", ({ query }) => {
      const token = query.token || '';
      const email = query.email || '';

      return (
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Reset Password - Ely TodoList</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 min-h-screen">
            <div class="min-h-screen flex items-center justify-center p-4">
              <div class="bg-white/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <h1 class="text-3xl font-bold mb-2 text-gray-900">Reset Password</h1>
                <p class="text-gray-600 mb-6">Enter your new password below.</p>

                <div id="successMessage" class="hidden p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg mb-6">
                  <p class="font-medium">Password Reset Successful!</p>
                  <p class="text-sm mt-1">
                    Your password has been reset. Redirecting to login page...
                  </p>
                </div>

                <form id="resetPasswordForm" class="space-y-6">
                  <div>
                    <label class="block mb-2 font-semibold text-gray-900">Email</label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>

                  <div>
                    <label class="block mb-2 font-semibold text-gray-900">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      required
                      minlength="8"
                      placeholder="••••••••"
                      class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600 focus:ring-opacity-10 transition-all"
                    />
                    <p class="text-xs text-gray-500 mt-1">
                      Min 8 characters, must include uppercase, lowercase, and number
                    </p>
                  </div>

                  <div>
                    <label class="block mb-2 font-semibold text-gray-900">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      placeholder="••••••••"
                      class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600 focus:ring-opacity-10 transition-all"
                    />
                  </div>

                  <div id="error" class="hidden p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm"></div>

                  <button
                    type="submit"
                    id="submitBtn"
                    class="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Reset Password
                  </button>
                </form>

                <div class="mt-6 text-center">
                  <p class="text-gray-600">
                    Remember your password?{' '}
                    <a href="/login" class="text-indigo-600 font-semibold hover:underline">
                      Login
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <script>{`
              const form = document.getElementById('resetPasswordForm');
              const errorDiv = document.getElementById('error');
              const successDiv = document.getElementById('successMessage');
              const submitBtn = document.getElementById('submitBtn');
              const token = '${token}';
              const email = '${email}';

              if (!token || !email) {
                showError('Invalid reset link. Please request a new password reset.');
                submitBtn.disabled = true;
              }

              form.addEventListener('submit', async (e) => {
                e.preventDefault();
                errorDiv.classList.add('hidden');

                const newPassword = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                if (!newPassword) {
                  showError('Password is required');
                  return;
                }

                if (newPassword.length < 8) {
                  showError('Password must be at least 8 characters long');
                  return;
                }

                if (!/(?=.*[a-z])/.test(newPassword)) {
                  showError('Password must contain at least one lowercase letter');
                  return;
                }

                if (!/(?=.*[A-Z])/.test(newPassword)) {
                  showError('Password must contain at least one uppercase letter');
                  return;
                }

                if (!/(?=.*\\d)/.test(newPassword)) {
                  showError('Password must contain at least one number');
                  return;
                }

                if (newPassword !== confirmPassword) {
                  showError('Passwords do not match');
                  return;
                }

                submitBtn.disabled = true;
                submitBtn.textContent = 'Resetting...';

                try {
                  const response = await fetch('/auth/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, token, newPassword })
                  });

                  const data = await response.json();

                  if (data.error) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Reset Password';
                    showError(data.error);
                    return;
                  }

                  if (data.success) {
                    form.classList.add('hidden');
                    successDiv.classList.remove('hidden');
                    
                    setTimeout(() => {
                      window.location.href = '/login';
                    }, 2000);
                  }
                } catch (err) {
                  submitBtn.disabled = false;
                  submitBtn.textContent = 'Reset Password';
                  showError('An error occurred. Please try again.');
                }
              });

              function showError(message) {
                errorDiv.textContent = message;
                errorDiv.classList.remove('hidden');
              }
            `}</script>
          </body>
        </html>
      );
    })
    .get("/dashboard", ({ headers }) => {
      const token = headers.authorization?.replace('Bearer ', '') || '';
      
      if (!token) {
        return new Response(null, {
          status: 302,
          headers: { Location: '/login' }
        });
      }

      return (
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Dashboard - Ely TodoList</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 min-h-screen">
            <div class="container mx-auto px-4 py-8">
              <div class="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
                <div class="flex justify-between items-center mb-8">
                  <h1 class="text-4xl font-bold text-gray-900">📝 My Todos</h1>
                  <button
                    id="logoutBtn"
                    class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  >
                    Logout
                  </button>
                </div>
                
                <div id="todoList" class="space-y-4">
                  <p class="text-gray-600">Loading todos...</p>
                </div>
              </div>
            </div>

            <script>{`
              const token = localStorage.getItem('token');
              
              if (!token) {
                window.location.href = '/login';
              }

              document.getElementById('logoutBtn').addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('rememberMe');
                window.location.href = '/login';
              });

              // Load todos
              async function loadTodos() {
                try {
                  const response = await fetch('/todos', {
                    headers: {
                      'Authorization': 'Bearer ' + token
                    }
                  });

                  const data = await response.json();
                  
                  if (data.todos) {
                    const todoList = document.getElementById('todoList');
                    if (data.todos.length === 0) {
                      todoList.innerHTML = '<p class="text-gray-600">No todos yet. Create your first one!</p>';
                    } else {
                      todoList.innerHTML = data.todos.map(todo => \`
                        <div class="p-4 bg-white border-2 border-gray-200 rounded-lg">
                          <h3 class="font-semibold text-lg">\${todo.title}</h3>
                          <p class="text-gray-600">\${todo.description || ''}</p>
                        </div>
                      \`).join('');
                    }
                  }
                } catch (err) {
                  console.error('Error loading todos:', err);
                }
              }

              loadTodos();
            `}</script>
          </body>
        </html>
      );
    });
