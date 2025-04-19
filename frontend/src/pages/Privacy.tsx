"use client";

import React from "react";

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white px-6 py-10 lg:px-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Privacy Policy</h1>

        <p className="text-gray-700 mb-4">
          At Bawarchi.AI, we value your privacy. This policy explains how we collect, use,
          and safeguard your personal data.
        </p>

        <Section title="1. Information We Collect">
          <ul className="list-disc list-inside text-gray-700">
            <li>Your name and email address (e.g., via Google login)</li>
            <li>Usage data such as recipe preferences and session activity</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Data">
          We use your data to personalize your experience, improve the service, and occasionally
          send you important updates (not marketing spam).
        </Section>

        <Section title="3. Data Sharing">
          We do not sell or share your personal data with third parties, except when required
          by law or for service operations (e.g., Google authentication).
        </Section>

        <Section title="4. Data Security">
          We use industry-standard security measures to protect your data. However, no method of
          transmission is 100% secure.
        </Section>

        <Section title="5. Your Rights">
          You may request access, updates, or deletion of your personal data by contacting us.
        </Section>

        <Section title="6. Changes to This Policy">
          We may update this privacy policy. All updates will be posted on this page with a
          revised "Last updated" date.
        </Section>

        <Section title="7. Contact Us">
          For questions about this policy, email us at{" "}
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

export default Privacy;
