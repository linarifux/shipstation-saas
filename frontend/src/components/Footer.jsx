import { Link } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  function handleSubscribe(e) {
    e.preventDefault();
    alert(`Subscribed: ${email}`);
    setEmail("");
  }

  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950 pt-16 pb-10 text-slate-300">
      <div className="mx-auto max-w-6xl px-6">

        {/* Newsletter Section */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-10 shadow-lg shadow-slate-900/60 md:px-10">
          <div className="grid gap-10 md:grid-cols-2">
            
            {/* Left */}
            <div>
              <h3 className="text-xl font-semibold text-slate-50 md:text-2xl">
                Stay updated with ShipFlow
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Get updates on new automation features, improvements, and tips
                to power up your ShipStation workflow.
              </p>
            </div>

            {/* Right */}
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-sm text-slate-100 placeholder-slate-400 shadow-sm shadow-slate-900/60 focus:border-cyan-400 focus:outline-none focus:ring focus:ring-cyan-500/20"
              />

              <button
                type="submit"
                className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-md shadow-cyan-500/30 transition hover:bg-cyan-400"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

        {/* Top Grid: Brand + Navigation */}
        <div className="mt-16 grid gap-12 md:grid-cols-5">

          {/* Brand Column */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-slate-50 tracking-tight">
              ShipFlow
            </h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Automate your ShipStation operations with custom fields, rules, analytics, and
              powerful background workflows.
            </p>

            {/* Social Icons */}
            <div className="mt-5 flex gap-4">
              <SocialIcon type="twitter" />
              <SocialIcon type="github" />
              <SocialIcon type="linkedin" />
            </div>
          </div>

          {/* Product Links */}
          <FooterColumn
            title="Product"
            links={[
              { label: "Dashboard", to: "/shipments" },
              { label: "Automation", to: "/automation" },
              { label: "Analytics", to: "#" },
              { label: "Integrations", to: "#" },
            ]}
          />

          {/* Company Links */}
          <FooterColumn
            title="Company"
            links={[
              { label: "About", to: "#" },
              { label: "Customers", to: "#" },
              { label: "Careers", to: "#" },
              { label: "Contact", to: "#" },
            ]}
          />

          {/* Legal Links */}
          <FooterColumn
            title="Legal"
            links={[
              { label: "Privacy Policy", to: "#" },
              { label: "Terms of Service", to: "#" },
              { label: "Security", to: "#" },
              { label: "GDPR", to: "#" },
            ]}
          />
        </div>

        {/* Bottom Row */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-slate-800 pt-6 text-sm md:flex-row">
          <p className="text-slate-500">
            © {new Date().getFullYear()} ShipFlow — All rights reserved.
          </p>

          <div className="flex gap-6 text-slate-400">
            <a href="#" className="hover:text-slate-200">Status</a>
            <a href="#" className="hover:text-slate-200">API Docs</a>
            <a href="#" className="hover:text-slate-200">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* --------------------------- Reusable Components --------------------------- */

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-slate-200">{title}</h4>
      <ul className="space-y-2 text-sm">
        {links.map((l, idx) => (
          <li key={idx}>
            <Link to={l.to} className="hover:text-cyan-400">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ type }) {
  const icons = {
    twitter: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.487 11.24H16.15l-5.312-6.937L4.65 21.75H1.34l7.73-8.83L.89 2.25h6.064l4.777 6.273L18.244 2.25z" />
      </svg>
    ),
    github: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.95.6.1.8-.25.8-.55v-1.95c-3.24.7-3.93-1.4-3.93-1.4-.55-1.4-1.34-1.8-1.34-1.8-1.1-.75.08-.74.08-.74 1.23.1 1.87 1.25 1.87 1.25 1.08 1.85 2.82 1.32 3.5 1 .1-.75.42-1.3.76-1.6-2.66-.3-5.47-1.34-5.47-5.9 0-1.3.48-2.4 1.25-3.25-.14-.3-.56-1.53.1-3.17 0 0 1.05-.34 3.35 1.27a11.7 11.7 0 0 1 6.04 0c2.3-1.6 3.33-1.27 3.33-1.27.66 1.64.24 2.87.12 3.17.78.85 1.25 1.95 1.25 3.25 0 4.58-2.82 5.6-5.5 5.9.43.38.83 1.1.83 2.2v3.3c0 .3.2.65.8.55A11.53 11.53 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
      </svg>
    ),
    linkedin: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554V14.89c0-1.326-.027-3.034-1.848-3.034-1.853 0-2.136 1.445-2.136 2.939v5.657H9.356V9h3.414v1.561h.049c.476-.9 1.635-1.848 3.366-1.848 3.598 0 4.263 2.37 4.263 5.455v6.284zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM6.99 20.452H3.68V9h3.31v11.452zM22.225 0H1.771C.792 0 .002.774.002 1.73v20.54c0 .956.79 1.73 1.77 1.73h20.453c.98 0 1.776-.774 1.776-1.73V1.73C24 .774 23.205 0 22.225 0z" />
      </svg>
    ),
  };

  return (
    <a
      href="#"
      className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-600 hover:text-white transition"
    >
      {icons[type]}
    </a>
  );
}
