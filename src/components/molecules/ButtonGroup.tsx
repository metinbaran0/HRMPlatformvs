import React from 'react';
import Button from '../atoms/Button';

interface ButtonGroupProps {
  isLoginMode: boolean;
  onToggleMode: () => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ isLoginMode, onToggleMode }) => {
  return (
    <div className="button-group">
      <Button type="submit" className="login-btn">
        {isLoginMode ? 'Giriş Yap' : 'Kayıt Ol'}
      </Button>
      {isLoginMode && (
        <Button className="signup-btn" onClick={onToggleMode}>
          Kayıt Ol
        </Button>
      )}
    </div>
  );
};

export default ButtonGroup; 