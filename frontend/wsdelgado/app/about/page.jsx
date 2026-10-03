"use client";

import { Placeholder } from "@/components/Placeholder";
import { Check } from "lucide-react";
import groupImage from "./images/group.jpg";
import willie from './images/willie.jpg'
import jo from './images/jo.jpg'
import fructuso from './images/fructuso.jpg'
import maria from './images/maria.jpg'

export default function AboutPage() {
  const employees = [
    { name: "Willie S. Delgado", position: "General Manager / Owner", image: willie },
    { name: "Maria Theresa M. Delgado", position: "Operations Manager", image: maria },
    { name: "Jo May Delgado", position: "Accounts Executive", image: jo },
    // { name: "Cindy Aguilar", position: "Accounts Assistant" },
    // { name: "Nestor S. Delgado", position: "Project Coordinator" },
    { name: "Fructuso Remion", position: "Production Supervisor", image: fructuso },
    // { name: "Romeo B. Banas", position: "Construction Foreman" },
    // { name: "Jessy Espolong", position: "Lead Electrician" },
    // { name: "Gomer Olicia", position: "Lead Plumber" },
    // { name: "Roche Pacardo", position: "Lead Carpenter" },
    // { name: "Dennis Campos", position: "Lead Painter" },
    // { name: "Bogs Sinalampay", position: "Utility Driver" },
    // { name: "Fructuso Remion", position: "Utility Driver" },
  ]
  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white">
      {/* Hero */}
      <section className="relative py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About WSDelgado
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Building the future with integrity, quality, and precision. We are
            your trusted partners in construction.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our goal is to earn your trust, your confidence and improve all your future businesses.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We aim not only your current business but to make you a lifetime partners of ours.
We make sure that your business interests are perceived by our people, at all levels, to be as important to us as they are to you.
            </p>
          </div>
          <div className="aspect-[4/3] w-full">
            <img src={groupImage.src} alt="Mission Image" className="w-full h-full object-cover rounded-sm" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Integrity",
                description: "We do business honestly and transparently. Every commitment we make is honored, every price is fair, and every interaction is built on trust that we earn project after project."
              },
              {
                name: "Quality",
                description: "From foundation to finish, we hold our work to the highest standards. We use proven methods and premium materials to deliver structures that stand the test of time."
              },
              {
                name: "Innovation",
                description: "We continuously embrace modern techniques, tools, and technologies in construction to deliver smarter, faster, and more cost-effective solutions for our clients."
              }
            ].map((val) => (
              <div
                key={val.name}
                className="p-8 border border-white/20 rounded-sm hover:bg-white/5 transition-colors"
              >
                <div className="w-12 h-12 bg-white text-gray-900 rounded-full flex items-center justify-center mb-6">
                  <Check />
                </div>
                <h3 className="text-xl font-bold mb-4">{val.name}</h3>
                <p className="text-gray-400">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-gray-500">The experts behind our success</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {employees.map((member) => (
            <div key={member.name} className="group">
              <div className="aspect-[3/4] mb-4 overflow-hidden relative">
                <img src={member.image.src} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h4 className="font-bold text-lg">{member.name}</h4>
              <p className="text-sm text-gray-500">{member.position}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
