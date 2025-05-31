
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "Puch reduced my email management time by 80%. I can finally focus on building my startup instead of drowning in my inbox.",
    author: "Sarah Chen",
    role: "Founder, TechFlow",
    avatar: "👩‍💼"
  },
  {
    quote: "The AI unsubscribe feature is genius. It cleaned up 10 years of newsletter subscriptions in just one day.",
    author: "Marcus Rodriguez",
    role: "Product Manager, InnovateLab",
    avatar: "👨‍💻"
  },
  {
    quote: "Smart replies that actually sound like me. My team thinks I've become incredibly efficient overnight.",
    author: "Emily Watson",
    role: "CEO, GrowthCo",
    avatar: "👩‍💼"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="relative z-10 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Loved by
            <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Founders & Teams
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of professionals who've reclaimed their time with Puch.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-8">Trusted by teams at</p>
          <div className="flex items-center justify-center space-x-12 opacity-60">
            <div className="text-2xl font-bold">Google</div>
            <div className="text-2xl font-bold">Microsoft</div>
            <div className="text-2xl font-bold">Stripe</div>
            <div className="text-2xl font-bold">Notion</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
