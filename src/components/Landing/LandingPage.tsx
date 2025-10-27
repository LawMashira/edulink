import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img src="/images/edulink.jpg" alt="ZimEduLink" className="h-10 w-auto" />
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Features</a>
                <a href="#pricing" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
                <a href="#testimonials" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Testimonials</a>
                <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Sign In
                </Link>
                <Link to="/signup" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              The Future of
              <span className="block text-yellow-300">School Management</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Transform your school with Zimbabwe's most comprehensive school management system. 
              Streamline operations, enhance learning, and connect everyone in your educational community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup" 
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors shadow-lg"
              >
                Start Free Trial
              </Link>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Watch Demo
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-4">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything Your School Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From student management to parent communication, we've got you covered with powerful tools designed for Zimbabwean schools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            {[
              {
                icon: '👨‍🎓',
                title: 'Student Management',
                description: 'Complete student lifecycle management from enrollment to graduation with academic tracking and performance analytics.'
              },
              {
                icon: '👨‍🏫',
                title: 'Teacher Dashboard',
                description: 'Empower teachers with tools for attendance, grading, lesson planning, and parent communication.'
              },
              {
                icon: '👨‍👩‍👧‍👦',
                title: 'Parent Portal',
                description: 'Keep parents informed with real-time updates on their child\'s progress, attendance, and school activities.'
              },
              {
                icon: '📊',
                title: 'Academic Analytics',
                description: 'Data-driven insights with comprehensive reports on student performance, attendance trends, and school metrics.'
              },
              {
                icon: '💰',
                title: 'Fee Management',
                description: 'Streamlined fee collection with online payments, automated reminders, and comprehensive financial reporting.'
              },
              {
                icon: '📱',
                title: 'Mobile First',
                description: 'Access everything on any device with our responsive design optimized for smartphones and tablets.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-200">Schools</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50,000+</div>
              <div className="text-blue-200">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-blue-200">Teachers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-200">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Schools Across Zimbabwe
            </h2>
            <p className="text-xl text-gray-600">
              See what school administrators, teachers, and parents are saying about ZimEduLink.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "ZimEduLink has revolutionized how we manage our school. The parent communication features have improved engagement by 300%.",
                author: "Dr. Sarah Moyo",
                role: "Headmistress, Harare High School",
                avatar: "👩‍💼"
              },
              {
                quote: "As a teacher, I love how easy it is to track attendance and enter grades. The mobile app is a game-changer!",
                author: "Mr. Tafadzwa Chigwada",
                role: "Mathematics Teacher, Bulawayo Secondary",
                avatar: "👨‍🏫"
              },
              {
                quote: "Finally, a system that works for Zimbabwean schools! The fee management has saved us hours every week.",
                author: "Mrs. Rumbidzai Muzenda",
                role: "School Administrator, Mutare Academy",
                avatar: "👩‍💻"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your school's needs. All plans include 14-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">$29<span className="text-lg text-gray-500">/month</span></div>
                <p className="text-gray-600 mb-6">Perfect for small schools</p>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Up to 200 students</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Basic attendance tracking</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Parent notifications</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Basic reporting</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Email support</li>
                </ul>
                <Link to="/signup" className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Start Free Trial
                </Link>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="bg-blue-600 p-8 rounded-xl shadow-xl transform scale-105">
              <div className="text-center">
                <div className="bg-yellow-400 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">Most Popular</div>
                <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                <div className="text-4xl font-bold text-white mb-4">$59<span className="text-lg text-blue-200">/month</span></div>
                <p className="text-blue-200 mb-6">Perfect for medium schools</p>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center"><span className="text-yellow-300 mr-2">✓</span> Up to 500 students</li>
                  <li className="flex items-center"><span className="text-yellow-300 mr-2">✓</span> Advanced analytics</li>
                  <li className="flex items-center"><span className="text-yellow-300 mr-2">✓</span> Fee management</li>
                  <li className="flex items-center"><span className="text-yellow-300 mr-2">✓</span> WhatsApp integration</li>
                  <li className="flex items-center"><span className="text-yellow-300 mr-2">✓</span> Priority support</li>
                </ul>
                <Link to="/signup" className="w-full bg-yellow-400 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                  Start Free Trial
                </Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">$99<span className="text-lg text-gray-500">/month</span></div>
                <p className="text-gray-600 mb-6">Perfect for large schools</p>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Unlimited students</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Custom integrations</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Advanced security</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> API access</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 24/7 support</li>
                </ul>
                <Link to="/signup" className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of schools already using ZimEduLink to streamline their operations and enhance learning outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors shadow-lg"
            >
              Start Your Free Trial
            </Link>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Demo
            </button>
          </div>
          <p className="text-blue-200 text-sm mt-4">No setup fees • Cancel anytime • 14-day free trial</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">ZimEduLink</h3>
              <p className="text-gray-400">
                Zimbabwe's leading school management system, designed to empower educational institutions across the country.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Training</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ZimEduLink. All rights reserved. Made with ❤️ for Zimbabwean schools.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
