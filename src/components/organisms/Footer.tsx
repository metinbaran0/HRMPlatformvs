import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Platform */}
        <div className="footer-section">
          <h3>Platform</h3>
          <ul>
            <li><a href="/features">Özellikler</a></li>
            <li><a href="/integrations">Entegrasyonlar</a></li>
            <li><a href="/api-docs">API Dokümantasyonu</a></li>
            <li><a href="/pricing">Fiyatlandırma</a></li>
          </ul>
        </div>
        
        {/* Şirket */}
        <div className="footer-section">
          <h3>Şirket</h3>
          <ul>
            <li><a href="/about">Hakkımızda</a></li>
            <li><a href="/team">Ekibimiz</a></li>
            <li><a href="/careers">İş İlanları</a></li>
            <li><a href="/customers">Müşterilerimiz</a></li>
          </ul>
        </div>
        
        {/* Destek */}
        <div className="footer-section">
          <h3>Destek</h3>
          <ul>
            <li><a href="/contact">İletişim</a></li>
            <li><a href="/help">Yardım Merkezi</a></li>
            <li><a href="/security">Güvenlik</a></li>
            <li><a href="/terms">Kullanım Şartları</a></li>
          </ul>
        </div>
        
        {/* Kaynaklar */}
        <div className="footer-section">
          <h3>Kaynaklar</h3>
          <ul>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/webinars">Web Seminerleri</a></li>
            <li><a href="/ebooks">e-Kitaplar</a></li>
            <li><a href="/templates">Şablonlar</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} İnsan Kaynakları Yönetimi Platformu. Tüm hakları saklıdır.
      </div>
    </footer>
  );
};

export default Footer;
