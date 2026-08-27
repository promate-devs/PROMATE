package org.example.promate.domain.project.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
@JsonPropertyOrder({"projectId", "updatedAt"})
@AllArgsConstructor
public class UpdatedProjectResponseDto {
    Long projectId;
    LocalDateTime updatedAt;
}
