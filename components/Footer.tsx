import Link from "next/link";
import { FaGithub, FaReact, FaAws } from "react-icons/fa";
import { SiNextdotjs, SiTypescript, SiTailwindcss } from "react-icons/si";
import { RiTwitterXFill } from "react-icons/ri";
import { HiDocumentText } from "react-icons/hi";
import ChefHatIcon from "@/components/ChefHatIcon";

export default function Footer() {
  return (
    <footer className="px-6 py-12 border-t border-card mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Left: Project Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
              <ChefHatIcon className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">ChefGPT</span>
            </div>
            <p className="text-muted text-sm">A modern AI recipe generator. Discover, explore, and create delicious recipes with artificial intelligence.</p>
          </div>

          {/* Center: Tech Stack */}
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-semibold mb-4 text-foreground">Built With</h3>
            <div className="flex flex-wrap justify-center gap-6 text-muted">
              <div className="flex flex-col items-center gap-1 transition-colors hover:text-primary cursor-default">
                <SiNextdotjs className="w-6 h-6" />
                <span className="text-xs">Next.js</span>
              </div>
              <div className="flex flex-col items-center gap-1 transition-colors hover:text-primary cursor-default">
                <FaReact className="w-6 h-6" />
                <span className="text-xs">React</span>
              </div>
              <div className="flex flex-col items-center gap-1 transition-colors hover:text-primary cursor-default">
                <SiTypescript className="w-6 h-6" />
                <span className="text-xs">TypeScript</span>
              </div>
              <div className="flex flex-col items-center gap-1 transition-colors hover:text-primary cursor-default">
                <SiTailwindcss className="w-6 h-6" />
                <span className="text-xs">Tailwind</span>
              </div>
              <div className="flex flex-col items-center gap-1 transition-colors hover:text-primary cursor-default">
                <FaAws className="w-6 h-6" />
                <span className="text-xs">AWS</span>
              </div>
            </div>
          </div>

          {/* Right: Connect */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-sm font-semibold mb-4 text-foreground">Connect</h3>
            <div className="flex flex-col gap-3 items-center md:items-end">
              <p className="text-muted text-sm">Keane Putra Setiawan</p>
              <p className="text-muted text-xs">Full-Stack Developer</p>
              <div className="flex gap-4 mt-2">
                <Link href="https://github.com/kin-hero/ai-recipe" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition" aria-label="GitHub">
                  <FaGithub className="w-5 h-5" />
                </Link>
                <Link
                  href="https://www.keanesetiawan.com/projects/chefgpt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-primary transition flex items-center gap-1 text-xs"
                >
                  <HiDocumentText className="w-4 h-4" />
                  Case Study
                </Link>
                <Link href="https://x.com/buildwithKin" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition" aria-label="X (Twitter)">
                  <RiTwitterXFill className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="border-t border-card pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-sm">© 2025 ChefGPT. Open Source Portfolio Project.</p>
          <p className="text-muted text-xs flex items-center gap-1">
            Made with <span className="text-primary">❤️</span> for learning
          </p>
        </div>
      </div>
    </footer>
  );
}
