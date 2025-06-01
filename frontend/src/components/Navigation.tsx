
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="relative z-10 flex items-center justify-between p-6 lg:px-12">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">P</span>
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Puch
        </span>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        <a href="#features" className="text-gray-300 hover:text-white transition-colors">
          Features
        </a>
        <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
          How it Works
        </a>
        <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
          Pricing
        </a>
        <Button 
          variant="outline" 
          className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:text-white transition-all duration-300"
          onClick={() => window.location.href = '/login'}
        >
          Login with Google
        </Button>
      </div>

      {/* Mobile menu button */}
      <Button 
        variant="ghost" 
        className="md:hidden text-white"
        size="sm"
      >
        ☰
      </Button>
    </nav>
  );
};

export default Navigation;
