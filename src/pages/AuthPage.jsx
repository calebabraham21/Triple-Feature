import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  // Debug component mount
  useEffect(() => {
    // Component mounted successfully
  }, [location]);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthPage: Error checking session:', error);
          return;
        }
        
        // Only redirect if there's a confirmed active session with a valid user
        if (session && session.user && session.user.id) {
          // Ensure profile exists for authenticated user
          await ensureProfileExists(session.user.id);
          navigate('/');
        }
      } catch (error) {
        console.error('AuthPage: Error in checkAuth:', error);
      }
    };
    
    // Add a small delay to ensure any pending auth state changes have settled
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  // Listen for auth state changes to handle profile creation after email confirmation
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, checking for pending profile...');
        
        // Check if there's a pending profile to create
        const pendingProfile = sessionStorage.getItem('pendingProfile');
        if (pendingProfile) {
          try {
            console.log('Found pending profile, creating...');
            const profileData = JSON.parse(pendingProfile);
            
            const { data, error } = await supabase
              .from('profiles')
              .upsert({
                user_id: session.user.id,
                first_name: profileData.firstName,
                last_name: profileData.lastName,
                phone: profileData.phone
              }, {
                onConflict: 'user_id'
              });

            if (error) {
              console.error('Error creating pending profile:', error);
              throw error;
            }

            console.log('Profile created successfully:', data);
            sessionStorage.removeItem('pendingProfile');
            
            // Verify the profile was created
            await verifyProfileCreated(session.user.id);
            
          } catch (profileError) {
            console.error('Failed to create pending profile:', profileError);
            setError(`Profile setup failed: ${profileError.message}`);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Ensure profile exists for authenticated user
  const ensureProfileExists = async (userId) => {
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!existingProfile) {
        console.log('No profile found, creating minimal profile...');
        // Create a minimal profile if none exists
        await supabase
          .from('profiles')
          .insert({
            user_id: userId,
            first_name: '',
            last_name: '',
            phone: null
          });
      }
    } catch (error) {
      console.error('Error ensuring profile exists:', error);
    }
  };

  // Verify profile was created and log the data
  const verifyProfileCreated = async (userId) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error verifying profile:', error);
        return;
      }

      console.log('Profile verification - Current profile data:', profile);
      
      if (profile.first_name && profile.last_name) {
        console.log('✅ Profile created successfully with names:', {
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone
        });
      } else {
        console.warn('⚠️ Profile exists but names are empty:', profile);
      }
    } catch (error) {
      console.error('Error in profile verification:', error);
    }
  };

  // Validation functions
  const validateForm = () => {
    const errors = {};

    // Only validate firstName and lastName for Sign Up mode
    if (isSignUp) {
      if (!firstName.trim()) {
        errors.firstName = 'First name is required';
      }

      if (!lastName.trim()) {
        errors.lastName = 'Last name is required';
      }

      // Phone validation (optional) - only for Sign Up
      if (phone.trim() && !/^[\+]?[1-9][\d]{0,15}$/.test(phone.trim())) {
        errors.phone = 'Please enter a valid phone number (e.g., +1234567890 or 1234567890)';
      }
    }

    // Email and password validation for both modes
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create or update profile with robust error handling
  const upsertProfile = async (userId) => {
    try {
      console.log('Upserting profile for user:', userId);
      console.log('Profile data:', {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || null
      });

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim() || null
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Supabase upsert error:', error);
        throw error;
      }

      console.log('Profile upsert successful:', data);
      
      // Verify the profile was actually written
      await verifyProfileCreated(userId);
      
      return true;
    } catch (error) {
      console.error('Error upserting profile:', error);
      throw new Error(`Failed to save profile information: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isSignUp) {
        console.log('Starting signup process...');
        
        // Sign up with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
        });

        if (error) {
          console.error('Signup error:', error);
          console.error('Error details:', {
            message: error.message,
            status: error.status,
            name: error.name,
            details: error.details
          });
          throw error;
        }

        console.log('Signup response:', data);

        if (data.user && !data.user.email_confirmed_at) {
          // Email confirmation required
          console.log('Email confirmation required, storing pending profile...');
          setEmailSent(true);
          setMessage('Check your email for the confirmation link!');
          
          // Store form data in sessionStorage for profile creation after confirmation
          const profileData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim() || null
          };
          
          sessionStorage.setItem('pendingProfile', JSON.stringify(profileData));
          console.log('Stored pending profile data:', profileData);
          
        } else if (data.user) {
          // Email confirmation not required, create profile immediately
          console.log('No email confirmation required, creating profile immediately...');
          try {
            await upsertProfile(data.user.id);
            console.log('Profile created successfully, navigating to home...');
            navigate('/');
          } catch (profileError) {
            console.error('Profile creation failed:', profileError);
            setError(`Account created but profile setup failed: ${profileError.message}`);
            // Still navigate to home since account was created
            navigate('/');
          }
        } else {
          console.warn('Signup successful but no user returned');
          setMessage('Account created successfully! Please check your email for confirmation.');
        }
      } else {
        // Sign in
        console.log('Starting signin process...');
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          console.error('Signin error:', error);
          // Provide a more user-friendly error message for common auth errors
          if (error.message === 'Invalid login credentials') {
            setError('Invalid email or password. Please check your credentials and try again.');
          } else {
            setError(error.message);
          }
          return;
        }

        console.log('Signin successful:', data);

        // Check if there's a pending profile to create
        const pendingProfile = sessionStorage.getItem('pendingProfile');
        if (pendingProfile) {
          try {
            console.log('Found pending profile during signin, creating...');
            const profileData = JSON.parse(pendingProfile);
            
            const { data: profileResult, error: profileError } = await supabase
              .from('profiles')
              .upsert({
                user_id: data.user.id,
                first_name: profileData.firstName,
                last_name: profileData.lastName,
                phone: profileData.phone
              }, {
                onConflict: 'user_id'
              });

            if (profileError) {
              console.error('Error creating pending profile during signin:', profileError);
              throw profileError;
            }

            console.log('Pending profile created during signin:', profileResult);
            sessionStorage.removeItem('pendingProfile');
            
            // Verify the profile was created
            await verifyProfileCreated(data.user.id);
            
          } catch (profileError) {
            console.error('Failed to create pending profile during signin:', profileError);
            setError(`Profile setup failed: ${profileError.message}`);
          }
        }

        navigate('/');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setPassword('');
    setError('');
    setMessage('');
    setFieldErrors({});
    setEmailSent(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  const goBack = () => {
    navigate('/');
  };

  if (emailSent) {
    return (
      <div className="min-h-screen cinema-gradient flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-cinema-dark rounded-2xl border border-cinema-light/30 p-8 text-center shadow-2xl backdrop-blur-sm"
        >
          <CheckCircle size={64} className="mx-auto text-green-400 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Check Your Email!</h2>
          <p className="text-white mb-6">
            We've sent a confirmation link to <strong className="text-white">{email}</strong>
          </p>
          <p className="text-sm text-white mb-8">
            Click the link in your email to complete your account setup. Your profile will be created automatically when you sign in for the first time.
          </p>
          <div className="space-y-3">
            <button
              onClick={goBack}
              className="w-full bg-accent-blue hover:bg-accent-blue/80 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-lg"
            >
              Back to Home
            </button>
            <button
              onClick={resetForm}
              className="w-full bg-cinema-gray hover:bg-cinema-light text-white font-medium py-2 px-4 rounded-lg transition-colors border border-cinema-light/20"
            >
              Try Different Email
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cinema-gradient flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-red/20 via-accent-purple/20 to-accent-blue/20" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,68,68,0.1)_0%,transparent_50%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-md w-full bg-cinema-dark rounded-2xl border border-cinema-light/30 p-8 shadow-2xl backdrop-blur-sm"
      >
        {/* Back Button */}
        <button
          onClick={goBack}
          className="absolute top-6 left-6 text-white hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-white">
            {isSignUp ? 'Join the movie community' : 'Sign in to your account'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <>
              {/* First Name */}
              <div className="relative">
                <User size={18} className="absolute left-3 top-3 text-white" />
                <input
                  type="text"
                  placeholder="First Name *"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:bg-white/15 transition-all duration-200 shadow-inner ${
                    fieldErrors.firstName ? 'border-red-400' : 'border-white/20 focus:border-accent-blue'
                  }`}
                  required
                />
                {fieldErrors.firstName && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{fieldErrors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="relative">
                <User size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Last Name *"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:bg-white/15 transition-all duration-200 shadow-inner ${
                    fieldErrors.lastName ? 'border-red-400' : 'border-white/20 focus:border-accent-blue'
                  }`}
                  required
                />
                {fieldErrors.lastName && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{fieldErrors.lastName}</p>
                )}
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:bg-white/15 transition-all duration-200 shadow-inner ${
                    fieldErrors.phone ? 'border-red-400' : 'border-white/20 focus:border-accent-blue'
                  }`}
                />
                {fieldErrors.phone && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{fieldErrors.phone}</p>
                )}
              </div>
            </>
          )}

          {/* Email */}
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:bg-white/15 transition-all duration-200 shadow-inner ${
                fieldErrors.email ? 'border-red-400' : 'border-white/20 focus:border-accent-blue'
              }`}
              required
            />
            {fieldErrors.email && (
              <p className="text-red-400 text-xs mt-1 ml-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-white" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:bg-white/15 transition-all duration-200 shadow-inner ${
                fieldErrors.password ? 'border-red-400' : 'border-white/20 focus:border-accent-blue'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-white hover:text-white transition-colors p-1 rounded hover:bg-white/10"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {fieldErrors.password && (
              <p className="text-red-400 text-xs mt-1 ml-1">{fieldErrors.password}</p>
            )}
          </div>

          {/* Error/Message Display */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200 text-sm backdrop-blur-sm">
              {error}
              {error.includes('Invalid email or password') && (
                <div className="mt-2 text-xs text-red-300">
                  💡 Make sure you're using the correct email and password combination.
                </div>
              )}
            </div>
          )}

          {message && (
            <div className="p-4 bg-green-500/20 border border-green-500/40 rounded-lg text-green-200 text-sm backdrop-blur-sm">
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-blue hover:bg-accent-blue/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                {isSignUp ? 'Creating Account...' : 'Signing in...'}
              </div>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center mt-8">
          <p className="text-white">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={toggleMode}
              className="ml-2 text-accent-blue hover:text-accent-blue/80 font-medium transition-colors underline decoration-accent-blue/30 hover:decoration-accent-blue/60"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        {/* Password Requirements for Sign Up */}
        {isSignUp && (
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-white mb-2">Password Requirements:</h3>
            <ul className="text-xs text-white space-y-1">
              <li>• At least 6 characters long</li>
              <li>• Can include letters, numbers, and symbols</li>
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthPage;
