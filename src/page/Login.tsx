import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/organisms/LoginForm';
import Button from '../components/atoms/Button';
import './Login.css';
import { fetchLogin } from '../store/feature/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.user);

  const [showText, setShowText] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true); // İlk başta giriş yap modunda
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    try {
      const result = await dispatch(fetchLogin({ 
        email: formData.email, 
        password: formData.password 
      })).unwrap();
      
      if (result) {
        // Başarılı giriş sonrası ana sayfaya yönlendir
        navigate('/');
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
    }
  };

  const handleCtaClick = () => {
    setShowText(!showText);
  };

  const navigateToRegister = () => {
    setIsLoginMode(!isLoginMode);
  };

  return (
    <div className="wrapper">
      <div className={`login-text ${showText ? 'expand' : ''}`}>
        <Button className="cta" onClick={handleCtaClick}>
          <i className={`fas ${showText ? 'fa-chevron-up' : 'fa-chevron-down'} fa-1x`}></i>
        </Button>
        <div className={`text ${showText ? 'show-hide' : ''}`}>
          <div className="form-header">
            <h2>Giriş Yap</h2>
          </div>
          <hr />
          <LoginForm
            isLoginMode={isLoginMode}
            formData={formData}
            error={error || ""}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onToggleMode={navigateToRegister}
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
