import React, { useState } from 'react';
import LoginForm from '../components/organisms/LoginForm';
import Button from '../components/atoms/Button';
import './Login.css';

const Login = () => {
  const [showText, setShowText] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    repassword: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Lütfen tüm alanları doldurunuz');
      return;
    }
    
    console.log('Form gönderildi:', formData);
  };

  const handleCtaClick = () => {
    setShowText(!showText);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setFormData({
      email: '',
      password: '',
      repassword: '',
    });
  };

  return (
    <div className="wrapper">
      <div className={`login-text ${showText ? 'expand' : ''}`}>
        <Button className="cta" onClick={handleCtaClick}>
          <i className={`fas ${showText ? 'fa-chevron-up' : 'fa-chevron-down'} fa-1x`}></i>
        </Button>
        <div className={`text ${showText ? 'show-hide' : ''}`}>
          <div className="form-header">
            {!isLoginMode && (
              <Button className="back-btn" onClick={toggleMode}>
                <i className="fas fa-arrow-left"></i>
              </Button>
            )}
            <h2>{isLoginMode ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
          </div>
          <hr />
          <LoginForm
            isLoginMode={isLoginMode}
            formData={formData}
            error={error}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onToggleMode={toggleMode}
          />
        </div>
      </div>
      <div className="call-text">
        <h1>HR Manager'a <span>Hoş Geldiniz</span></h1>
        <p>İnsan kaynakları yönetimini kolaylaştıran profesyonel çözüm</p>
        <Button onClick={handleCtaClick}>Hemen Başlayın</Button>
      </div>
    </div>
  );
};

export default Login;
