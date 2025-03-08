import React from 'react';
import { useCompanyAdminComments } from '../hooks/useCompanyAdminComments';
import { formatDate } from '../utils/dateFormatter';
import './CompanyAdminComments.css';

interface CompanyAdminCommentsProps {
  useMockData?: boolean;
}

const CompanyAdminComments: React.FC<CompanyAdminCommentsProps> = ({ useMockData = true }) => {
  const { data: comments, isLoading, error } = useCompanyAdminComments(useMockData);

  if (error) {
    return (
      <div className="company-admin-comments-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="company-admin-comments-container">
      <h2 className="company-admin-comments-title">Şirket Yöneticilerinin Yorumları</h2>
      
      {isLoading ? (
        <div className="company-admin-comments-loading">
          <div className="spinner"></div>
          <p>Yorumlar yükleniyor...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="company-admin-comments-empty">
          <p>Henüz yorum bulunmuyor.</p>
        </div>
      ) : (
        <div className="company-admin-comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <div className="comment-header">
                <h3 className="comment-user">{comment.user.name}</h3>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyAdminComments; 