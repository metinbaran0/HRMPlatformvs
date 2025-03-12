import React from 'react';
import './AboutUs.css';

const AboutUs: React.FC = () => {
  return (
    <div className="about-us-section">
      <h1 className="about-us-header">Hakkımızda</h1>
      <section className="about-us-section-content">
        <h2 className="about-us-subheading">Hikayemiz</h2>
        <p className="about-us-paragraph">
          İK platformumuz, iş dünyasında çalışanların ve işverenlerin ihtiyaçlarını daha verimli bir şekilde karşılamak için
          kuruldu. Amacımız, profesyonel gelişimi destekleyen, verimli ve kullanıcı dostu bir deneyim sunarak herkesin kolayca
          ulaşabileceği bir platform sağlamaktır.
        </p>
      </section>
      <section className="about-us-section-content">
        <h2 className="about-us-subheading">Vizyon ve Misyon</h2>
        <p className="about-us-paragraph">
          Vizyonumuz, iş gücü piyasasında daha fazla erişilebilirlik ve eşit fırsatlar sağlayarak, çalışanların potansiyelini en
          üst seviyeye çıkarmaktır. Misyonumuz ise, işverenlerle çalışanları arasında sağlıklı bir ilişki kurarak verimli bir iş
          ortamı oluşturmaktır.
        </p>
      </section>
      <section className="about-us-section-content">
        <h2 className="about-us-subheading">Değerlerimiz</h2>
        <ul className="about-us-list">
          <li className="about-us-list-item">Dürüstlük ve Şeffaflık</li>
          <li className="about-us-list-item">Yenilikçilik ve Sürekli Gelişim</li>
          <li className="about-us-list-item">Topluluk Odaklılık</li>
          <li className="about-us-list-item">Çeşitlilik ve Dahil Etme</li>
        </ul>
      </section>
      <section className="about-us-section-content">
        <h2 className="about-us-subheading">Ekibimiz</h2>
        <p className="about-us-paragraph">
          Ekibimiz, iş gücü ve insan kaynakları alanında deneyimli profesyonellerden oluşmaktadır. Her biri alanında uzman olan
          ekip üyelerimiz, platformun başarısını daha da ileriye taşımak için sürekli olarak çalışmaktadır.
        </p>
      </section>
      <section className="about-us-section-content">
        <h2 className="about-us-subheading">Hedef Kitlemizin Kimler Olduğunu Anlıyoruz</h2>
        <p className="about-us-paragraph">
          Platformumuz, iş arayanlardan başlayarak, mevcut çalışanlar, yöneticiler ve insan kaynakları profesyonellerine kadar
          geniş bir hedef kitleye hitap etmektedir. İster kariyerinde yeni bir adım atmak isteyen biri olun, ister şirketiniz için
          en iyi yetenekleri arayan bir işveren, bizimle en doğru çözümü bulabilirsiniz.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
