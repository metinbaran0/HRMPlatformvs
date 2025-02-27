import React, { useState } from 'react';
import LoginForm from '../components/organisms/LoginForm';
import Button from '../components/atoms/Button';
import './Login.css';
import { fetchLogin, fetchRegister } from '../store/feature/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';






interface JwtPayload {
  role: string;
}

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { error, loading } = useSelector((state: RootState) => state.user);

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
        
        const token = result?.token;

        if (token) {
          try {
            const decodedToken = jwtDecode<JwtPayload>(token); 
            const userRole = decodedToken.role;

            switch (userRole) {
              case 'employee':
                navigate('/employeeProfile');
                break;
              case 'siteadmin':
                navigate('/siteAdminProfile');
                break;
              case 'manager':
                navigate('/managerProfile');
                break;
              default:
                navigate('/');
                break;
            }
          } catch (error) {
            console.error('Token decoding error:', error);
          }
        }
      } else {
        if (!formData.repassword) return;
        
        if (formData.password !== formData.repassword) {
          alert("Passwords do not match!");
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
      console.error(isLoginMode ? 'Login error:' : 'Registration error:', error);
    }
  };

  return (
    <div className="wrapper">
      {/* UI Kodları */}
    </div>
  );
};

export default AuthPage;
