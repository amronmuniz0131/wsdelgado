"use client";

import { Placeholder } from "@/components/Placeholder";
import { Check } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen font-sans text-gray-900 bg-white">
            {/* Hero */}
            <section className="relative py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">About WSDelgado</h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-600">
                        Building the future with integrity, quality, and precision. We are your trusted partners in construction.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                        </p>
                    </div>
                    <div className="aspect-[4/3] w-full">
                        <Placeholder className="w-full h-full rounded-sm" text="Mission Image" />
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-12 text-center">Core Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {['Integrity', 'Quality', 'Innovation'].map((val) => (
                            <div key={val} className="p-8 border border-white/20 rounded-sm hover:bg-white/5 transition-colors">
                                <div className="w-12 h-12 bg-white text-gray-900 rounded-full flex items-center justify-center mb-6">
                                    <Check />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{val}</h3>
                                <p className="text-gray-400">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.
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
                    {[1, 2, 3, 4].map((member) => (
                        <div key={member} className="group">
                            <div className="aspect-[3/4] mb-4 overflow-hidden relative">
                                <Placeholder className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <h4 className="font-bold text-lg">Team Member {member}</h4>
                            <p className="text-sm text-gray-500">Position Title</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
