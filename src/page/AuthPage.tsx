import React, { useState } from 'react';
import LoginForm from '../components/organisms/LoginForm';
import Button from '../components/atoms/Button';
import './Login.css';
import { fetchLogin, fetchRegister } from '../store/feature/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import LeaveRequestForm from './LeaveRequestForm';

const AuthPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.user);

  const [showText, setShowText] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repassword: "",
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
      if (isLoginMode) {
        const result = await dispatch(fetchLogin({ 
          email: formData.email, 
          password: formData.password 
        })).unwrap();
        
        if (result) {
          navigate('/profile');
        }
      } else {
        if (!formData.repassword) return;
        
        if (formData.password !== formData.repassword) {
          alert("Şifreler eşleşmiyor!");
          return;
        }

        await dispatch(fetchRegister({ 
          email: formData.email, 
          password: formData.password, 
          rePassword: formData.repassword 
        })).unwrap();
        
        setIsLoginMode(true); // Kayıt başarılı olunca login formuna dön
      }
    } catch (error) {
      console.error(isLoginMode ? 'Giriş hatası:' : 'Kayıt hatası:', error);
    }
  };

  const handleCtaClick = () => {
    setShowText(!showText);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({ email: "", password: "", repassword: "" }); // Form alanlarını temizle
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
            error={error || ""}
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
      <div>
        <h1>İzin Talebi Oluştur</h1>
        <LeaveRequestForm />
      </div>
    </div>
  );
};

export default AuthPage; 