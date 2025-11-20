import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-primary">✓ Ely TodoList</h2>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogin(true)}
                className="px-6 py-2.5 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
              >
                Login
              </button>
              <button
                onClick={() => setShowSignup(true)}
                className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Organize Your Life with Ely TodoList
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Simple, powerful, and beautiful task management. Stay productive and never miss a deadline.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowSignup(true)}
                  className="px-8 py-4 bg-white text-indigo-700 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all hover:shadow-2xl hover:-translate-y-1 shadow-lg"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-8 py-4 border-2 border-white bg-white/5 text-white rounded-lg font-semibold text-lg hover:bg-white/20 backdrop-blur-sm transition-all"
                >
                  Login to Your Account
                </button>
              </div>
            </div>

            {/* Demo Task Card */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <DemoTask completed text="Complete project proposal" />
              <DemoTask text="Review team feedback" />
              <DemoTask text="Schedule client meeting" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why Choose Ely TodoList?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon="🚀"
              title="Fast & Simple"
              description="Create and manage tasks in seconds. No complicated setup required."
            />
            <FeatureCard
              icon="🔒"
              title="Secure & Private"
              description="Your data is encrypted and protected. Only you can access your tasks."
            />
            <FeatureCard
              icon="☁️"
              title="Cloud Sync"
              description="Access your todos from anywhere, on any device, anytime."
            />
            <FeatureCard
              icon="✨"
              title="Beautiful Design"
              description="Clean, modern interface that makes task management enjoyable."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Get Organized?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who trust Ely TodoList to manage their tasks.
          </p>
          <button
            onClick={() => setShowSignup(true)}
            className="px-8 py-4 bg-white text-indigo-700 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all hover:shadow-2xl hover:-translate-y-1 shadow-lg inline-block"
          >
            Start For Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <div className="container mx-auto px-4">
          <p>&copy; 2025 Ely TodoList. All rights reserved.</p>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} />
    </div>
  );
}

function DemoTask({ completed = false, text }: { completed?: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-4 p-4 mb-3 bg-gray-100 rounded-lg transition-all hover:bg-gray-200 hover:translate-x-1 ${completed ? 'opacity-60' : ''}`}>
      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${completed ? 'bg-primary border-primary text-white' : 'border-primary bg-white'}`}>
        {completed && '✓'}
      </div>
      <span className={`text-gray-900 text-lg ${completed ? 'line-through' : ''}`}>
        {text}
      </span>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-2 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
