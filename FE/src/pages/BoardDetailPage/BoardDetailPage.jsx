import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Ellipsis } from 'lucide-react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  createPostComment,
  deleteProjectPost,
  getPostDetail,
  updateProjectPost,
} from '../../api/TeamPage.js';
import ProfileAvatar from '../../components/ProfileAvatar/ProfileAvatar.jsx';
import PostModal from '../TeamPage/components/PostModal.jsx';
import '../TeamPage/TeamPage.css';
import './BoardDetailPage.css';

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10).replace(/-/g, '.');
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const getComments = (post) => {
  const comments = post?.commentList ?? post?.comments ?? post?.replies ?? [];
  return Array.isArray(comments) ? comments : [];
};

function CommentAvatar({ comment }) {
  const imageUrl = comment.profileImageUrl ?? comment.writerProfileImageUrl ?? comment.imageUrl;
  const writer = comment.writerName ?? comment.authorName ?? comment.nickname ?? '작성자';

  return (
    <ProfileAvatar
      src={imageUrl}
      alt={`${writer} 프로필 이미지`}
      className="board-detail__avatar"
      size="40px"
    />
  );
}

function BoardDetailPage() {
  const { postId: postIdParam } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const postId = Number(postIdParam);
  const projectId = Number(searchParams.get('projectId'));
  const projectTitle = location.state?.projectTitle || searchParams.get('projectTitle') || '';

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  const boardUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (projectId) params.set('projectId', String(projectId));
    if (projectTitle) params.set('projectTitle', projectTitle);
    const query = params.toString();
    return `/board${query ? `?${query}` : ''}`;
  }, [projectId, projectTitle]);

  const fetchPost = useCallback(async () => {
    if (!projectId || !postId) {
      setError('게시글 정보를 불러올 수 없습니다.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setPost(await getPostDetail(projectId, postId));
    } catch (fetchError) {
      setError(fetchError.message || '게시글을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [postId, projectId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    const closeMenu = (event) => {
      if (!menuRef.current?.contains(event.target)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, []);

  const comments = getComments(post);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const content = comment.trim();
    if (!content || isCommentSubmitting) return;

    try {
      setIsCommentSubmitting(true);
      const createdComment = await createPostComment(projectId, postId, content);
      setComment('');

      if (createdComment) {
        setPost((current) => ({
          ...current,
          commentList: [...getComments(current), createdComment],
        }));
      } else {
        await fetchPost();
      }
    } catch (submitError) {
      window.alert(`댓글 등록에 실패했습니다: ${submitError.message}`);
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const openEditModal = () => {
    setEditTitle(post?.title || '');
    setEditContent(post?.content || '');
    setIsMenuOpen(false);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editTitle.trim() || !editContent.trim() || isEditSubmitting) return;

    try {
      setIsEditSubmitting(true);
      const updatedPost = await updateProjectPost(projectId, postId, {
        title: editTitle.trim(),
        content: editContent.trim(),
        postType: post?.postType || 'GENERAL',
      });
      setPost((current) => ({ ...current, ...updatedPost }));
      setIsEditOpen(false);
    } catch (submitError) {
      window.alert(`게시글 수정에 실패했습니다: ${submitError.message}`);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsMenuOpen(false);
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

    try {
      await deleteProjectPost(projectId, postId);
      navigate(boardUrl, { replace: true, state: { projectTitle } });
    } catch (deleteError) {
      window.alert(`게시글 삭제에 실패했습니다: ${deleteError.message}`);
    }
  };

  return (
    <section className="board-detail" aria-labelledby="board-detail-heading">
      <div className="board-detail__content">
        <header className="board-detail__page-header">
          <h1 id="board-detail-heading" className="board-detail__page-title">
            {projectTitle ? `${projectTitle} | 게시판` : '게시판'}
          </h1>

          {post && (
            <div className="board-detail__menu" ref={menuRef}>
              <button
                type="button"
                className="board-detail__menu-button"
                aria-label="게시글 메뉴"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((open) => !open)}
              >
                <Ellipsis size={32} />
              </button>
              {isMenuOpen && (
                <div className="board-detail__menu-popup">
                  <button type="button" onClick={openEditModal}>수정</button>
                  <button type="button" className="board-detail__delete" onClick={handleDelete}>삭제</button>
                </div>
              )}
            </div>
          )}
        </header>

        {isLoading && <div className="board-detail__status">게시글을 불러오는 중...</div>}
        {!isLoading && error && <div className="board-detail__status board-detail__status--error">{error}</div>}

        {!isLoading && !error && post && (
          <div className="board-detail__cards">
            <article className="board-detail__post-card">
              <h2 className="board-detail__post-title">{post.title}</h2>
              <div className="board-detail__post-meta">
                <span>{post.writerName ?? post.authorName ?? '작성자'}</span>
                <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
              </div>
              <div className="board-detail__divider" />
              <p className="board-detail__post-body">{post.content}</p>
            </article>

            <section className="board-detail__comment-card" aria-labelledby="comment-heading">
              <h2 id="comment-heading" className="board-detail__comment-title">
                댓글 {comments.length}개
              </h2>

              <div className="board-detail__comment-list">
                {comments.map((item, index) => {
                  const writer = item.writerName ?? item.authorName ?? item.nickname ?? '작성자';
                  const createdAt = item.createdAt ?? item.updatedAt;
                  return (
                    <article className="board-detail__comment" key={item.commentId ?? item.replyId ?? index}>
                      <CommentAvatar comment={item} />
                      <div className="board-detail__comment-content">
                        <div className="board-detail__comment-meta">
                          <strong>{writer}</strong>
                          <time dateTime={createdAt}>{formatDate(createdAt)}</time>
                        </div>
                        <p>{item.content ?? item.commentContent ?? item.text}</p>
                      </div>
                    </article>
                  );
                })}
                {comments.length === 0 && (
                  <p className="board-detail__no-comments">첫 댓글을 남겨보세요.</p>
                )}
              </div>

              <form className="board-detail__comment-form" onSubmit={handleCommentSubmit}>
                <label className="board-detail__sr-only" htmlFor="board-comment">댓글 입력</label>
                <input
                  id="board-comment"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="댓글을 입력해주세요."
                  disabled={isCommentSubmitting}
                />
                <button type="submit" disabled={isCommentSubmitting}>
                  {isCommentSubmitting ? '등록 중' : '등록'}
                </button>
              </form>
            </section>
          </div>
        )}

        <button
          type="button"
          className="board-detail__back-button"
          onClick={() => navigate(boardUrl, { state: { projectTitle } })}
        >
          <ArrowLeft size={16} />
          <span>목록</span>
        </button>
      </div>

      <PostModal
        isOpen={isEditOpen}
        isEditMode
        title={editTitle}
        setTitle={setEditTitle}
        content={editContent}
        setContent={setEditContent}
        onClose={() => !isEditSubmitting && setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
        isSubmitting={isEditSubmitting}
      />
    </section>
  );
}

export default BoardDetailPage;
