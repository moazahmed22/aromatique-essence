import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Our Story
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Where passion for perfumery meets timeless elegance
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="aspect-video rounded-lg overflow-hidden shadow-luxury mb-8">
            <img
              src="/images/hero-banner.jpg"
              alt="Aromatique Fragrances"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-heading font-bold mb-4">The Art of Fragrance</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Founded in 2024, Aromatique Fragrances represents the pinnacle of luxury perfumery. 
              Our journey began with a simple yet profound mission: to create fragrances that tell 
              stories, evoke emotions, and capture the essence of life's most beautiful moments.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Each Aromatique perfume is a masterpiece, meticulously crafted using the finest 
              ingredients sourced from around the world. From the precious oud wood of Southeast 
              Asia to the delicate Bulgarian roses, every note is carefully selected to create 
              harmonious compositions that stand the test of time.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-elegant">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-heading font-semibold mb-3">Natural Ingredients</h3>
              <p className="text-muted-foreground">
                We use only the finest natural and sustainably sourced ingredients in our perfumes.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-heading font-semibold mb-3">Artisan Craftsmanship</h3>
              <p className="text-muted-foreground">
                Each fragrance is hand-crafted by master perfumers with decades of experience.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-heading font-semibold mb-3">Timeless Luxury</h3>
              <p className="text-muted-foreground">
                We create sophisticated scents that transcend trends and remain eternally elegant.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mission */}
        <div className="bg-gradient-gold rounded-lg p-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-heading font-bold mb-4">Our Mission</h2>
          <p className="text-lg max-w-2xl mx-auto">
            To awaken the senses and enrich lives through the transformative power of 
            exceptional fragrances, crafted with passion and presented with elegance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
