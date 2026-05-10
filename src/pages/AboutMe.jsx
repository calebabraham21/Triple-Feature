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
    <div className="min-h-screen app-gradient ">
      <div className="max-w-4xl mx-auto px-6 sm:px-6 py-12">
        {/* About Triple Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="font-cinema text-3xl tracking-wide mb-4 text-white">About Triple Feature</h1>
          <p className="text-white mb-4 text-base leading-relaxed">
            Triple Feature exists to end the eternal scroll. Tell it a vibe (genre, decade, a couple preferences) and it hands you three strong picks. No 45-minute debates, no "maybe later," just press play.
          </p>
          <p className="text-white/90 mb-4 text-base leading-relaxed">
            The app leans on TMDB data, some sensible filtering, and a bit of taste. It's intentionally small and fast, closer to a friend with good recs than a firehose of thumbnails. Also doubles as my sandbox for trying out UI ideas and seeing what actually feels good to use.
          </p>
          <div className="border-t border-b border-cinema-gray/50 py-6 my-4">
            <p className="text-white/80 text-center italic">
              "Life is very, very complicated, and so films should be allowed to be, too." — David Lynch
            </p>
          </div>
        </motion.div>

        {/* Who I Am */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-16"
        >
          <h2 className="font-cinema text-2xl tracking-wide mb-4 text-white">Who I Am</h2>
          <p className="text-white mb-3 text-base leading-relaxed">
            I work in MarTech focused on retention, engagement, and personalization across email, push, and in-app. Most of my work is in Salesforce Marketing Cloud using SQL, AMPscript, APIs, and behavioral data to build segmentation, automation, and large-scale personalized campaigns.
          </p>
          <p className="text-white/90 text-base leading-relaxed">
            Outside of work I'm a CS student and have gotten really interested in data engineering/data science, especially customer data architecture, analytics, and large-scale automation systems. I'm also really into movies, music, esports/Counter-Strike, and lately have been getting into golf and building small side projects/web apps to learn new tech and experiment with ideas.
          </p>
        </motion.div>

        {/* Tech Stack Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-cinema-gray rounded-lg flex items-center justify-center">
              <Code size={20} className="text-white" />
            </div>
            <h2 className="font-cinema text-2xl tracking-wide text-white">Tech Stack</h2>
          </div>
          
          <div className="mb-2">
            <p className="text-white/60 text-base mb-6">
              Powered by modern web tech like Next.js, Supabase, and Tailwind — and, let’s be honest, Cursor carried the team.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Frontend */}
              <div className="p-4 text-center">
                <div className="text-2xl mb-2">⚛️</div>
                <h3 className="text-sm font-semibold text-white mb-1">React</h3>
                <p className="text-xs text-white/60">Frontend framework</p>
              </div>

              {/* Styling */}
              <div className="p-4 text-center">
                <div className="text-2xl mb-2">🎨</div>
                <h3 className="text-sm font-semibold text-white mb-1">Tailwind CSS</h3>
                <p className="text-xs text-white/60">Utility-first CSS</p>
              </div>

              {/* Backend */}
              <div className="p-4 text-center">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="text-sm font-semibold text-white mb-1">Supabase</h3>
                <p className="text-xs text-white/60">Read-only Editorial data</p>
              </div>

              {/* API */}
              <div className="p-4 text-center">
                <div className="text-2xl mb-2">🎬</div>
                <h3 className="text-sm font-semibold text-white mb-1">TMDB API</h3>
                <p className="text-xs text-white/60">Movie database</p>
              </div>

              {/* Animations */}
              <div className="p-4 text-center">
                <div className="text-2xl mb-2">✨</div>
                <h3 className="text-sm font-semibold text-white mb-1">Framer Motion</h3>
                <p className="text-xs text-white/60">Smooth animations</p>
              </div>

              {/* Build Tool */}
              <div className="p-4 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="text-sm font-semibold text-white mb-1">Vite</h3>
                <p className="text-xs text-white/60">Fast build tool</p>
              </div>

              {/* Icons */}
              <div className="p-4 text-center">
                <div className="text-2xl mb-2">🔧</div>
                <h3 className="text-sm font-semibold text-white mb-1">Lucide React</h3>
                <p className="text-xs text-white/60">Icon library</p>
              </div>

              {/* Deployment */}
              <div className="p-4 text-center">
                <div className="text-2xl mb-2">🌐</div>
                <h3 className="text-sm font-semibold text-white mb-1">Vercel</h3>
                <p className="text-xs text-white/60">Hosting platform</p>
              </div>
            </div>
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
          <div className="flex items-center gap-3 mb-4">
            <Code size={24} className="text-accent-purple" />
            <h2 className="font-cinema text-2xl tracking-wide text-white">Projects</h2>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🚧</div>
            <p className="text-white/70 text-base mb-4">
            Projects in the works… they’ll show up here soon.            </p>
            
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
                      <div className="grid md:grid-cols-2 gap-4">
              {/* Project 1 */}
              <div className="p-4">
                <div className="text-2xl mb-2">🎬</div>
                <h3 className="text-base font-semibold text-white mb-2">Triple Feature</h3>
                <p className="text-white/70 text-sm">
                  Uhh yeah, this site right here. A movie recommendation app that helps you discover your next favorite film.
                </p>
              </div>

              {/* Project 2 */}
              <div className="p-4">
                <div className="text-2xl mb-2">💡</div>
                <h3 className="text-base font-semibold text-white mb-2">More Coming Soon</h3>
               
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
          <div className="flex items-center gap-3 mb-4">
            <Mail size={24} className="text-accent-blue" />
            <h2 className="font-cinema text-2xl tracking-wide text-white">Contact</h2>
          </div>
          
          <div className="mb-6">
            <p className="text-white/60 text-base mb-6">
              Let’s connect — open to new opportunities, collaborations, or chats about film and tech.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="flex items-center gap-3 p-3 rounded-lg border border-cinema-gray/40">
                <Mail size={20} className="text-accent-red" />
                <div>
                  <div className="text-sm font-medium text-white">Email</div>
                  <div className="text-xs text-white/70">calebabraham21@gmail.com</div>
                </div>
              </div>
              
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/caleb-abraham-3900b9281/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-cinema-gray/40 hover:border-accent-blue/40 transition-colors group"
              >
                <Linkedin size={20} className="text-accent-blue" />
                <div>
                  <div className="text-sm font-medium text-white group-hover:text-accent-blue transition-colors">LinkedIn</div>
                  <div className="text-xs text-white/70">Professional profile</div>
                </div>
                <ExternalLink size={14} className="text-white/50" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutMe;


