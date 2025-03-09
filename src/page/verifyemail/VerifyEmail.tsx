import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, CircularProgress, Alert } from "@mui/material";
import axios from "axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      axios
        .get(`http://localhost:9090/v1/api/company/verify-email?token=${token}`)
        .then((response) => {
          if (response.data.success) {
            setStatus("success");

            // Kullanıcı rolüne göre yönlendirme
            const userRole = response.data.role;
            if (userRole === "SITE_ADMIN") {
              navigate("/company");
            } else if (userRole === "COMPANY_MANAGER") {
              navigate("/manager");
            } else if (userRole === "EMPLOYEE") {
              navigate("/employee");
            } else {
              navigate("/"); // Belirsiz rol -> Ana sayfa
            }
          } else {
            setStatus("error");
          }
        })
        .catch(() => setStatus("error"));
    } else {
      setStatus("error");
    }
  }, [searchParams, navigate]);

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      {status === "loading" && <CircularProgress />}
      {status === "success" && (
        <Alert severity="success">E-posta başarıyla doğrulandı! Şirketiniz incelenmek üzere sisteme kaydedildi.</Alert>
      )}
      {status === "error" && <Alert severity="error">Geçersiz veya süresi dolmuş doğrulama linki.</Alert>}
    </Container>
  );
};

export default VerifyEmail;
