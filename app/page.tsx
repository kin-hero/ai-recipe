import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-primary text-2xl">🔥</span>
          <span className="text-xl font-bold">ChefGPT</span>
        </div>

        <div className="flex items-center gap-4">
          <SignInButton mode="modal">
            <button className="px-6 py-2 rounded-lg text-foreground hover:bg-card transition">Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium transition">Sign Up</button>
          </SignUpButton>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Transform Ingredients Into
          <br />
          Culinary Magic with AI
        </h1>
        <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">Generate instant, personalized recipes from the ingredients you already have. Less waste, more taste.</p>

        <Link href="/recipes/create">
          <button className="px-8 py-4 rounded-lg bg-linear-to-r from-primary to-secondary text-white font-bold text-lg hover:shadow-lg hover:shadow-primary/50 transition">
            Start Cooking with AI
          </button>
        </Link>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
        <p className="text-center text-muted mb-12">Discover a new way to cook with the power of artificial intelligence.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature Card 1 */}
          <div className="bg-card rounded-(--radius-lg) p-6 border border-primary/20">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Recipes</h3>
            <p className="text-muted">Our advanced AI creates unique and delicious recipes in seconds.</p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-card rounded-(--radius-lg) p-6 border border-primary/20">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Personalized for You</h3>
            <p className="text-muted">Tell us what you have, and we&apos;ll build a recipe around it.</p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-card rounded-(--radius-lg) p-6 border border-primary/20">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-xl font-bold mb-2">Get 10 Free Recipes</h3>
            <p className="text-muted">Sign up today and get your first ten recipe generations for free.</p>
          </div>

          {/* Feature Card 4 */}
          <div className="bg-card rounded-(--radius-lg) p-6 border border-primary/20">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Instant Generation</h3>
            <p className="text-muted">No more waiting. Get your next meal idea instantly.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-card mt-20">
        <div className="max-w-7xl mx-auto flex justify-center gap-8 text-muted">
          <Link href="#" className="hover:text-foreground transition">
            About Us
          </Link>
          <Link href="#" className="hover:text-foreground transition">
            Contact
          </Link>
          <Link href="#" className="hover:text-foreground transition">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-foreground transition">
            Privacy Policy
          </Link>
        </div>
        <p className="text-center text-muted mt-6">© 2024 ChefGPT. All rights reserved.</p>
      </footer>
    </div>
  );
}
