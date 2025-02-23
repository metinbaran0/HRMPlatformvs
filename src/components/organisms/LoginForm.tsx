import React from 'react';
import FormField from '../molecules/FormField';
import ButtonGroup from '../molecules/ButtonGroup';
import Button from '../atoms/Button';

interface LoginFormProps {
  isLoginMode: boolean;
  formData: {
    email: string;
    password: string;
    repassword?: string;
  }
  error?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  isLoginMode,
  formData,
  error,
  onInputChange,
  onSubmit,
  onToggleMode
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-container">
        <FormField
          type="email"
          name="email"
          placeholder="E-posta"
          value={formData.email}
          onChange={onInputChange}
        />
        <FormField
          type="password"
          name="password"
          placeholder="Şifre"
          value={formData.password}
          onChange={onInputChange}
        />
        {!isLoginMode && (
          <FormField
            type="password"
            name="repassword"
            placeholder="Şifre Onay"
            value={formData.repassword || ""}
            onChange={onInputChange}
          />
        )}
        {error && <div className="error-message">{error}</div>}
        {isLoginMode && (
          <div className="forgot-password">
            <a href="/forgot-password">Şifremi Unuttum</a>
          </div>
        )}
        <ButtonGroup isLoginMode={isLoginMode} onToggleMode={onToggleMode} />
      </div>
    </form>
  );
};

export default LoginForm;
