import React from 'react';
import FormField from '../../components/molecules/FormField';
import ButtonGroup from '../../components/molecules/ButtonGroup';


interface LoginFormProps {
  isLoginMode: boolean;
  formData: {
    email: string;
    password: string;
    repassword: string;
  };
  error: string;
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
          <div className="name-inputs">
               <FormField
          type="repassword"
          name="repassword"
          placeholder="Şifreyi Onayla"
          value={formData.password}
          onChange={onInputChange}
        />
          </div>
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