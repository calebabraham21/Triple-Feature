import { Github, Linkedin, Mail } from 'lucide-react';
import TMDBLogo from '../assets/TMDB_logo.svg';

const Footer = () => {
  return (
    <footer className="border-t border-smoke bg-paper mt-auto">
      <div className="max-w-5xl mx-auto px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-fog">
          <div className="flex items-center gap-2">
            <img src={TMDBLogo} alt="TMDB" className="w-5 h-5 opacity-50" />
            <span>Powered by TMDB API. Not endorsed by TMDB.</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Made by Caleb Abraham · © {new Date().getFullYear()} Triple Feature</span>
            <span className="text-ash">·</span>
            <a href="/terms" className="underline underline-offset-2 hover:text-ink transition-colors">
              Terms
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/calebabraham21"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-ink transition-colors"
            >
              <Github size={15} />
            </a>
            <a
              href="https://www.linkedin.com/in/caleb-abraham-3900b9281/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-ink transition-colors"
            >
              <Linkedin size={15} />
            </a>
            <a
              href="mailto:calebabraham21@gmail.com"
              aria-label="Email"
              className="hover:text-ink transition-colors"
            >
              <Mail size={15} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
