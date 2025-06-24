import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const getPasswordStrength = (password: string): {
    score: number;
    label: string;
    color: string;
    requirements: { text: string; met: boolean }[];
  } => {
    const requirements = [
      { text: 'At least 8 characters', met: password.length >= 8 },
      { text: 'At least one uppercase letter', met: /[A-Z]/.test(password) },
      { text: 'At least one lowercase letter', met: /[a-z]/.test(password) },
      { text: 'At least one number', met: /\d/.test(password) },
      { text: 'At least one special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];

    const metRequirements = requirements.filter(req => req.met).length;
    
    let score = 0;
    let label = 'Very Weak';
    let color = 'danger';

    if (metRequirements >= 5) {
      score = 100;
      label = 'Very Strong';
      color = 'success';
    } else if (metRequirements >= 4) {
      score = 80;
      label = 'Strong';
      color = 'success';
    } else if (metRequirements >= 3) {
      score = 60;
      label = 'Medium';
      color = 'warning';
    } else if (metRequirements >= 2) {
      score = 40;
      label = 'Weak';
      color = 'danger';
    } else if (metRequirements >= 1) {
      score = 20;
      label = 'Very Weak';
      color = 'danger';
    }

    return { score, label, color, requirements };
  };

  if (!password) return null;

  const strength = getPasswordStrength(password);

  return (
    <div className="mt-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <small className="text-muted">Password Strength:</small>
        <small className={`text-${strength.color} fw-bold`}>{strength.label}</small>
      </div>
      
      <div className="progress mb-2" style={{ height: '4px' }}>
        <div
          className={`progress-bar bg-${strength.color}`}
          role="progressbar"
          style={{ width: `${strength.score}%` }}
          aria-valuenow={strength.score}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="small text-muted">
        {strength.requirements.map((req, index) => (
          <div key={index} className="d-flex align-items-center">
            <i className={`bi ${req.met ? 'bi-check-circle text-success' : 'bi-x-circle text-danger'} me-2`} />
            <span className={req.met ? 'text-success' : ''}>{req.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator; 