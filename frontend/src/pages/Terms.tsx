"use client";

import React from "react";

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-white px-6 py-10 lg:px-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Terms and Conditions</h1>

        <p className="text-gray-700 mb-4">
          Welcome to Bawarchi.AI! These terms and conditions outline the rules and regulations
          for the use of our application and services.
        </p>

        <Section title="1. Acceptance of Terms">
          By accessing and using our services, you agree to be bound by these terms. If you disagree
          with any part of the terms, you may not access the service.
        </Section>

        <Section title="2. User Responsibilities">
          <ul className="list-disc list-inside text-gray-700">
            <li>You must be at least 13 years old to use our services.</li>
            <li>Do not misuse the platform or attempt unauthorized access.</li>
            <li>You are responsible for the content you upload or share.</li>
          </ul>
        </Section>

        <Section title="3. Intellectual Property">
          All content and materials on Bawarchi.AI, including text, graphics, logos, and software,
          are the intellectual property of Bawarchi.AI and are protected by copyright laws.
        </Section>

        <Section title="4. Termination">
          We reserve the right to suspend or terminate your access to the service at our sole
          discretion, without prior notice or liability, for any reason.
        </Section>

        <Section title="5. Modifications">
          We may revise these terms at any time. Your continued use of the site following any
          changes indicates your acceptance of the new terms.
        </Section>

        <Section title="6. Contact Us">
          If you have any questions about these Terms, please contact us at{" "}
          <a href="mailto:kaustavdas0228@gmail.com" className="text-yellow-600 underline">
          kaustavdas0228@gmail.com
          </a>.
        </Section>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <>
    <h2 className="text-2xl font-semibold mt-8 mb-2 text-gray-800">{title}</h2>
    <div className="text-gray-700 mb-4">{children}</div>
  </>
);

export default Terms;
