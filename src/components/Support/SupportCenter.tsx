import React, { useState } from 'react';

const SupportCenter: React.FC = () => {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: ''
  });

  const mockTickets = [
    {
      id: 'ticket1',
      subject: 'Login Issues',
      description: 'Unable to access the system with correct credentials',
      priority: 'high',
      status: 'open',
      createdBy: 'teacher1@school1.co.zw',
      createdAt: '2024-01-15',
      category: 'Technical'
    },
    {
      id: 'ticket2',
      subject: 'Fee Payment Problem',
      description: 'Payment not reflecting in the system after successful transaction',
      priority: 'medium',
      status: 'in_progress',
      createdBy: 'parent1@email.com',
      createdAt: '2024-01-14',
      category: 'Payment'
    },
    {
      id: 'ticket3',
      subject: 'Report Generation',
      description: 'Need help generating attendance reports for the month',
      priority: 'low',
      status: 'resolved',
      createdBy: 'headmaster@school1.co.zw',
      createdAt: '2024-01-10',
      category: 'Training'
    }
  ];

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.description || !newTicket.category) {
      alert('Please fill in all required fields');
      return;
    }
    
    console.log('Creating support ticket:', newTicket);
    alert('Support ticket created successfully!');
    setShowTicketModal(false);
    setNewTicket({ subject: '', description: '', priority: 'medium', category: '' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Support Center</h2>
          <button
            onClick={() => setShowTicketModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Ticket
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🎫</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{mockTickets.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockTickets.filter(ticket => ticket.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockTickets.filter(ticket => ticket.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Tickets */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Support Tickets</h3>
          {mockTickets.map((ticket) => (
            <div key={ticket.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                  <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                </div>
                <div className="flex space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  <span>Category: {ticket.category}</span>
                  <span className="mx-2">•</span>
                  <span>Created by: {ticket.createdBy}</span>
                </div>
                <span>{ticket.createdAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Help */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Help</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">📚 Documentation</h4>
              <p className="text-sm text-gray-600 mb-3">Access user guides and system documentation</p>
              <button className="text-blue-600 text-sm hover:text-blue-800">View Docs</button>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">🎥 Video Tutorials</h4>
              <p className="text-sm text-gray-600 mb-3">Watch step-by-step video guides</p>
              <button className="text-blue-600 text-sm hover:text-blue-800">Watch Videos</button>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">💬 Live Chat</h4>
              <p className="text-sm text-gray-600 mb-3">Chat with our support team</p>
              <button className="text-blue-600 text-sm hover:text-blue-800">Start Chat</button>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">📞 Phone Support</h4>
              <p className="text-sm text-gray-600 mb-3">Call us for immediate assistance</p>
              <button className="text-blue-600 text-sm hover:text-blue-800">Call Now</button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create Support Ticket</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the issue"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="Technical">Technical</option>
                  <option value="Payment">Payment</option>
                  <option value="Training">Training</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as 'low' | 'medium' | 'high'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Detailed description of the issue"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTicket}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportCenter;
