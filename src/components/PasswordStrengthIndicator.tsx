import React from 'react';
import { PASSWORD_REQUIREMENTS, PASSWORD_PATTERN } from '../types/auth';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const getRequirementMet = (requirement: string): boolean => {
    switch (requirement) {
      case 'Минимум 8 символов':
        return password.length >= 8;
      case 'Хотя бы одна заглавная буква':
        return /[A-Z]/.test(password);
      case 'Хотя бы одна строчная буква':
        return /[a-z]/.test(password);
      case 'Хотя бы одна цифра':
        return /\d/.test(password);
      case 'Хотя бы один специальный символ (@$!%*?&)':
        return /[@$!%*?&]/.test(password);
      default:
        return false;
    }
  };

  const getStrengthPercentage = (): number => {
    if (!password) return 0;
    return (PASSWORD_REQUIREMENTS.filter(req => getRequirementMet(req)).length / PASSWORD_REQUIREMENTS.length) * 100;
  };

  const getStrengthColor = (): string => {
    const strength = getStrengthPercentage();
    if (strength <= 20) return 'bg-danger';
    if (strength <= 40) return 'bg-warning';
    if (strength <= 60) return 'bg-info';
    if (strength <= 80) return 'bg-primary';
    return 'bg-success';
  };

  return (
    <div className="password-strength-indicator mt-2">
      <div className="progress" style={{ height: '4px' }}>
        <div
          className={`progress-bar ${getStrengthColor()}`}
          role="progressbar"
          style={{ width: `${getStrengthPercentage()}%` }}
          aria-valuenow={getStrengthPercentage()}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className="mt-2">
        <small className="text-muted">Требования к паролю:</small>
        <ul className="list-unstyled mt-1 mb-0">
          {PASSWORD_REQUIREMENTS.map((requirement, index) => (
            <li key={index} className="d-flex align-items-center">
              <i className={`bi bi-${getRequirementMet(requirement) ? 'check-circle-fill text-success' : 'circle text-muted'} me-2`} />
              <small className={getRequirementMet(requirement) ? 'text-success' : 'text-muted'}>
                {requirement}
              </small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator; 