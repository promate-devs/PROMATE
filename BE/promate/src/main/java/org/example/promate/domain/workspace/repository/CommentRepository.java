package org.example.promate.domain.workspace.repository;

import org.example.promate.domain.project.entity.Member;
import org.example.promate.domain.workspace.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("select c from Comment c " +
            "join fetch c.member m " +
            "join fetch m.user u " +
            "where c.post.id = :postId")
    List<Comment> findAllByPostIdWithMemberAndUser(@Param("postId") Long postId);

    boolean existsByIdAndPostId(Long commentId, Long postId);

    Optional<Comment> findByIdAndMember(Long commentId, Member member);
}
