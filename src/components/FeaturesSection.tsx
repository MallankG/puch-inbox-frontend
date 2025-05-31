
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: "🤖",
    title: "AI Unsubscribe",
    description: "Automatically detect and unsubscribe from unwanted emails with intelligent pattern recognition.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: "💬",
    title: "Smart Replies",
    description: "Generate context-aware responses that match your tone and communication style.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: "📊",
    title: "Email Summaries",
    description: "Get AI-powered summaries of lengthy email threads and important conversations.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: "⚡",
    title: "Auto Archive Rules",
    description: "Set up intelligent rules to automatically organize and archive emails based on content.",
    gradient: "from-orange-500 to-red-500"
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative z-10 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for
            <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-scale-in" style={{ animationDelay: '0.2s' }}>
              Email Automation
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Transform your inbox with AI-powered tools that learn from your patterns and preferences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105 animate-slide-in-left"
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 animate-scale-in`} style={{ animationDelay: `${0.8 + index * 0.1}s` }}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white animate-fade-in" style={{ animationDelay: `${1.0 + index * 0.1}s` }}>
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed animate-fade-in" style={{ animationDelay: `${1.2 + index * 0.1}s` }}>
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
