import React from 'react';
import { ShieldCheck, UserCircle, Globe, Lock, FileText, Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: UserCircle,
      color: 'blue',
      title: "Information We Collect",
      content: (
        <>
          <p className="text-gray-600 mb-4">
            We collect essential information to provide and improve our services:
          </p>
          <ul className="space-y-3 pl-4 border-l-4 border-blue-500">
            <li className="flex items-center space-x-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>Personal identification details and contact information</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>Account credentials and registration information</span>
            </li>
           
          </ul>
        </>
      )
    },
    {
      icon: Globe,
      color: 'green',
      title: "Information Usage",
      content: (
        <>
          <p className="text-gray-600 mb-4">
            We use your data to enhance your Eventify experience:
          </p>
          <ul className="space-y-3 pl-4 border-l-4 border-green-500">
            <li className="flex items-center space-x-3">
              <span className="text-green-600 font-bold">•</span>
              <span>Personalized event recommendations</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-green-600 font-bold">•</span>
              <span>Platform service optimization</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-green-600 font-bold">•</span>
              <span>Secure and efficient communication</span>
            </li>
          </ul>
        </>
      )
    },
    {
      icon: Lock,
      color: 'purple',
      title: "Data Protection",
      content: (
        <>
          <p className="text-gray-600 mb-4">
            We prioritize the security of your personal information:
          </p>
          <ul className="space-y-3 pl-4 border-l-4 border-purple-500">
            <li className="flex items-center space-x-3">
              <span className="text-purple-600 font-bold">•</span>
              <span>Advanced encryption technologies</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-purple-600 font-bold">•</span>
              <span>Regular comprehensive security audits</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-purple-600 font-bold">•</span>
              <span>Strict access control mechanisms</span>
            </li>
          </ul>
        </>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-6 text-center">
          <div className="flex justify-center mb-4">
            <ShieldCheck size={64} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Eventify Privacy Policy</h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            We are committed to protecting your personal information and ensuring transparent data practices.
          </p>
        </div>

        {/* Sections */}
        <div className="p-6 md:p-10">
          <div className="grid md:grid-cols-3 gap-6">
            {sections.map((section, index) => (
              <div 
                key={index} 
                className="bg-white border rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <section.icon 
                      size={40} 
                      className={`mr-4 text-${section.color}-600`} 
                    />
                    <h2 className={`text-xl font-semibold text-${section.color}-600`}>
                      {section.title}
                    </h2>
                  </div>
                  <div>
                    {section.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Details Section */}
        <div className="bg-gray-50 p-6 md:p-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <Shield className="mr-3 text-blue-600" size={32} />
              Your Privacy Matters
            </h3>
            <p className="text-gray-600 mb-6">
              At Eventify, we believe in empowering our users with complete transparency and control over their personal information.
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="akaaystudio888@gmail.com" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FileText className="mr-2" size={20} />
                Contact Privacy Team
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 text-center py-4">
          <p className="text-gray-500 text-sm">
            © 2024 Eventify. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;