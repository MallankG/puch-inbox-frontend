
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative z-10 flex items-center min-h-screen pt-20 pb-32 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Inbox.
            <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-scale-in" style={{ animationDelay: '0.3s' }}>
              Automated.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Unsubscribe. Respond. Organize. All with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-in-right" style={{ animationDelay: '0.7s' }}>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4 glow-purple hover-scale transition-all duration-300"
              onClick={() => window.location.href = '/login'}
            >
              Login with Google
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:text-white text-lg px-8 py-4 transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <div className="relative">
            <div className="glass-card p-8 rounded-2xl border-white/20 glow-blue">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-sm text-gray-300">AI is scanning your inbox...</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Emails processed</span>
                    <span className="text-white">1,247</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subscriptions found</span>
                    <span className="text-white">43</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Time saved</span>
                    <span className="text-green-400">2.4 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
