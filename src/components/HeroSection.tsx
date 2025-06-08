import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative z-10 pt-20 pb-16 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left animate-fade-in">
          <div className="mb-4 animate-fade-in">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
              🚀 Trusted by 10,000+ users
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Inbox.
            <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-scale-in">
              Automated.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto lg:mx-0 animate-fade-in">
            Transform your email experience with AI-powered automation. Unsubscribe from spam, organize important messages, and respond intelligently - all without lifting a finger.
          </p>
          
          <div className="mb-8 animate-fade-in">
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span>Setup in 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span>Privacy focused</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-in-right">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4 glow-purple hover-scale transition-all duration-300"
              onClick={() => window.location.href = '/login'}
            >
              Login with Google
            </Button>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4 glow-purple hover-scale transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>

          <div className="mt-8 animate-fade-in">
            <p className="text-xs text-gray-500 mb-3">Join thousands of users who save hours every week</p>
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 border-2 border-gray-800 flex items-center justify-center text-xs font-semibold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-400">
                <span className="text-yellow-400">★★★★★</span> 4.9/5 from 500+ reviews
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block animate-fade-in">
          <div className="relative space-y-6">
            {/* Main stats card */}
            <div className="glass-card p-6 rounded-2xl border-white/20 glow-blue">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-sm text-gray-300">AI is scanning your inbox...</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Emails processed</span>
                    <span className="text-white font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subscriptions found</span>
                    <span className="text-white font-semibold">43</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Time saved</span>
                    <span className="text-green-400 font-semibold">2.4 hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick benefits */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-xl border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">99%</div>
                  <div className="text-xs text-gray-400">Spam Blocked</div>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">5min</div>
                  <div className="text-xs text-gray-400">Daily Savings</div>
                </div>
              </div>
            </div>

            {/* Live activity feed */}
            <div className="glass-card p-4 rounded-xl border-white/10">
              <div className="text-xs text-gray-400 mb-3">Recent Activity</div>
              <div className="space-y-2">
                <div className="flex items-center text-xs">
                  <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                  <span className="text-gray-300">Unsubscribed from Newsletter XYZ</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                  <span className="text-gray-300">Organized 12 emails to folders</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                  <span className="text-gray-300">Auto-replied to 3 messages</span>
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
