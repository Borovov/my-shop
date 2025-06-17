export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

// Password validation constants
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const PASSWORD_REQUIREMENTS = [
  'Минимум 8 символов',
  'Хотя бы одна заглавная буква',
  'Хотя бы одна строчная буква',
  'Хотя бы одна цифра',
  'Хотя бы один специальный символ (@$!%*?&)'
]; 