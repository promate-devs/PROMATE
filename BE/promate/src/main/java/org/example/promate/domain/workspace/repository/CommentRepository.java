package org.example.promate.domain.workspace.repository;

import org.example.promate.domain.workspace.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findAllByPostIdOrderByCreatedAtAsc(Long postId);
    Optional<Comment> findByIdAndPostId(Long commentId, Long postId);
}
