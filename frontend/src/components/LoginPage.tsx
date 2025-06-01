
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const LoginPage = () => {
  const [step, setStep] = useState<'google' | 'phone' | 'otp'>('google');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  const handleGoogleLogin = () => {
    // Simulate Google login
    setStep('phone');
  };

  const handlePhoneSubmit = () => {
    setStep('otp');
  };

  const handleOtpSubmit = () => {
    // Navigate to dashboard
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen aurora-bg text-white relative overflow-hidden flex items-center justify-center">
      {/* Floating particles */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <Card className="glass-card border-white/20 animate-fade-in">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Puch
              </span>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              {step === 'google' && 'Login to Continue'}
              {step === 'phone' && 'Verify Your Phone'}
              {step === 'otp' && 'Enter Verification Code'}
            </CardTitle>
            <p className="text-gray-400 mt-2">
              {step === 'google' && 'Securely connect your Gmail'}
              {step === 'phone' && 'We need to verify your phone number'}
              {step === 'otp' && `Code sent to ${phoneNumber}`}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 'google' && (
              <div className="space-y-4 animate-scale-in">
                <Button
                  onClick={handleGoogleLogin}
                  className="w-full bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300 py-6 glow-purple"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </Button>
                
                <div className="flex items-center text-center text-sm text-gray-400">
                  <div className="flex-1 h-px bg-gray-600"></div>
                  <div className="px-4">🔒 Google handles all authentication</div>
                  <div className="flex-1 h-px bg-gray-600"></div>
                </div>
              </div>
            )}

            {step === 'phone' && (
              <div className="space-y-4 animate-slide-in-right">
                <div>
                  <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                  <div className="flex mt-2">
                    <select className="bg-gray-800 border border-gray-600 rounded-l-md px-3 py-2 text-white">
                      <option>+1</option>
                      <option>+44</option>
                      <option>+91</option>
                    </select>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="rounded-l-none bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                    />
                  </div>
                </div>
                <Button
                  onClick={handlePhoneSubmit}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  Continue
                </Button>
              </div>
            )}

            {step === 'otp' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <Label htmlFor="otp" className="text-gray-300">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="mt-2 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>
                <Button
                  onClick={handleOtpSubmit}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  Verify & Continue
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white"
                  onClick={() => setStep('phone')}
                >
                  Resend Code
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <span className="mx-2">•</span>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
