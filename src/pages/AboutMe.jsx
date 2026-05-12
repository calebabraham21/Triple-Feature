import { motion } from 'framer-motion';
import { Code, Github, ExternalLink, Mail, Linkedin } from 'lucide-react';
import { useEffect } from 'react';

const AboutMe = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12">

        {/* About Triple Feature */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <div className="wizard-step-label mb-3">The project</div>
          <h1 className="font-cinema text-2xl sm:text-3xl font-medium text-ink mb-5">About Triple Feature</h1>
          <p className="text-sm text-ink leading-relaxed mb-4">
            Triple Feature exists to end the eternal scroll. Tell it a vibe — genre, decade, a couple preferences — and it hands you three strong picks. No 45-minute debates, no "maybe later," just press play.
          </p>
          <p className="text-sm text-fog leading-relaxed mb-4">
            The app leans on TMDB data, some sensible filtering, and a bit of taste. It's intentionally small and fast — closer to a friend with good recs than a firehose of thumbnails. Also doubles as my sandbox for trying out UI ideas and seeing what actually feels good to use.
          </p>
          <div className="border-t border-b border-smoke py-5 my-2">
            <p className="text-sm text-fog text-center italic">
              "Life is very, very complicated, and so films should be allowed to be, too." — David Lynch
            </p>
          </div>
        </motion.section>

        {/* Who I Am */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-14"
        >
          <div className="wizard-step-label mb-3">Background</div>
          <h2 className="font-cinema text-xl sm:text-2xl font-medium text-ink mb-5">Who I Am</h2>
          <p className="text-sm text-ink leading-relaxed mb-4">
            I work in MarTech focused on retention, engagement, and personalization across email, push, and in-app. Most of my work is in Salesforce Marketing Cloud using SQL, AMPscript, APIs, and behavioral data to build segmentation, automation, and large-scale personalized campaigns.
          </p>
          <p className="text-sm text-ink leading-relaxed">
            Outside of work I'm a CS student getting interested in data engineering and data science — especially customer data architecture, analytics, and large-scale automation. I'm also into movies, music, esports, golf, and building small side projects to learn new tech and experiment with ideas.
          </p>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-14"
        >
          <div className="wizard-step-label mb-3">Built with</div>
          <h2 className="font-cinema text-xl sm:text-2xl font-medium text-ink mb-2">Tech Stack</h2>
          <p className="text-sm text-fog mb-6">
            Modern web tech — and, let's be honest, Cursor carried the team.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-smoke border border-smoke rounded overflow-hidden">
            {[
              { emoji: '⚛️', name: 'React', desc: 'Frontend framework' },
              { emoji: '🎨', name: 'Tailwind CSS', desc: 'Utility-first CSS' },
              { emoji: '🚀', name: 'Supabase', desc: 'Read-only editorial data' },
              { emoji: '🎬', name: 'TMDB API', desc: 'Movie database' },
              { emoji: '✨', name: 'Framer Motion', desc: 'Animations' },
              { emoji: '⚡', name: 'Vite', desc: 'Build tool' },
              { emoji: '🔧', name: 'Lucide React', desc: 'Icon library' },
              { emoji: '🌐', name: 'Vercel', desc: 'Hosting' },
            ].map(({ emoji, name, desc }) => (
              <div key={name} className="bg-frame p-4 text-center">
                <div className="text-xl mb-2">{emoji}</div>
                <div className="text-xs font-semibold text-ink mb-0.5">{name}</div>
                <div className="text-xs text-fog">{desc}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Projects */}
        <motion.section
          id="projects"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-14"
        >
          <div className="wizard-step-label mb-3">Work</div>
          <h2 className="font-cinema text-xl sm:text-2xl font-medium text-ink mb-5">Projects</h2>

          <div className="border-t border-smoke">
            <div className="py-5 border-b border-smoke">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-ink mb-1">Triple Feature</h3>
                  <p className="text-sm text-fog">
                    Uhh yeah, this site right here. A movie recommendation app that helps you pick something to watch without the decision spiral.
                  </p>
                </div>
                <span className="text-lg flex-shrink-0">🎬</span>
              </div>
            </div>
            <div className="py-5 border-b border-smoke">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-fog mb-1">More coming soon</h3>
                  <p className="text-sm text-fog/70">Working on a few things.</p>
                </div>
                <span className="text-lg flex-shrink-0">💡</span>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <a
              href="https://github.com/calebabraham21"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-fog hover:text-ink transition-colors underline underline-offset-2"
            >
              <Github size={15} />
              View my GitHub
              <ExternalLink size={12} className="opacity-60" />
            </a>
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="wizard-step-label mb-3">Get in touch</div>
          <h2 className="font-cinema text-xl sm:text-2xl font-medium text-ink mb-2">Contact</h2>
          <p className="text-sm text-fog mb-6">
            Open to new opportunities, collaborations, or chats about film and tech.
          </p>

          <div className="border-t border-smoke">
            <a
              href="mailto:calebabraham21@gmail.com"
              className="flex items-center justify-between py-4 border-b border-smoke group"
            >
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-fog" />
                <div>
                  <div className="text-sm font-medium text-ink">Email</div>
                  <div className="text-xs text-fog">calebabraham21@gmail.com</div>
                </div>
              </div>
              <ExternalLink size={13} className="text-fog/50 group-hover:text-fog transition-colors" />
            </a>

            <a
              href="https://www.linkedin.com/in/caleb-abraham-3900b9281/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-4 border-b border-smoke group"
            >
              <div className="flex items-center gap-3">
                <Linkedin size={16} className="text-fog" />
                <div>
                  <div className="text-sm font-medium text-ink group-hover:opacity-70 transition-opacity">LinkedIn</div>
                  <div className="text-xs text-fog">Professional profile</div>
                </div>
              </div>
              <ExternalLink size={13} className="text-fog/50 group-hover:text-fog transition-colors" />
            </a>

            <a
              href="https://github.com/calebabraham21"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-4 group"
            >
              <div className="flex items-center gap-3">
                <Github size={16} className="text-fog" />
                <div>
                  <div className="text-sm font-medium text-ink group-hover:opacity-70 transition-opacity">GitHub</div>
                  <div className="text-xs text-fog">calebabraham21</div>
                </div>
              </div>
              <ExternalLink size={13} className="text-fog/50 group-hover:text-fog transition-colors" />
            </a>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default AboutMe;
