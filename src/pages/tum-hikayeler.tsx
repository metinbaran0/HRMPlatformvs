import React from 'react';
import { useCompanyAdminComments } from '../hooks/useCompanyAdminComments';
import { formatDate } from '../utils/dateFormatter';
import './tum-hikayeler.css';

const TumHikayeler: React.FC = () => {
  const { data: comments, isLoading, error } = useCompanyAdminComments(true);

  return (
    <div className="tum-hikayeler-container">
      <div className="tum-hikayeler-header">
        <h1>Şirket Yöneticilerinin Yorumları</h1>
        <p>Yöneticilerimizin projeler ve hikayeler hakkındaki değerlendirmeleri</p>
      </div>
      
      {isLoading ? (
        <div className="tum-hikayeler-loading">
          <div className="spinner"></div>
          <p>Yorumlar yükleniyor...</p>
        </div>
      ) : error ? (
        <div className="tum-hikayeler-error">
          <p>{error}</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="tum-hikayeler-empty">
          <p>Henüz yorum bulunmuyor.</p>
        </div>
      ) : (
        <div className="tum-hikayeler-grid">
          {comments.map((comment) => (
            <div key={comment.id} className="story-card comment-card">
              <div className="story-content">
                <span className="story-category">Yönetici Yorumu</span>
                <div className="comment-user-info">
                  <div className="comment-avatar">
                    {comment.user.name.charAt(0)}
                  </div>
                  <h3 className="comment-user-name">{comment.user.name}</h3>
                </div>
                <p className="story-excerpt comment-text">{comment.text}</p>
                <div className="story-meta">
                  <span className="story-date">{formatDate(comment.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TumHikayeler; 