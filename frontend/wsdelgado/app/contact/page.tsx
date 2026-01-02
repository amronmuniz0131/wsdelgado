"use client";

import { Placeholder } from "@/components/Placeholder";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Contact form submitted:", formData);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left Column: Form */}
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-12">
                            Contact
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="block w-full border-gray-300 border-b focus:border-gray-900 focus:ring-0 sm:text-sm py-2 px-0 bg-transparent placeholder-gray-400"
                                    placeholder="Input field"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className="block w-full border-gray-300 border-b focus:border-gray-900 focus:ring-0 sm:text-sm py-2 px-0 bg-transparent placeholder-gray-400"
                                    placeholder="Input field"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="subject"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    value={formData.subject}
                                    onChange={(e) =>
                                        setFormData({ ...formData, subject: e.target.value })
                                    }
                                    className="block w-full border-gray-300 border-b focus:border-gray-900 focus:ring-0 sm:text-sm py-2 px-0 bg-transparent placeholder-gray-400"
                                    placeholder="Input field"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={1}
                                    value={formData.message}
                                    onChange={(e) =>
                                        setFormData({ ...formData, message: e.target.value })
                                    }
                                    className="block w-full border-gray-300 border-b focus:border-gray-900 focus:ring-0 sm:text-sm py-2 px-0 bg-transparent placeholder-gray-400 resize-none"
                                    placeholder="Input field"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-gray-200 text-gray-900 py-3 px-6 rounded-none text-sm font-bold uppercase tracking-wider hover:bg-gray-300 transition-colors border border-gray-300"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Placeholder */}
                    <div className="h-full min-h-[400px]">
                        <Placeholder className="w-full h-full min-h-[400px]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
