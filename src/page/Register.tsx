import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/organisms/LoginForm';
import Button from '../components/atoms/Button';
import './Login.css';
import { fetchRegister } from '../store/feature/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.user);

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showText, setShowText] = useState(false);
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

    if (!formData.email || !formData.password || !formData.repassword) {
      return;
    }

    // Şifre kontrolü
    if (formData.password !== formData.repassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }

    try {
      await dispatch(fetchRegister({ 
        email: formData.email, 
        password: formData.password, 
        rePassword: formData.repassword 
      })).unwrap();
      
      // Başarılı kayıt sonrası login sayfasına yönlendir
      navigate('/login');
    } catch (error) {
      console.error('Kayıt hatası:', error);
    }
  };

  const handleCtaClick = () => {
    setShowText(!showText);
  };

  const toggleMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <div className="wrapper">
      <div className={`login-text ${showText ? 'expand' : ''}`}>
        <Button className="cta" onClick={handleCtaClick}>
          <i className={`fas ${showText ? 'fa-chevron-up' : 'fa-chevron-down'} fa-1x`}></i>
        </Button>
        <div className={`text ${showText ? 'show-hide' : ''}`}>
          <div className="form-header">
            <Button className="back-btn" onClick={toggleMode} >
              <i className="fas fa-arrow-left"></i>
            </Button>
            <h2>Kayıt Ol</h2>
          </div>
          <hr />
          <LoginForm
            isLoginMode={false}
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

export default Register;
