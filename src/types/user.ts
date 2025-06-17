export interface Address {
  id: string;
  isDefault: boolean;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  avatar?: string;
  addresses: Address[];
  preferences?: {
    newsletter: boolean;
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
}

export interface UserUpdateData {
  name?: string;
  phone?: string;
  avatar?: string;
  addresses?: Address[];
  preferences?: User['preferences'];
}

export interface ValidationErrors {
  [key: string]: string;
} 