import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTAButton from "@/components/CTAButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Transform Ingredients Into
          <br />
          Culinary Magic with AI
        </h1>
        <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">Generate instant, personalized recipes from the ingredients you already have. Less waste, more taste.</p>

        <CTAButton />
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

      <Footer />
    </div>
  );
}
