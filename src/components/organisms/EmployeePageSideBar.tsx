import React from 'react';

interface EmployeePageSideBarProps {
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}

const EmployeePageSideBar: React.FC<EmployeePageSideBarProps> = ({ setActiveTab }) => {
  return (
    <nav className="col-sm-3 col-md-2 d-none d-sm-block bg-warning sidebar">
      <div className="list-group">
        <h3>EMPLOYEE PANEL</h3>
        <select
          className="form-select active py-3 bg-secondary text-white"
          aria-label="Default select example"
          onChange={(e) => {
            const value = e.target.value;
            switch (value) {
              case "vardiya":
                setActiveTab(1); // Vardiya ekranını aç
                break;
              case "izin-talebi":
                setActiveTab(2); // İzin Talebi ekranını aç
                break;
              case "masraflar":
                setActiveTab(3); // Masraflar ekranını aç
                break;
              case "demirbas":
                setActiveTab(4); // Demirbaşlar ekranını aç
                break;
              default:
                setActiveTab(0); // Hiçbir ekran seçilmediğinde
            }
          }}
        >
          <option value="">MENU</option>
          <option value="vardiya">Vardiya</option>
          <option value="izin-talebi">İzin Talebi</option>
          <option value="masraflar">Masraflar</option>
          <option value="demirbas">Demirbaşlar</option>
        </select>
      </div>
    </nav>
  );
};

export default EmployeePageSideBar;