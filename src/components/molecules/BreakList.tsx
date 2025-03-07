import React from 'react';
import './BreakList.css';

interface Break {
  id: number;
  breakType: string;
  startTime: string;
  endTime: string;
}

const BreakList = ({ breaks }: { breaks: Break[] }) => {
  return (
    <div className="break-list">
      <h3>Molalar</h3>
      <table>
        <thead>
          <tr>
            <th>Mola Türü</th>
            <th>Başlangıç Zamanı</th>
            <th>Bitiş Zamanı</th>
          </tr>
        </thead>
        <tbody>
          {breaks.map((breakItem) => (
            <tr key={breakItem.id}>
              <td><strong>{breakItem.breakType}</strong></td>
              <td>{breakItem.startTime}</td>
              <td>{breakItem.endTime}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Alternatif liste formatı */}
      <ul>
        {breaks.map((breakItem) => (
          <li key={breakItem.id}>
            <div>
              <strong>{breakItem.breakType}</strong>
              <div className="break-time">{breakItem.startTime} - {breakItem.endTime}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BreakList;
