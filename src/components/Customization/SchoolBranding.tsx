import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import { toast } from 'react-toastify';

interface CustomField {
  id?: string;
  name: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface Branding {
  primaryColor?: string;
  secondaryColor?: string;
  logo?: string;
  schoolName?: string;
  motto?: string;
  customFields?: CustomField[];
}

const SchoolBranding: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('branding');
  const [branding, setBranding] = useState<Branding>({
    primaryColor: '#1E40AF',
    secondaryColor: '#F59E0B',
    logo: '🏫',
    schoolName: '',
    motto: '',
    customFields: []
  });
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Modal states
  const [showAddField, setShowAddField] = useState(false);
  const [showEditField, setShowEditField] = useState(false);
  const [selectedField, setSelectedField] = useState<CustomField | null>(null);
  
  // Form states
  const [newField, setNewField] = useState({
    name: '',
    type: 'text',
    required: false,
    options: ''
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  const canManageBranding = user && (
    user.role === 'SCHOOL_ADMIN' || 
    user.role === 'SUPER_ADMIN'
  );

  useEffect(() => {
    if (canManageBranding && user?.schoolId) {
      fetchBranding();
      fetchCustomFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchBranding = async () => {
    try {
      setLoading(true);
      const data = await api.get('/branding/my-school');
      setBranding(data);
      if (data.logo && typeof data.logo === 'string' && !data.logo.startsWith('data:')) {
        setLogoPreview(data.logo);
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching branding:', err);
      setError(err.message || 'Failed to fetch branding');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomFields = async () => {
    try {
      if (!user?.schoolId) return;
      const data = await api.get(`/branding/school/${user.schoolId}/custom-fields`);
      setCustomFields(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching custom fields:', err);
    }
  };

  const handleSaveBranding = async () => {
    if (!user?.schoolId) {
      toast.error('School ID not found');
      return;
    }

    try {
      setSaving(true);
      
      // Prepare branding data (excluding logo if it's a file)
      const brandingData: any = {
        primaryColor: branding.primaryColor,
        secondaryColor: branding.secondaryColor,
        schoolName: branding.schoolName,
        motto: branding.motto
      };

      // If logo is a file, upload it separately
      if (logoFile) {
        const formData = new FormData();
        formData.append('logo', logoFile);
        
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${api.baseUrl}/branding/school/${user.schoolId}/logo`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to upload logo');
        }
      }

      // Update branding
      await api.put(`/branding/school/${user.schoolId}`, brandingData);
      
      toast.success('Branding settings saved successfully!');
      fetchBranding();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save branding settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCustomField = async () => {
    if (!newField.name || !user?.schoolId) {
      toast.error('Please enter field name');
      return;
    }

    try {
      const fieldData: any = {
        name: newField.name,
        type: newField.type,
        required: newField.required
      };

      if (newField.type === 'select' && newField.options) {
        fieldData.options = newField.options.split(',').map(opt => opt.trim());
      }

      await api.post(`/branding/school/${user.schoolId}/custom-fields`, fieldData);
      toast.success('Custom field added successfully!');
      setNewField({ name: '', type: 'text', required: false, options: '' });
      setShowAddField(false);
      fetchCustomFields();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create custom field');
    }
  };

  const handleUpdateCustomField = async () => {
    if (!selectedField || !selectedField.id || !user?.schoolId) {
      toast.error('Invalid field');
      return;
    }

    try {
      const fieldData: any = {
        name: newField.name,
        type: newField.type,
        required: newField.required
      };

      if (newField.type === 'select' && newField.options) {
        fieldData.options = newField.options.split(',').map(opt => opt.trim());
      }

      await api.put(`/branding/school/${user.schoolId}/custom-fields/${selectedField.id}`, fieldData);
      toast.success('Custom field updated successfully!');
      setShowEditField(false);
      setSelectedField(null);
      setNewField({ name: '', type: 'text', required: false, options: '' });
      fetchCustomFields();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update custom field');
    }
  };

  const handleDeleteCustomField = async (fieldId: string) => {
    if (!user?.schoolId || !window.confirm('Are you sure you want to delete this custom field?')) {
      return;
    }

    try {
      await api.delete(`/branding/school/${user.schoolId}/custom-fields/${fieldId}`);
      toast.success('Custom field deleted successfully!');
      fetchCustomFields();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete custom field');
    }
  };

  const handleEditField = (field: CustomField) => {
    setSelectedField(field);
    setNewField({
      name: field.name,
      type: field.type,
      required: field.required || false,
      options: field.options ? field.options.join(', ') : ''
    });
    setShowEditField(true);
  };

  if (!canManageBranding) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">You do not have permission to manage school branding.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading branding settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">School Branding & Customization</h2>
          <button
            onClick={handleSaveBranding}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === 'branding' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Branding
          </button>
          <button
            onClick={() => setActiveTab('customization')}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === 'customization' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Custom Fields
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === 'preview' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Branding Tab */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Name
                </label>
                <input
                  type="text"
                  value={branding.schoolName}
                  onChange={(e) => setBranding(prev => ({ ...prev, schoolName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Motto
                </label>
                <input
                  type="text"
                  value={branding.motto}
                  onChange={(e) => setBranding(prev => ({ ...prev, motto: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={branding.secondaryColor}
                    onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.secondaryColor}
                    onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Logo
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="School Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">{branding.logo || '🏫'}</span>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload PNG, JPG or SVG (max 2MB)</p>
                </div>
              </div>
            </div>

            {/* Color Preview */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Preview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div 
                    className="w-full h-16 rounded-lg mb-2"
                    style={{ backgroundColor: branding.primaryColor }}
                  ></div>
                  <p className="text-sm text-gray-600">Primary Color</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-16 rounded-lg mb-2"
                    style={{ backgroundColor: branding.secondaryColor }}
                  ></div>
                  <p className="text-sm text-gray-600">Secondary Color</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-16 rounded-lg mb-2 flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="h-10 mr-2" />
                    ) : (
                      <span className="text-2xl mr-2">{branding.logo || '🏫'}</span>
                    )}
                    {branding.schoolName}
                  </div>
                  <p className="text-sm text-gray-600">Logo Preview</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Fields Tab */}
        {activeTab === 'customization' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Custom Fields</h3>
              <button
                onClick={() => setShowAddField(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Add Custom Field
              </button>
            </div>

            <div className="space-y-4">
              {customFields.length > 0 ? (
                customFields.map((field) => (
                  <div key={field.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{field.name}</h4>
                        <p className="text-sm text-gray-600">
                          Type: {field.type} | Required: {field.required ? 'Yes' : 'No'}
                        </p>
                        {field.options && field.options.length > 0 && (
                          <p className="text-sm text-gray-600">
                            Options: {field.options.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditField(field)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => field.id && handleDeleteCustomField(field.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No custom fields yet. Add your first custom field!</p>
              )}
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
            
            {/* Header Preview */}
            <div className="border rounded-lg overflow-hidden">
              <div 
                className="px-6 py-4 text-white"
                style={{ backgroundColor: branding.primaryColor }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="h-10 mr-3" />
                    ) : (
                      <span className="text-2xl mr-3">{branding.logo || '🏫'}</span>
                    )}
                    <div>
                      <h1 className="text-xl font-bold">{branding.schoolName}</h1>
                      <p className="text-sm opacity-90">{branding.motto}</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p>Welcome, John Doe</p>
                    <p>Student Portal</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">My Classes</h3>
                    <p className="text-sm text-gray-600">3 active classes</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">Assignments</h3>
                    <p className="text-sm text-gray-600">2 pending</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">Results</h3>
                    <p className="text-sm text-gray-600">View latest grades</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Fields Preview */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Fields Preview</h3>
              <div className="space-y-4">
                {customFields.length > 0 ? (
                  customFields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.name} {field.required && '*'}
                      </label>
                      {field.type === 'text' && (
                        <input
                          type="text"
                          placeholder={`Enter ${field.name.toLowerCase()}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                      {field.type === 'select' && (
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">Select {field.name.toLowerCase()}</option>
                          {field.options && field.options.map((option, i) => (
                            <option key={i} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                      {field.type === 'textarea' && (
                        <textarea
                          placeholder={`Enter ${field.name.toLowerCase()}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                      )}
                      {field.type === 'number' && (
                        <input
                          type="number"
                          placeholder={`Enter ${field.name.toLowerCase()}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                      {field.type === 'date' && (
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No custom fields to preview</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Custom Field Modal */}
      {showAddField && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Custom Field</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field Name *
                  </label>
                  <input
                    type="text"
                    value={newField.name}
                    onChange={(e) => setNewField({...newField, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., House System"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field Type
                  </label>
                  <select
                    value={newField.type}
                    onChange={(e) => setNewField({...newField, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text">Text Input</option>
                    <option value="select">Dropdown</option>
                    <option value="textarea">Text Area</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                  </select>
                </div>

                {newField.type === 'select' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newField.options}
                      onChange={(e) => setNewField({...newField, options: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Option 1, Option 2, Option 3"
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="required"
                    checked={newField.required}
                    onChange={(e) => setNewField({...newField, required: e.target.checked})}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="required" className="ml-2 text-sm text-gray-700">
                    Required field
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddField(false);
                    setNewField({ name: '', type: 'text', required: false, options: '' });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCustomField}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Field
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Custom Field Modal */}
      {showEditField && selectedField && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Custom Field</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field Name *
                  </label>
                  <input
                    type="text"
                    value={newField.name}
                    onChange={(e) => setNewField({...newField, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., House System"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field Type
                  </label>
                  <select
                    value={newField.type}
                    onChange={(e) => setNewField({...newField, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text">Text Input</option>
                    <option value="select">Dropdown</option>
                    <option value="textarea">Text Area</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                  </select>
                </div>

                {newField.type === 'select' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newField.options}
                      onChange={(e) => setNewField({...newField, options: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Option 1, Option 2, Option 3"
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="required-edit"
                    checked={newField.required}
                    onChange={(e) => setNewField({...newField, required: e.target.checked})}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="required-edit" className="ml-2 text-sm text-gray-700">
                    Required field
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditField(false);
                    setSelectedField(null);
                    setNewField({ name: '', type: 'text', required: false, options: '' });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCustomField}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Update Field
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolBranding;
