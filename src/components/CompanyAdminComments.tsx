import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../utils/dateFormatter";
import { RootState } from "../store";
import { fetchComments } from "../store/feature/CommentSlice";
import "./CompanyAdminComments.css";

interface CompanyAdminCommentsProps {
  useMockData?: boolean;
  className?: string;
}

const CompanyAdminComments: React.FC<CompanyAdminCommentsProps> = ({
  useMockData = false,
  className = "",
}) => {
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector(
    (state: RootState) => state.comment
  );

  useEffect(() => {
    // Sayfa yüklendiğinde yorumları çek
    dispatch(fetchComments({}) as any);
  }, [dispatch]);

  return (
    <div className={`company-admin-comments-container ${className}`}>
      <div className="company-admin-comments-header">
        <h2 className="company-admin-comments-title">Şirket Yöneticilerinin Yorumları</h2>
        <p className="company-admin-comments-subtitle">Yöneticilerimizin projeler ve hikayeler hakkındaki değerlendirmeleri</p>
      </div>
      
      {loading ? (
        <div className="company-admin-comments-loading">
          <div className="spinner"></div>
          <p>Yorumlar yükleniyor...</p>
        </div>
      ) : error ? (
        <div className="company-admin-comments-error">
          <p>{error}</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="company-admin-comments-empty">
          <p>Henüz yorum bulunmuyor.</p>
        </div>
      ) : (
        <div className="company-admin-comments-grid">
          {comments.map((comment: any) => (
            <div key={comment.id} className="comment-card">
              <div className="comment-content">
                <span className="comment-category">Yönetici Yorumu</span>
                <div className="comment-user-info">
                  <div className="comment-avatar">
                    {comment.author ? comment.author.charAt(0) : "A"}
                  </div>
                  <h3 className="comment-user-name">{comment.author || "Anonim"}</h3>
                </div>
                <p className="comment-text">{comment.content}</p>
                <div className="comment-meta">
                  <span className="comment-date">{formatDate(comment.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyAdminComments;
