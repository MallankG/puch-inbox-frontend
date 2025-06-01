import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/10 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Puch
              </span>
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Transform your email chaos into organized efficiency with AI-powered automation. 
              Focus on what matters most while Puch handles your inbox.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#api" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              <li><a href="#integrations" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="#blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#careers" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <a
              href="https://github.com/mallankg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Made by Mallank Gogri
            </a>
            <a
              href="https://github.com/mallankg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-400 hover:text-white transition-colors text-sm"
            >
              <FaGithub className="mr-1" />MallankG
            </a>
          </div>
          
          <div className="text-gray-400 text-sm">
            © 2025 Puch. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
