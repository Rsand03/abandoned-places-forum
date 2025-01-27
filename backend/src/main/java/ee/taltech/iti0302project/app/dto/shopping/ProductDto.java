package ee.taltech.iti0302project.app.dto.shopping;

import lombok.Data;

@Data
public class ProductDto {

    private Long productId;
    private String name;
    private Integer quantity;

}
