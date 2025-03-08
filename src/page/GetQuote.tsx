import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  MenuItem,
} from "@mui/material";
import Navbar from "../components/organisms/Navbar";
import swal from "sweetalert"

const subscriptionPlans = ["MONTHLY", "YEARLY"];

const schema = yup.object({
  name: yup.string().min(2).max(100).required("Şirket adı zorunludur"),
  address: yup.string().min(5).max(200).required("Adres zorunludur"),
  phone: yup.string().matches(/^[0-9]+$/, "Sadece rakam girin").min(10).max(15).required("Telefon numarası zorunludur"),
  email: yup.string().email().required("E-posta zorunludur"),
  subscriptionPlan: yup.string().oneOf(subscriptionPlans).required("Abonelik planı zorunludur"),
  contactPerson: yup.string().min(2).required("İletişim kişisi adı zorunludur"),
  sector: yup.string().required("Sektör bilgisi zorunludur"),
  employeeCount: yup.number().integer().positive().required("Çalışan sayısı zorunludur"),
});

const GetQuote: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      subscriptionPlan: "",  // Başlangıç değeri boş string olmalı
    },
  });
  
  const token = useSelector<RootState, string | null>(state => state.user.token);

  const onSubmit = async (data: any) => {
    console.log("Gönderilen veri:", data); // Hata ayıklama için

    try {
      const response = await fetch("http://localhost:9090/v1/api/company/add-company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      console.log("Sunucu yanıtı:", result); // Hata ayıklama için
  
      if (response.ok) {
        swal("Başvurunuz alındı!", "Lütfen e-posta adresinize gönderilen doğrulama bağlantısını kontrol edin.", "success");
        reset();
      } else {
        swal("Hata!", result.message || "Şirket eklenirken hata oluştu.", "error");
      }
    } catch (error) {
      console.error("Hata:", error);
      swal("Hata!", "Şirket ekleme başarısız. Lütfen tekrar deneyin.", "error");
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Teklif Al
          </Typography>
          <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
            Şirketiniz için en uygun İK çözümünü sunalım
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}><TextField fullWidth label="Şirket Adı" {...register("name")} error={!!errors.name} helperText={errors.name?.message} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Adres" {...register("address")} error={!!errors.address} helperText={errors.address?.message} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="İletişim Kişisi" {...register("contactPerson")} error={!!errors.contactPerson} helperText={errors.contactPerson?.message} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="E-posta" type="email" {...register("email")} error={!!errors.email} helperText={errors.email?.message} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Telefon" {...register("phone")} error={!!errors.phone} helperText={errors.phone?.message} /></Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Abonelik Planı"
                  defaultValue=""
                  {...register("subscriptionPlan")}
                  error={!!errors.subscriptionPlan}
                  helperText={errors.subscriptionPlan?.message}
                >
                  {subscriptionPlans.map(plan => (
                    <MenuItem key={plan} value={plan}>{plan}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Sektör" {...register("sector")} error={!!errors.sector} helperText={errors.sector?.message} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth type="number" label="Çalışan Sayısı" {...register("employeeCount")} error={!!errors.employeeCount} helperText={errors.employeeCount?.message} /></Grid>
              <Grid item xs={12}><Button type="submit" variant="contained" color="primary" size="large" fullWidth>Teklif İste</Button></Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default GetQuote;