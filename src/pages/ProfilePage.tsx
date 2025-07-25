import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserUpdateData, Address } from '../types/user';
import type { ValidationErrors } from '../types/user';
import Toast from '../components/Toast';

const AddressForm: React.FC<{
  address: Address;
  onUpdate: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  errors: ValidationErrors;
  isLoading: boolean;
}> = ({ address, onUpdate, onDelete, onSetDefault, errors, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdate({
      ...address,
      [name]: value
    });
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h6 className="card-subtitle text-muted">
            Address {address.id}
          </h6>
          <div className="d-flex align-items-center gap-2">
            {address.isDefault && (
              <span className="badge bg-primary">Default Address</span>
            )}
            <div className="btn-group">
              {!address.isDefault && (
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => onSetDefault(address.id)}
                  disabled={isLoading}
                >
                  Set as Default
                </button>
              )}
              {!address.isDefault && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => onDelete(address.id)}
                  disabled={isLoading}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor={`street-${address.id}`} className="form-label">Street</label>
          <input
            type="text"
            className={`form-control ${errors[`address.${address.id}.street`] ? 'is-invalid' : ''}`}
            id={`street-${address.id}`}
            name="street"
            value={address.street}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors[`address.${address.id}.street`] && (
            <div className="invalid-feedback">{errors[`address.${address.id}.street`]}</div>
          )}
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor={`city-${address.id}`} className="form-label">City</label>
            <input
              type="text"
              className={`form-control ${errors[`address.${address.id}.city`] ? 'is-invalid' : ''}`}
              id={`city-${address.id}`}
              name="city"
              value={address.city}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors[`address.${address.id}.city`] && (
              <div className="invalid-feedback">{errors[`address.${address.id}.city`]}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor={`state-${address.id}`} className="form-label">State/Region</label>
            <input
              type="text"
              className="form-control"
              id={`state-${address.id}`}
              name="state"
              value={address.state}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor={`country-${address.id}`} className="form-label">Country</label>
            <input
              type="text"
              className={`form-control ${errors[`address.${address.id}.country`] ? 'is-invalid' : ''}`}
              id={`country-${address.id}`}
              name="country"
              value={address.country}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors[`address.${address.id}.country`] && (
              <div className="invalid-feedback">{errors[`address.${address.id}.country`]}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor={`zipCode-${address.id}`} className="form-label">ZIP Code</label>
            <input
              type="text"
              className={`form-control ${errors[`address.${address.id}.zipCode`] ? 'is-invalid' : ''}`}
              id={`zipCode-${address.id}`}
              name="zipCode"
              value={address.zipCode}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors[`address.${address.id}.zipCode`] && (
              <div className="invalid-feedback">{errors[`address.${address.id}.zipCode`]}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [formData, setFormData] = useState<UserUpdateData>({
    name: user?.name || '',
    phone: user?.phone || '',
    addresses: user?.addresses.map(addr => ({ ...addr })) || [],
    preferences: user?.preferences ? {
      newsletter: user.preferences.newsletter,
      notifications: {
        email: user.preferences.notifications.email,
        push: user.preferences.notifications.push
      }
    } : {
      newsletter: false,
      notifications: {
        email: false,
        push: false
      }
    }
  });

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }

    formData.addresses?.forEach(address => {
      if (!address.street?.trim()) {
        newErrors[`address.${address.id}.street`] = 'Street is required';
      }
      if (!address.city?.trim()) {
        newErrors[`address.${address.id}.city`] = 'City is required';
      }
      if (!address.country?.trim()) {
        newErrors[`address.${address.id}.country`] = 'Country is required';
      }
      if (!address.zipCode?.trim()) {
        newErrors[`address.${address.id}.zipCode`] = 'ZIP code is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await updateProfile(formData);
      setToast({ message: 'Profile updated successfully', type: 'success' });
      setIsEditing(false);
    } catch (error) {
      setToast({ 
        message: error instanceof Error ? error.message : 'Error updating profile', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Обработка настроек
    if (name.startsWith('preferences.')) {
      if (name === 'preferences.newsletter') {
        setFormData(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences!,
            newsletter: checked
          }
        }));
      } else if (name.startsWith('preferences.notifications.')) {
        const notificationType = name.split('.')[2];
        setFormData(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences!,
            notifications: {
              ...prev.preferences!.notifications,
              [notificationType]: checked
            }
          }
        }));
      }
    } else {
      // Обработка обычных полей
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAddressUpdate = (updatedAddress: Address) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses?.map(addr =>
        addr.id === updatedAddress.id ? updatedAddress : addr
      )
    }));
  };

  const handleAddressDelete = (addressId: string) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses?.filter(addr => addr.id !== addressId)
    }));
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses?.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }))
    }));
  };

  const handleAddNewAddress = () => {
    const newAddress: Address = {
      id: `new-${Date.now()}`,
      isDefault: false,
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    };

    setFormData(prev => ({
      ...prev,
      addresses: [...(prev.addresses || []), newAddress]
    }));
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* Левая колонка с аватаром */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body text-center">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt="Profile"
                className="rounded-circle mb-3"
                style={{ width: '150px', height: '150px' }}
              />
              <h5 className="card-title mb-0">{user.name}</h5>
              <p className="text-muted">{user.role === 'admin' ? 'Administrator' : 'User'}</p>
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(!isEditing)}
                disabled={isLoading}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Правая колонка с информацией/формой */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">
                {isEditing ? 'Edit Profile' : 'Profile Information'}
              </h4>

              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  {/* Основная информация */}
                  <div className="mb-4">
                    <h5 className="mb-3">Basic Information</h5>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={user.email}
                        disabled
                      />
                      <small className="text-muted">Email cannot be changed</small>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">Phone</label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      {errors.phone && (
                        <div className="invalid-feedback">{errors.phone}</div>
                      )}
                    </div>
                  </div>

                  {/* Адреса */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Delivery Addresses</h5>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={handleAddNewAddress}
                        disabled={isLoading}
                      >
                        <i className="bi bi-plus-lg me-1"></i>
                        Add Address
                      </button>
                    </div>

                    {formData.addresses?.map(address => (
                      <AddressForm
                        key={address.id}
                        address={address}
                        onUpdate={handleAddressUpdate}
                        onDelete={handleAddressDelete}
                        onSetDefault={handleSetDefaultAddress}
                        errors={errors}
                        isLoading={isLoading}
                      />
                    ))}
                  </div>

                  {/* Настройки */}
                  <div className="mb-4">
                    <h5 className="mb-3">Settings</h5>
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="preferences.newsletter"
                          name="preferences.newsletter"
                          checked={formData.preferences?.newsletter}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                        <label className="form-check-label" htmlFor="preferences.newsletter">
                          Subscribe to newsletter
                        </label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label d-block">Notifications</label>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="preferences.notifications.email"
                          name="preferences.notifications.email"
                          checked={formData.preferences?.notifications?.email}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                        <label className="form-check-label" htmlFor="preferences.notifications.email">
                          Email notifications
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="preferences.notifications.push"
                          name="preferences.notifications.push"
                          checked={formData.preferences?.notifications?.push}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                        <label className="form-check-label" htmlFor="preferences.notifications.push">
                          Push notifications
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {/* Основная информация */}
                  <div className="mb-4">
                    <h5 className="mb-3">Basic Information</h5>
                    <dl className="row mb-0">
                      <dt className="col-sm-3">Name</dt>
                      <dd className="col-sm-9">{user.name}</dd>

                      <dt className="col-sm-3">Email</dt>
                      <dd className="col-sm-9">{user.email}</dd>

                      <dt className="col-sm-3">Phone</dt>
                      <dd className="col-sm-9">{user.phone || 'Not specified'}</dd>
                    </dl>
                  </div>

                  {/* Адреса */}
                  <div className="mb-4">
                    <h5 className="mb-3">Delivery Addresses</h5>
                    {user.addresses.map(address => (
                      <div key={address.id} className="card mb-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="card-subtitle text-muted mb-0">
                              Address {address.id}
                            </h6>
                            {address.isDefault && (
                              <span className="badge bg-primary">Default Address</span>
                            )}
                          </div>
                          <dl className="row mb-0">
                            <dt className="col-sm-3">Street</dt>
                            <dd className="col-sm-9">{address.street}</dd>

                            <dt className="col-sm-3">City</dt>
                            <dd className="col-sm-9">{address.city}</dd>

                            <dt className="col-sm-3">State/Region</dt>
                            <dd className="col-sm-9">{address.state || 'Not specified'}</dd>

                            <dt className="col-sm-3">Country</dt>
                            <dd className="col-sm-9">{address.country}</dd>

                            <dt className="col-sm-3">ZIP Code</dt>
                            <dd className="col-sm-9">{address.zipCode}</dd>
                          </dl>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Настройки */}
                  {user.preferences && (
                    <div className="mb-4">
                      <h5 className="mb-3">Settings</h5>
                      <dl className="row mb-0">
                        <dt className="col-sm-3">Newsletter</dt>
                        <dd className="col-sm-9">
                          {user.preferences.newsletter ? (
                            <span className="text-success">
                              <i className="bi bi-check-circle me-1"></i>
                              Subscribed
                            </span>
                          ) : (
                            <span className="text-muted">
                              <i className="bi bi-x-circle me-1"></i>
                              Not subscribed
                            </span>
                          )}
                        </dd>

                        <dt className="col-sm-3">Notifications</dt>
                        <dd className="col-sm-9">
                          <div>
                            Email: {user.preferences.notifications.email ? (
                              <span className="text-success">
                                <i className="bi bi-check-circle me-1"></i>
                                Enabled
                              </span>
                            ) : (
                              <span className="text-muted">
                                <i className="bi bi-x-circle me-1"></i>
                                Disabled
                              </span>
                            )}
                          </div>
                          <div>
                            Push: {user.preferences.notifications.push ? (
                              <span className="text-success">
                                <i className="bi bi-check-circle me-1"></i>
                                Enabled
                              </span>
                            ) : (
                              <span className="text-muted">
                                <i className="bi bi-x-circle me-1"></i>
                                Disabled
                              </span>
                            )}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProfilePage;