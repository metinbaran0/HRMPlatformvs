import React, { useState } from 'react';
import LoginForm from '../components/organisms/LoginForm';
import Button from '../components/atoms/Button';
import './Login.css';
import { fetchLogin, fetchRegister } from '../store/feature/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";

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
        
        if (result && result.token && result.role) {
          switch (result.role) {
            case "SITE_ADMIN":
              navigate("/company");
              break;
            case "COMPANY_ADMIN":
              navigate("/employee");
              break;
            case "EMPLOYEE":
              navigate("/profile");
              break;
            default:
              navigate("/");
          }
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
        
        setIsLoginMode(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleCtaClick = () => {
    setShowText(!showText);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({ email: "", password: "", repassword: "" });
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
    </div>
  );
};

export default AuthPage; 