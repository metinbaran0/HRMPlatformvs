import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments } from '../../store/feature/CommentSlice';
import { RootState, AppDispatch } from '../../store'; // RootState ve AppDispatch'i doğru yerden import et
import Swal from "sweetalert2";

const CommentListWithPagination: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // dispatch'i doğru tipte kullan
  const [page, setPage] = useState(0);

  // Redux state'den veriyi alıyoruz
  const { comments, loading, error } = useSelector((state: RootState) => state.comment);

  useEffect(() => {
    dispatch(fetchComments({ page, size: 10 }));
  }, [dispatch, page]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => (prevPage > 0 ? prevPage - 1 : 0));
  };

  if (loading) {
    return <p>Yorumlar yükleniyor...</p>;
  }

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Hata",
      text: error,
    });
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Yorumlar</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p><strong>{comment.author}</strong>: {comment.content}</p>
            <small>{comment.createdAt}</small>
          </li>
        ))}
      </ul>
      <div>
        <button onClick={handlePrevPage} disabled={page === 0}>
          Önceki
        </button>
        <button onClick={handleNextPage}>Sonraki</button>
      </div>
    </div>
  );
};

export default CommentListWithPagination;
