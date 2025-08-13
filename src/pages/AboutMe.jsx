import { motion } from 'framer-motion';
import { Code, Github, ExternalLink, Mail, Linkedin, Heart } from 'lucide-react';
import { useEffect } from 'react';

const AboutMe = () => {
  // Handle anchor scrolling when navigating to /about-me#section
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, []);

  return (
    <div className="min-h-screen cinema-gradient pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* About Me Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl font-bold mb-6 text-white">About Me</h1>
          <p className="text-white mb-6 text-lg leading-relaxed">
            This is a placeholder for your personal bio. You can share your background, your love for movies,
            and what inspired you to build Triple Feature. Add links or images later if you like.
          </p>
          <div className="bg-cinema-dark border border-cinema-gray rounded-lg p-6">
            <p className="text-white text-center italic">
              "Film is truth 24 frames per second." — Jean-Luc Godard
            </p>
          </div>
        </motion.div>

        {/* Projects Section */}
        <motion.div
          id="projects"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <Code size={32} className="text-accent-purple" />
            <h2 className="text-3xl font-bold text-white">Projects</h2>
          </div>
          
          <div className="bg-cinema-dark/50 border border-cinema-light/20 rounded-2xl p-8 text-center mb-8">
            <div className="text-6xl mb-6">🚧</div>
            <h3 className="text-2xl font-bold text-white mb-4">Projects – TBD</h3>
            <p className="text-white/70 text-lg mb-6">
              I'm currently working on some exciting projects. Check back soon for updates!
            </p>
            
            {/* GitHub Link */}
            <div className="flex justify-center">
              <a
                href="https://github.com/calebabraham21"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cinema-gray hover:bg-cinema-light border border-cinema-light rounded-lg text-white transition-all duration-200 hover:scale-105"
              >
                <Github size={20} />
                <span>View My GitHub</span>
                <ExternalLink size={16} className="text-white/60" />
              </a>
            </div>
          </div>

          {/* Future Project Placeholders */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Project 1 */}
            <div className="bg-cinema-dark/30 border border-cinema-light/20 rounded-xl p-6">
              <div className="text-3xl mb-3">🎬</div>
              <h3 className="text-lg font-semibold text-white mb-2">Triple Feature</h3>
              <p className="text-white/70 text-sm">
                A movie recommendation app that helps you discover your next favorite film.
              </p>
            </div>

            {/* Project 2 */}
            <div className="bg-cinema-dark/30 border border-cinema-light/20 rounded-xl p-6">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="text-lg font-semibold text-white mb-2">More Coming Soon</h3>
              <p className="text-white/70 text-sm">
                I'm always working on new ideas. Stay tuned for more projects!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          id="contact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Mail size={32} className="text-accent-blue" />
            <h2 className="text-3xl font-bold text-white">Contact</h2>
          </div>
          
          <div className="bg-cinema-dark/50 border border-cinema-light/20 rounded-2xl p-8">
            <p className="text-white/80 text-lg mb-8 text-center">
              Let's connect! I'm always interested in hearing about new opportunities, 
              collaborations, or just chatting about movies and technology.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <a
                href="mailto:calebabraham21@gmail.com"
                className="flex items-center gap-3 p-4 rounded-lg bg-cinema-gray hover:bg-cinema-light transition-colors group"
              >
                <Mail size={24} className="text-accent-red" />
                <div>
                  <div className="text-sm font-medium text-white group-hover:text-accent-red transition-colors">Email</div>
                  <div className="text-xs text-white/70">calebabraham21@gmail.com</div>
                </div>
              </a>
              
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/caleb-abraham-3900b9281/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg bg-cinema-gray hover:bg-cinema-light transition-colors group"
              >
                <Linkedin size={24} className="text-accent-blue" />
                <div>
                  <div className="text-sm font-medium text-white group-hover:text-accent-blue transition-colors">LinkedIn</div>
                  <div className="text-xs text-white/70">Professional profile</div>
                </div>
                <ExternalLink size={16} className="text-white/50" />
              </a>
              
              {/* GitHub */}
              <a
                href="https://github.com/calebabraham21"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg bg-cinema-gray hover:bg-cinema-light transition-colors group"
              >
                <Github size={24} className="text-accent-purple" />
                <div>
                  <div className="text-sm font-medium text-white group-hover:text-accent-purple transition-colors">GitHub</div>
                  <div className="text-xs text-white/70">Code repositories</div>
                </div>
                <ExternalLink size={16} className="text-white/60" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutMe;


