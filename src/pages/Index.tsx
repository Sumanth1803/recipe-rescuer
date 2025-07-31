import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from '@/components/Dashboard';
import { Button } from '@/components/ui/button';
import { ChefHat, Utensils, Heart, Star } from 'lucide-react';
import heroImage from '@/assets/hero-cooking.jpg';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center text-white">
          <ChefHat className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <p className="text-xl">Loading Recipe Rescuer...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-cream-beige">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Fresh cooking ingredients" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex justify-center mb-6">
              <ChefHat className="w-20 h-20 text-golden-yellow" />
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              Recipe Rescuer
            </h1>
            
            <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              Transform your available ingredients into delicious, real recipes. 
              Never wonder "what can I cook?" again.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => navigate('/auth')}
                className="text-lg px-8"
              >
                Start Cooking
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                onClick={() => navigate('/auth')}
                className="text-lg px-8 bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple steps to turn your ingredients into amazing meals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-gradient-card shadow-soft">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">List Your Ingredients</h3>
              <p className="text-muted-foreground">
                Tell us what you have in your kitchen - from vegetables to spices
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-card shadow-soft">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Recipe Suggestions</h3>
              <p className="text-muted-foreground">
                Discover real recipes that use only your available ingredients
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-card shadow-soft">
              <div className="w-16 h-16 bg-tomato-red rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cook & Track</h3>
              <p className="text-muted-foreground">
                Follow step-by-step instructions and save your cooking history
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Never Waste Ingredients Again
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Recipe Rescuer helps you make the most of what you have, reducing food waste 
                and saving money while discovering new favorite dishes.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-golden-yellow" />
                  <span className="text-lg">Real, tested recipes from around the world</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-golden-yellow" />
                  <span className="text-lg">Step-by-step cooking instructions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-golden-yellow" />
                  <span className="text-lg">Personal cooking history and favorites</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-golden-yellow" />
                  <span className="text-lg">Reduce food waste and save money</span>
                </div>
              </div>
              
              <Button 
                variant="chef" 
                size="xl"
                onClick={() => navigate('/auth')}
                className="mt-8"
              >
                Get Started Today
              </Button>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-primary rounded-3xl p-8 shadow-strong">
                <div className="bg-white rounded-2xl p-6 text-center">
                  <ChefHat className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Ready to Cook?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Join thousands of home cooks who never run out of meal ideas
                  </p>
                  <Button 
                    variant="hero"
                    size="lg"
                    onClick={() => navigate('/auth')}
                    className="w-full"
                  >
                    Sign Up Free
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-warm-brown text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <ChefHat className="w-8 h-8" />
            <span className="text-2xl font-bold">Recipe Rescuer</span>
          </div>
          <p className="text-white/80">
            Transform your ingredients into amazing meals
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
