import { motion } from 'framer-motion';
import { Heart, Github, Linkedin, Mail } from 'lucide-react';
import TMDBLogo from '../assets/TMDB_logo.svg';

const Footer = () => {
  return (
    <footer className="bg-cinema-dark/80 border-t border-cinema-light/20 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* TMDB Attribution */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <img 
                src={TMDBLogo} 
                alt="TMDB Logo" 
                className="w-8 h-8"
              />
              <span className="text-white/70 text-sm">
                Powered by TMDB API
              </span>
            </div>
            <p className="text-white/50 text-xs">
              This product uses the TMDB API but is not endorsed or certified by TMDB
            </p>
          </div>

          {/* Center - Made with Love */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
              <span>Made by Caleb Abraham</span>
            </div>
            <p className="text-white/50 text-xs mt-1">
              © 2024 Triple Feature
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center md:justify-end gap-4">
            <a
              href="https://github.com/calebabraham21"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-cinema-gray hover:bg-cinema-light rounded-lg transition-colors group"
              aria-label="GitHub"
            >
              <Github size={18} className="text-white group-hover:text-accent-purple transition-colors" />
            </a>
            <a
              href="https://www.linkedin.com/in/caleb-abraham-3900b9281/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-cinema-gray hover:bg-cinema-light rounded-lg transition-colors group"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} className="text-white group-hover:text-accent-blue transition-colors" />
            </a>
            <a
              href="mailto:calebabraham21@gmail.com"
              className="p-2 bg-cinema-gray hover:bg-cinema-light rounded-lg transition-colors group"
              aria-label="Email"
            >
              <Mail size={18} className="text-white group-hover:text-accent-red transition-colors" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cinema-light/10 mt-6 pt-6 text-center">
          <p className="text-white/40 text-xs">
            Discover your next favorite movie with AI-powered recommendations
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
