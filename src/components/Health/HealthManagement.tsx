import React, { useState } from 'react';
import { healthRecords, safetyIncidents } from '../../data/advancedMockData';

const HealthManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('records');
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    name: '',
    allergies: '',
    medications: '',
    emergencyContact: '',
    bloodType: '',
    healthStatus: 'Good'
  });

  const handleAddRecord = () => {
    if (!newRecord.name || !newRecord.emergencyContact) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Adding health record:', newRecord);
    alert('Health record added successfully!');
    setShowAddRecord(false);
    setNewRecord({ name: '', allergies: '', medications: '', emergencyContact: '', bloodType: '', healthStatus: 'Good' });
  };

  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Health & Safety Management</h2>
          <button
            onClick={() => setShowAddRecord(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Health Record
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setSelectedTab('records')}
            className={`px-4 py-2 rounded-md font-medium ${
              selectedTab === 'records' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Health Records
          </button>
          <button
            onClick={() => setSelectedTab('incidents')}
            className={`px-4 py-2 rounded-md font-medium ${
              selectedTab === 'incidents' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Safety Incidents
          </button>
          <button
            onClick={() => setSelectedTab('screening')}
            className={`px-4 py-2 rounded-md font-medium ${
              selectedTab === 'screening' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Health Screening
          </button>
        </div>

        {/* Health Records Tab */}
        {selectedTab === 'records' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthRecords.map((record, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{record.name}</h3>
                      <p className="text-sm text-gray-600">Student ID: {record.studentId}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getHealthStatusColor(record.healthStatus)}`}>
                      {record.healthStatus}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Blood Type</p>
                      <p className="text-sm text-gray-600">{record.bloodType}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Allergies</p>
                      <p className="text-sm text-gray-600">
                        {record.allergies.length > 0 ? record.allergies.join(', ') : 'None'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Medications</p>
                      <p className="text-sm text-gray-600">
                        {record.medications.length > 0 ? record.medications.join(', ') : 'None'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Emergency Contact</p>
                      <p className="text-sm text-gray-600">{record.emergencyContact}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Last Checkup</p>
                      <p className="text-sm text-gray-600">{record.lastCheckup}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600">
                      Edit
                    </button>
                    <button className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600">
                      View History
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safety Incidents Tab */}
        {selectedTab === 'incidents' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {safetyIncidents.map((incident, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{incident.type}</h3>
                      <p className="text-sm text-gray-600">Student: {incident.student}</p>
                      <p className="text-sm text-gray-600">Date: {incident.date}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(incident.severity)}`}>
                        {incident.severity.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        incident.resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {incident.resolved ? 'RESOLVED' : 'PENDING'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                    <p className="text-sm text-gray-600">{incident.description}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Action Taken</p>
                    <p className="text-sm text-gray-600">{incident.actionTaken}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600">
                      View Details
                    </button>
                    <button className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600">
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Health Screening Tab */}
        {selectedTab === 'screening' && (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Health Screenings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">Vision Screening</h4>
                  <p className="text-sm text-gray-600">Date: 2024-02-15</p>
                  <p className="text-sm text-gray-600">Students: 45</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">Hearing Test</h4>
                  <p className="text-sm text-gray-600">Date: 2024-02-20</p>
                  <p className="text-sm text-gray-600">Students: 45</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">General Checkup</h4>
                  <p className="text-sm text-gray-600">Date: 2024-02-25</p>
                  <p className="text-sm text-gray-600">Students: 45</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <p className="text-sm text-gray-600">Healthy Students</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <p className="text-sm text-gray-600">Allergies Reported</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <p className="text-sm text-gray-600">Medications</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">2</div>
                  <p className="text-sm text-gray-600">Incidents This Month</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Health Record Modal */}
      {showAddRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Health Record</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    value={newRecord.name}
                    onChange={(e) => setNewRecord({...newRecord, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter student name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allergies
                  </label>
                  <input
                    type="text"
                    value={newRecord.allergies}
                    onChange={(e) => setNewRecord({...newRecord, allergies: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="List any allergies"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medications
                  </label>
                  <input
                    type="text"
                    value={newRecord.medications}
                    onChange={(e) => setNewRecord({...newRecord, medications: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="List any medications"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact *
                  </label>
                  <input
                    type="tel"
                    value={newRecord.emergencyContact}
                    onChange={(e) => setNewRecord({...newRecord, emergencyContact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+263 77 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Type
                  </label>
                  <select
                    value={newRecord.bloodType}
                    onChange={(e) => setNewRecord({...newRecord, bloodType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select blood type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Health Status
                  </label>
                  <select
                    value={newRecord.healthStatus}
                    onChange={(e) => setNewRecord({...newRecord, healthStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddRecord(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRecord}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthManagement;
