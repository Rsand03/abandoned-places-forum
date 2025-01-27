package ee.taltech.iti0302project.app.dto.mapper.shopping;

import ee.taltech.iti0302project.app.dto.shopping.ProductDto;
import ee.taltech.iti0302project.app.entity.ProductQuantityEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductQuantityMapper {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "name")
    ProductDto toDto(ProductQuantityEntity entity);

}
