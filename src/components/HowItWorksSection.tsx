
const steps = [
  {
    number: "01",
    title: "Sign in with Gmail",
    description: "Securely connect your Gmail account using Google's official authentication.",
    icon: "🔐"
  },
  {
    number: "02",
    title: "Let Puch scan your inbox",
    description: "Our AI analyzes your email patterns, subscriptions, and communication style.",
    icon: "🔍"
  },
  {
    number: "03",
    title: "Manage & Automate",
    description: "Set up rules, enable smart replies, and watch your inbox organize itself.",
    icon: "⚙️"
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="relative z-10 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get started in minutes with our simple three-step process.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 opacity-30"></div>
          
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Step number circle */}
                <div className="relative mx-auto mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-2xl font-bold glow-purple">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-sm font-bold border border-white/20">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-2xl font-semibold mb-4 text-white">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-6 text-purple-400 text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
