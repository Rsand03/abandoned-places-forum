package ee.taltech.iti0302project.app.dto.location;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class LocationCreateDto {

    @NotNull
    @Size(min = 2, max = 100)
    private String name;

    @NotNull
    @DecimalMin(value = "-180.0")
    @DecimalMax(value = "180.0")
    private Double lon;

    @NotNull
    @DecimalMin(value = "-90.0")
    @DecimalMax(value = "90.0")
    private Double lat;

    @NotNull
    @Min(value = 1)
    @Max(value = 5000)
    private Long mainCategoryId;

    @NotNull
    @Size(max = 5)
    private List<Long> subCategoryIds;

    @NotNull
    @Min(value = 1)
    @Max(value = 50)
    private Long conditionId;

    @NotNull
    @Min(value = 1)
    @Max(value = 50)
    private Long statusId;

    @Size(max = 255)
    private String additionalInformation;

    private Integer minRequiredPointsToView = 0;

}
